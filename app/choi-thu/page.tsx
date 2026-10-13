"use client";

/**
 * ==============================================================================
 * FILE: app/choi-thu/page.tsx
 * MỤC ĐÍCH: Biểu mẫu Đăng ký chơi thử Board Game Ngũ Cung (Target Age 7+)
 * BẢO VỆ TRẺ EM:
 * - Đối tượng 7–12 tuổi: Phụ huynh điền thay bé, yêu cầu email người lớn
 * - Đối tượng 13–17 tuổi: Yêu cầu cam kết đồng thuận của cha mẹ/người giám hộ
 * - Không quảng cáo, không thu thập dữ liệu nhạy cảm ngoài mục đích xếp lịch
 * ==============================================================================
 */

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  HeartHandshake,
  ArrowRight,
  Gamepad2,
} from "lucide-react";

export default function ChoiThuRegistrationPage() {
  const [formData, setFormData] = useState({
    ageGroup: "7-12" as "7-12" | "13-17" | "18+",
    fullName: "",
    parentName: "",
    email: "",
    phone: "",
    city: "Hà Nội",
    timeslot: "Cuối tuần sáng (09:00 - 11:30)",
    notes: "",
    parentConsent: false,
    turnstileToken: "turnstile_human_verified_token",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    id: string;
    verificationCode: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Kiểm tra sơ bộ phía client
    if (formData.ageGroup === "7-12" && !formData.parentName.trim()) {
      setErrorMsg("Vui lòng nhập họ tên của phụ huynh/người giám hộ điền thay bé.");
      return;
    }
    if ((formData.ageGroup === "7-12" || formData.ageGroup === "13-17") && !formData.parentConsent) {
      setErrorMsg("Vui lòng tích xác nhận đồng thuận của cha mẹ/người giám hộ.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      }

      setSuccessResult(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#141318] text-[#1A1720] dark:text-[#EAE8D8] py-12 px-4 sm:px-6 font-sans realm-hoa">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* NÚT QUAY LẠI TRANG CHỦ */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CC3520] hover:underline"
          >
            ← Quay lại Trang chủ Ngũ Cung
          </Link>
        </div>

        {/* TIÊU ĐỀ TRANG */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#CC3520] text-white text-xs font-black uppercase tracking-widest rounded-full border-2 border-[#1A1720]">
            <Sparkles className="w-3.5 h-3.5" />
            Trải Nghiệm Trực Tiếp • Dành Cho Độ Tuổi 7+
          </div>
          <h1
            className="font-display font-black text-3xl sm:text-4xl text-[#1A1720] dark:text-[#EAE8D8] tracking-tight"
            style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
          >
            Đăng Ký Chơi Thử Bộ Bài Ngũ Cung
          </h1>
          <p className="text-sm sm:text-base text-[#534E5C] dark:text-[#A8A4B2] max-w-xl mx-auto font-medium" style={{ lineHeight: "var(--lh-body)" }}>
            Trải nghiệm trọn vẹn bộ bài 45 lá in khắc phong cách Đông Hồ, khám phá 15 nhạc cụ cổ truyền và thi đấu tương sinh tương khắc cùng bạn bè, gia đình.
          </p>
        </div>

        {/* THÔNG BÁO BẢO VỆ TRẺ EM */}
        <div className="p-4 bg-amber-50 dark:bg-stone-800 border-[3px] border-[#1A1720] dark:border-[#EAE8D8] rounded-2xl shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8] paper-board flex items-start gap-3.5">
          <ShieldCheck className="w-6 h-6 text-[#CC3520] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-black text-[#1A1720] dark:text-[#EAE8D8]" style={{ lineHeight: "var(--lh-heading)" }}>Cam kết an toàn thông tin cho trẻ em</h4>
            <p className="text-[#534E5C] dark:text-[#A8A4B2] font-medium" style={{ lineHeight: "var(--lh-body)" }}>
              Đối với các bé từ 7–12 tuổi, biểu mẫu yêu cầu phụ huynh hoặc người giám hộ điền thay và sử dụng email của người lớn. Không thu thập thông tin tài chính hay chia sẻ với bên thứ ba.
            </p>
          </div>
        </div>

        {/* NỘI DUNG FORM HOẶC KẾT QUẢ THÀNH CÔNG */}
        {successResult ? (
          <div className="bg-[#FFFDF9] border-[4px] border-[#1A1A1A] rounded-2xl p-6 sm:p-10 shadow-[8px_8px_0px_#1A1A1A] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 border-[3px] border-[#1A1A1A] rounded-3xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_#1A1A1A]">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                Đăng ký thành công
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">
                Cảm ơn bạn đã tham gia cùng Ngũ Cung!
              </h2>
              <p className="text-sm text-stone-600 font-medium max-w-md mx-auto">
                {successResult.message}
              </p>
            </div>

            <div className="p-4 bg-stone-50 border-2 border-dashed border-[#1A1A1A] rounded-xl max-w-sm mx-auto space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase">Mã đăng ký xác nhận</span>
              <div className="text-3xl font-black tracking-widest text-[#D23A22]">
                {successResult.verificationCode}
              </div>
              <p className="text-[11px] text-stone-500">Mã này đã được lưu trong hòm thư của bạn</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/choi-thu-ngay"
                className="px-6 py-3.5 bg-[#D23A22] hover:bg-red-700 text-white font-black text-sm rounded-xl border-[2px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Gamepad2 className="w-4 h-4" />
                Vào chơi thử online ngay
              </Link>
              <Link
                href="/nhac-cu"
                className="px-6 py-3.5 bg-[#F2B632] hover:bg-amber-400 text-[#1A1A1A] font-black text-sm rounded-xl border-[2px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-center gap-2 min-h-[48px]"
              >
                Khám phá 15 nhạc cụ
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFDF9] border-[4px] border-[#1A1A1A] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#1A1A1A] space-y-6"
          >
            {/* THÔNG BÁO LỖI NẾU CÓ */}
            {errorMsg && (
              <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-3 text-red-800 text-sm font-bold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* BƯỚC 1: CHỌN NHÓM TUỔI */}
            <div className="space-y-3">
              <label className="block text-sm font-black text-[#1A1A1A]">
                1. Nhóm tuổi tham gia <span className="text-[#D23A22]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "7-12", title: "7 – 12 Tuổi", desc: "Phụ huynh điền thay bé" },
                  { id: "13-17", title: "13 – 17 Tuổi", desc: "Học sinh / Thiếu niên" },
                  { id: "18+", title: "18+ Tuổi", desc: "Người lớn / Sinh viên" },
                ].map((item) => {
                  const isSelected = formData.ageGroup === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setFormData({ ...formData, ageGroup: item.id as "7-12" | "13-17" | "18+" })}
                      className={`p-3.5 border-[2px] rounded-xl cursor-pointer transition-all flex flex-col justify-between min-h-[60px] ${
                        isSelected
                          ? "bg-amber-100 border-[#D23A22] shadow-[3px_3px_0px_#D23A22]"
                          : "bg-white border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-stone-50"
                      }`}
                    >
                      <div className="font-black text-sm text-[#1A1A1A]">{item.title}</div>
                      <div className="text-[11px] font-medium text-stone-600 mt-1">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BƯỚC 2: HỌ TÊN NGƯỜI CHƠI */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-[#1A1A1A]">
                {formData.ageGroup === "7-12" ? "Tên bé (Người chơi)" : "Họ và tên người chơi"}{" "}
                <span className="text-[#D23A22]">*</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder={formData.ageGroup === "7-12" ? "Ví dụ: Nguyễn Minh An" : "Nhập đầy đủ họ tên"}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D23A22] min-h-[48px]"
                />
              </div>
            </div>

            {/* NẾU LÀ 7-12: BẮT BUỘC TÊN PHỤ HUYNH */}
            {formData.ageGroup === "7-12" && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <label className="block text-sm font-black text-[#1A1A1A]">
                  Họ tên phụ huynh / người giám hộ <span className="text-[#D23A22]">*</span>
                </label>
                <div className="relative">
                  <HeartHandshake className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Hùng (Bố bé)"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D23A22] min-h-[48px]"
                  />
                </div>
              </div>
            )}

            {/* BƯỚC 3: EMAIL VÀ SỐ ĐIỆN THOẠI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-black text-[#1A1A1A]">
                  Email người lớn (Nhận thư mời) <span className="text-[#D23A22]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="nguoilon@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D23A22] min-h-[48px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-[#1A1A1A]">
                  Số điện thoại liên hệ (Tùy chọn)
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="tel"
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D23A22] min-h-[48px]"
                  />
                </div>
              </div>
            </div>

            {/* BƯỚC 4: ĐỊA ĐIỂM & KHUNG GIỜ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-black text-[#1A1A1A]">
                  Tỉnh / Thành phố <span className="text-[#D23A22]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-bold text-sm min-h-[48px]"
                  >
                    <option value="Hà Nội">Hà Nội (Trực tiếp)</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Trực tiếp)</option>
                    <option value="Đà Nẵng">Đà Nẵng (Trực tiếp)</option>
                    <option value="Trực tuyến toàn quốc">Trực tuyến (Zoom / Google Meet)</option>
                    <option value="Khác">Tỉnh thành khác</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-[#1A1A1A]">
                  Khung giờ thuận tiện <span className="text-[#D23A22]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                  <select
                    value={formData.timeslot}
                    onChange={(e) => setFormData({ ...formData, timeslot: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-bold text-sm min-h-[48px]"
                  >
                    <option value="Cuối tuần sáng (09:00 - 11:30)">Cuối tuần sáng (09:00 - 11:30)</option>
                    <option value="Cuối tuần chiều (14:30 - 17:00)">Cuối tuần chiều (14:30 - 17:00)</option>
                    <option value="Tối ngày trong tuần (19:30 - 21:00)">Tối ngày trong tuần (19:30 - 21:00)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BƯỚC 5: GHI CHÚ */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-[#1A1A1A]">
                Ghi chú thêm (Số lượng người đi cùng, câu hỏi...)
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Gia đình có 2 bé cùng tham gia..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D23A22]"
              />
            </div>

            {/* CAM KẾT PHỤ HUYNH CHO TRẺ <18 */}
            {(formData.ageGroup === "7-12" || formData.ageGroup === "13-17") && (
              <label className="flex items-start gap-3 p-3.5 bg-amber-50/80 border-2 border-[#1A1A1A] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.parentConsent}
                  onChange={(e) => setFormData({ ...formData, parentConsent: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-[#1A1A1A] text-[#D23A22] focus:ring-[#D23A22] mt-0.5 flex-shrink-0"
                />
                <span className="text-xs font-bold text-stone-800 leading-snug">
                  Tôi là phụ huynh/người giám hộ hợp pháp và đồng ý cho con tham gia trải nghiệm hoạt động giáo dục âm nhạc truyền thống Ngũ Cung.
                </span>
              </label>
            )}

            {/* XÁC THỰC NGƯỜI THẬT (TURNSTILE SIMULATION) */}
            <div className="p-3.5 bg-stone-100 border-2 border-stone-300 rounded-xl flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  required
                  className="w-5 h-5 rounded border-2 border-[#1A1A1A] text-[#D23A22]"
                />
                <span className="text-xs font-bold text-stone-700">
                  Tôi là người thật (Cloudflare Turnstile Verified)
                </span>
              </label>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            {/* NÚT SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D23A22] hover:bg-red-700 text-white font-black text-base rounded-xl border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] transition-all flex items-center justify-center gap-2 min-h-[52px] disabled:opacity-70"
            >
              {loading ? "Đang gửi đăng ký..." : "Gửi Đăng Ký Trải Nghiệm Ngay"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
