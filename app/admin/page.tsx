"use client";

/**
 * ==============================================================================
 * FILE: app/admin/page.tsx
 * MỤC ĐÍCH: Bảng điều khiển Quản trị Nội bộ Ngũ Cung (Admin Dashboard)
 * TÍNH NĂNG:
 * - Thống kê tổng lượt đăng ký, phân bổ độ tuổi (7-12, 13-17, 18+)
 * - Phễu đo lường nhu cầu cộng đồng (Demand Evidence Funnel)
 * - Tải xuống tệp CSV chuẩn UTF-8 BOM cho ban tổ chức
 * - Tôn trọng quyền riêng tư (Zero third-party trackers)
 * ==============================================================================
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
} from "lucide-react";
import { RegistrationRecord } from "@/lib/registrationSchema";

export default function AdminDashboardPage() {
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [ageStats, setAgeStats] = useState<{ "7-12": number; "13-17": number; "18+": number }>({
    "7-12": 0,
    "13-17": 0,
    "18+": 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filterAge, setFilterAge] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      if (res.ok) {
        setRecords(data.records || []);
        setTotal(data.total || 0);
        setAgeStats(data.ageStats || { "7-12": 0, "13-17": 0, "18+": 0 });
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRecords = records.filter((r) => {
    const matchAge = filterAge === "all" || r.ageGroup === filterAge;
    const matchSearch =
      !searchTerm ||
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.parentName && r.parentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchAge && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER ADMIN */}
        <header className="bg-[#FFFDF9] border-[3px] border-[#1A1A1A] p-6 rounded-2xl shadow-[6px_6px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#1A1A1A] text-white text-xs font-black uppercase tracking-wider rounded-md">
                Admin Console
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">
                Quản Trị Đăng Ký Chơi Thử Ngũ Cung
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Báo cáo nhu cầu thực tế • Phân tích độ tuổi 7+ • Xuất dữ liệu bảo mật
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl hover:bg-stone-50 font-bold text-xs flex items-center gap-1.5 min-h-[44px] shadow-[2px_2px_0px_#1A1A1A]"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>

            <a
              href="/api/admin/registrations?format=csv"
              download
              className="px-4 py-2.5 bg-[#D23A22] hover:bg-red-700 text-white border-2 border-[#1A1A1A] rounded-xl font-black text-xs flex items-center gap-2 min-h-[44px] shadow-[3px_3px_0px_#1A1A1A]"
            >
              <Download className="w-4 h-4" />
              Xuất File CSV (UTF-8)
            </a>
          </div>
        </header>

        {/* THẺ THỐNG KÊ (METRICS & DEMAND FUNNEL) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tổng đăng ký */}
          <div className="p-5 bg-[#FFFDF9] border-[3px] border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-black uppercase">
              <span>Tổng Đăng Ký</span>
              <Users className="w-4 h-4 text-[#D23A22]" />
            </div>
            <div className="text-3xl font-black text-[#1A1A1A]">{total}</div>
            <div className="text-[11px] font-bold text-emerald-700">
              ✓ Nhu cầu trải nghiệm thực tế
            </div>
          </div>

          {/* Trẻ em 7 - 12 (Phụ huynh điền) */}
          <div className="p-5 bg-[#FFFDF9] border-[3px] border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-black uppercase">
              <span>Độ Tuổi 7–12 (Phụ huynh)</span>
              <Shield className="w-4 h-4 text-[#F2B632]" />
            </div>
            <div className="text-3xl font-black text-[#D23A22]">{ageStats["7-12"]}</div>
            <div className="text-[11px] font-bold text-stone-600">
              Chiếm {total > 0 ? Math.round((ageStats["7-12"] / total) * 100) : 0}% tổng số đơn
            </div>
          </div>

          {/* Thiếu niên 13 - 17 */}
          <div className="p-5 bg-[#FFFDF9] border-[3px] border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-black uppercase">
              <span>Độ Tuổi 13–17</span>
              <Layers className="w-4 h-4 text-[#3F7D3B]" />
            </div>
            <div className="text-3xl font-black text-[#1A1A1A]">{ageStats["13-17"]}</div>
            <div className="text-[11px] font-bold text-stone-600">
              Học sinh & thiếu niên
            </div>
          </div>

          {/* Người lớn 18+ */}
          <div className="p-5 bg-[#FFFDF9] border-[3px] border-[#1A1A1A] rounded-2xl shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-black uppercase">
              <span>Độ Tuổi 18+</span>
              <Sparkles className="w-4 h-4 text-[#1F3F7E]" />
            </div>
            <div className="text-3xl font-black text-[#1A1A1A]">{ageStats["18+"]}</div>
            <div className="text-[11px] font-bold text-stone-600">
              Người yêu nhạc dân gian
            </div>
          </div>
        </section>

        {/* BẢNG DANH SÁCH CHI TIẾT */}
        <section className="bg-[#FFFDF9] border-[3px] border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0px_#1A1A1A] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-200 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#1A1A1A]">
                Danh Sách Người Đăng Ký ({filteredRecords.length})
              </h2>
            </div>

            {/* BỘ LỌC VÀ TÌM KIẾM */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm tên, email, tỉnh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-white border-2 border-[#1A1A1A] rounded-xl text-xs font-bold min-h-[40px] w-48 focus:outline-none"
                />
              </div>

              <select
                value={filterAge}
                onChange={(e) => setFilterAge(e.target.value)}
                className="bg-white border-2 border-[#1A1A1A] px-3 py-2 rounded-xl text-xs font-bold min-h-[40px]"
              >
                <option value="all">Tất cả nhóm tuổi</option>
                <option value="7-12">7–12 (Phụ huynh)</option>
                <option value="13-17">13–17</option>
                <option value="18+">18+</option>
              </select>
            </div>
          </div>

          {/* BẢNG DỮ LIỆU */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1A1A1A] bg-stone-100 text-stone-700 font-black">
                  <th className="p-3">Mã ĐK</th>
                  <th className="p-3">Họ Tên</th>
                  <th className="p-3">Nhóm Tuổi</th>
                  <th className="p-3">Phụ Huynh</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Tỉnh/TP</th>
                  <th className="p-3">Khung Giờ</th>
                  <th className="p-3">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-500 italic">
                      Chưa có đơn đăng ký nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-stone-500">{r.id.split("_")[1]}</td>
                      <td className="p-3 font-black text-stone-900">{r.fullName}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            r.ageGroup === "7-12"
                              ? "bg-amber-200 text-amber-900"
                              : r.ageGroup === "13-17"
                              ? "bg-emerald-200 text-emerald-900"
                              : "bg-blue-200 text-blue-900"
                          }`}
                        >
                          {r.ageGroup}
                        </span>
                      </td>
                      <td className="p-3 text-stone-700">{r.parentName || "—"}</td>
                      <td className="p-3 text-stone-700">{r.email}</td>
                      <td className="p-3 font-bold">{r.city}</td>
                      <td className="p-3 text-stone-600">{r.timeslot}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-black">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Đã lưu
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
