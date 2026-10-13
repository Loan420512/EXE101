/**
 * ==============================================================================
 * FILE: app/api/register/route.ts
 * MỤC ĐÍCH: API tiếp nhận và xử lý đăng ký chơi thử Ngũ Cung (Target Age 7+)
 * BẢO MẬT:
 * - Kiểm tra rate limit theo IP
 * - Xác thực toàn diện qua Zod schema
 * - Lưu trữ file JSON bền vững tại storage/registrations
 * - Mô phỏng email xác nhận hai bước (Double Opt-In) tại storage/emails
 * ==============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { RegistrationSchema, RegistrationRecord } from "@/lib/registrationSchema";

// Rate limiting đơn giản trong bộ nhớ: max 5 lần / 10 phút / IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestHistory = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipRequestHistory.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  timestamps.push(now);
  ipRequestHistory.set(ip, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 10 phút." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = RegistrationSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message || "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Giả lập kiểm tra Turnstile Token
    if (!data.turnstileToken || data.turnstileToken === "invalid") {
      return NextResponse.json(
        { error: "Xác thực chống bot thất bại. Vui lòng tích chọn lại." },
        { status: 403 }
      );
    }

    const id = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const record: RegistrationRecord = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      status: "pending_verification",
      verificationCode,
    };

    // Đảm bảo thư mục lưu trữ tồn tại
    const storageDir = path.join(process.cwd(), "storage", "registrations");
    const emailsDir = path.join(process.cwd(), "storage", "emails");
    if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
    if (!fs.existsSync(emailsDir)) fs.mkdirSync(emailsDir, { recursive: true });

    // Đọc và ghi thêm vào danh sách đăng ký
    const filePath = path.join(storageDir, "registrations.json");
    let records: RegistrationRecord[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        records = JSON.parse(fileContent);
      } catch {
        records = [];
      }
    }
    records.push(record);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");

    // Tạo thư xác nhận giả lập Double Opt-In
    const emailPayload = {
      to: data.email,
      recipientName: data.ageGroup === "7-12" ? data.parentName : data.fullName,
      subject: "Xác nhận tham gia buổi trải nghiệm board game Ngũ Cung (Target Age 7+)",
      verificationCode,
      ageGroup: data.ageGroup,
      timeslot: data.timeslot,
      city: data.city,
      sentAt: new Date().toISOString(),
      content: `Kính gửi ${data.ageGroup === "7-12" ? `Phụ huynh ${data.parentName} và bé ${data.fullName}` : data.fullName},
Cảm ơn bạn đã đăng ký trải nghiệm bộ bài âm nhạc dân gian Ngũ Cung!
Mã xác nhận tham gia của bạn là: ${verificationCode}.
Buổi trải nghiệm được thiết kế an toàn, bổ ích và tràn đầy âm thanh ngũ hành cổ truyền.`,
    };

    fs.writeFileSync(
      path.join(emailsDir, `${id}.json`),
      JSON.stringify(emailPayload, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      id,
      verificationCode,
      message:
        data.ageGroup === "7-12"
          ? "Đăng ký thành công! Email hướng dẫn đã gửi tới phụ huynh."
          : "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận lịch trải nghiệm.",
    });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ trong quá trình đăng ký." },
      { status: 500 }
    );
  }
}
