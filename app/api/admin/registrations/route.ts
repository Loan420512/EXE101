/**
 * ==============================================================================
 * FILE: app/api/admin/registrations/route.ts
 * MỤC ĐÍCH: API quản trị nội bộ lấy danh sách đăng ký và xuất dữ liệu CSV UTF-8
 * ==============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { RegistrationRecord } from "@/lib/registrationSchema";

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "storage", "registrations", "registrations.json");
    let records: RegistrationRecord[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        records = JSON.parse(fileContent);
      } catch {
        records = [];
      }
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    // Xuất CSV nếu có query format=csv
    if (format === "csv") {
      const headers = [
        "Mã ĐK",
        "Ngày tạo",
        "Nhóm tuổi",
        "Họ tên",
        "Phụ huynh (nếu <13)",
        "Email",
        "Số ĐT",
        "Tỉnh/TP",
        "Khung giờ",
        "Ghi chú",
        "Trạng thái",
      ];

      const rows = records.map((r) => [
        `"${r.id}"`,
        `"${r.createdAt}"`,
        `"${r.ageGroup}"`,
        `"${(r.fullName || "").replace(/"/g, '""')}"`,
        `"${(r.parentName || "").replace(/"/g, '""')}"`,
        `"${r.email}"`,
        `"${r.phone || ""}"`,
        `"${r.city}"`,
        `"${r.timeslot}"`,
        `"${(r.notes || "").replace(/"/g, '""')}"`,
        `"${r.status}"`,
      ]);

      // Chuẩn UTF-8 BOM để Excel hiển thị đúng tiếng Việt có dấu
      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="ngucung_registrations_${Date.now()}.csv"`,
        },
      });
    }

    // Thống kê phân bố theo nhóm tuổi
    const ageStats = {
      "7-12": records.filter((r) => r.ageGroup === "7-12").length,
      "13-17": records.filter((r) => r.ageGroup === "13-17").length,
      "18+": records.filter((r) => r.ageGroup === "18+").length,
    };

    return NextResponse.json({
      records,
      total: records.length,
      ageStats,
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách đăng ký:", err);
    return NextResponse.json({ error: "Lỗi máy chủ khi truy vấn dữ liệu." }, { status: 500 });
  }
}
