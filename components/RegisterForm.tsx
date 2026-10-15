"use client";

/**
 * ==============================================================================
 * FILE: components/RegisterForm.tsx
 * MỤC ĐÍCH: Form đăng ký tham gia chơi thử nghiệm board game Ngũ Cung (chế độ mô phỏng).
 * QUY CÁCH:
 * - Các trường: Họ và tên, Email, Nhóm tuổi (Dưới 18, 18-24, 25-34, Trên 35)
 * - Khi gửi: Hiển thị thông báo "Đây là bản xem trước nên chưa lưu dữ liệu"
 * - Dòng nhắc: "Học sinh dưới 18 tuổi cần có sự đồng ý của phụ huynh"
 * ==============================================================================
 */

import React, { useState } from "react";
import { IconSparkles, IconWarning } from "@/components/icons";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [ageGroup, setAgeGroup] = useState("13-17");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert("Vui lòng điền đầy đủ họ tên và email!");
      return;
    }

    // Hiển thị thông báo mô phỏng chuẩn theo yêu cầu
    setSubmittedMessage("Đây là bản xem trước nên chưa lưu dữ liệu. Cảm ơn bạn đã quan tâm đến dự án Ngũ Cung!");
  };

  return (
    <section id="dang-ky" className="hide-in-kid-mode py-20 realm-hoa relative overflow-hidden">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-[#1D1B22] rounded-[4px] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[6px_6px_0px_#16141A] dark:shadow-[6px_6px_0px_#E8EAE0] p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="text-xs font-black tracking-widest uppercase text-[#D23A22] block mb-1">
              ĐỢT TRẢI NGHIỆM ĐẦU TIÊN
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#16141A] dark:text-[#E8EAE0]">
              Đăng ký chơi thử
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#524F59] dark:text-[#A8A6B0]">
              Trở thành những người đầu tiên cầm trên tay bộ bài Ngũ Cung và cùng nhóm tác giả hoàn thiện trải nghiệm.
            </p>
          </div>

          {submittedMessage ? (
            <div className="p-4 rounded bg-[#3F7D3B]/15 border-2 border-[#3F7D3B] text-center space-y-3">
              <IconSparkles size={30} className="text-[#F2B632]" aria-hidden />
              <p className="text-sm font-bold text-[#16141A] dark:text-[#E8EAE0]">
                {submittedMessage}
              </p>
              <button
                onClick={() => setSubmittedMessage(null)}
                className="dongho-btn px-4 py-1.5 bg-[#16141A] text-white dark:bg-[#E8EAE0] dark:text-[#16141A] text-xs font-bold"
              >
                Gửi lại lượt khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* HỌ VÀ TÊN */}
              <div>
                <label className="block text-xs font-bold text-[#16141A] dark:text-[#E8EAE0] uppercase mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-[3px] border-2 border-[#16141A] dark:border-[#E8EAE0] bg-[#E8EAE0]/30 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D23A22]"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-bold text-[#16141A] dark:text-[#E8EAE0] uppercase mb-1">
                  Địa chỉ Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-[3px] border-2 border-[#16141A] dark:border-[#E8EAE0] bg-[#E8EAE0]/30 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D23A22]"
                />
              </div>

              {/* NHÓM TUỔI — 7+ theo quyết định dự án */}
              <div>
                <label className="block text-xs font-bold text-[#16141A] dark:text-[#E8EAE0] uppercase mb-1">
                  Nhóm tuổi
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-[3px] border-2 border-[#16141A] dark:border-[#E8EAE0] bg-[#E8EAE0]/30 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D23A22]"
                >
                  <option value="7-12">7 – 12 tuổi (Phụ huynh điền thay bé)</option>
                  <option value="13-17">13 – 17 tuổi (Học sinh THCS / THPT)</option>
                  <option value="18-plus">Từ 18 tuổi trở lên (Sinh viên, gia đình)</option>
                </select>
              </div>

              {/* DÒNG NHẮC PHỤ HUYNH — khớp quyết định 7+ */}
              {ageGroup === "7-12" && (
                <div className="p-3 rounded bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 text-[11px] text-[#524F59] dark:text-[#A8A6B0]">
                  <span className="inline-flex items-center gap-1 align-[-2px]"><IconWarning size={14} aria-hidden /></span>{" "}
                  <strong>Nhóm 7 – 12 tuổi:</strong> Phụ huynh vui lòng điền họ tên và email của mình thay cho bé. Thông tin chỉ dùng để liên lạc về buổi chơi thử.
                </div>
              )}

              {/* NÚT GỬI */}
              <button
                type="submit"
                className="w-full py-3 rounded-[4px] bg-[#D23A22] text-white font-display font-black text-sm border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0] hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Gửi thông tin đăng ký chơi thử
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
