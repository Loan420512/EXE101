/**
 * ==============================================================================
 * FILE: lib/registrationSchema.ts
 * MỤC ĐÍCH: Zod schema xác thực dữ liệu Đăng ký chơi thử Ngũ Cung (Target Age 7+)
 * ==============================================================================
 */

import { z } from "zod";

export const RegistrationSchema = z
  .object({
    ageGroup: z.enum(["7-12", "13-17", "18+"], {
      message: "Vui lòng chọn nhóm tuổi phù hợp.",
    }),
    fullName: z
      .string()
      .min(2, "Họ và tên cần ít nhất 2 ký tự.")
      .max(60, "Họ và tên tối đa 60 ký tự."),
    parentName: z.string().max(60).optional(),
    email: z
      .string()
      .email("Địa chỉ email không hợp lệ (cần email người lớn để nhận xác nhận)."),
    phone: z
      .string()
      .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại Việt Nam không đúng định dạng.")
      .optional()
      .or(z.literal("")),
    city: z.string().min(2, "Vui lòng chọn hoặc nhập Tỉnh/Thành phố."),
    timeslot: z.string().min(2, "Vui lòng chọn khung giờ trải nghiệm mong muốn."),
    notes: z.string().max(300, "Ghi chú tối đa 300 ký tự.").optional(),
    parentConsent: z.boolean().optional(),
    turnstileToken: z.string().min(1, "Vui lòng xác thực bạn không phải người máy."),
  })
  .refine(
    (data) => {
      // Trẻ em dưới 18 bắt buộc phải có cam kết đồng thuận từ phụ huynh
      if (data.ageGroup === "7-12" || data.ageGroup === "13-17") {
        return data.parentConsent === true;
      }
      return true;
    },
    {
      message: "Đối với người chơi dưới 18 tuổi, cần có sự đồng thuận của cha mẹ/người giám hộ.",
      path: ["parentConsent"],
    }
  )
  .refine(
    (data) => {
      // Trẻ em 7-12 tuổi phụ huynh điền thay, bắt buộc có tên phụ huynh
      if (data.ageGroup === "7-12") {
        return !!data.parentName && data.parentName.trim().length >= 2;
      }
      return true;
    },
    {
      message: "Bé từ 7–12 tuổi cần điền họ tên của phụ huynh/người giám hộ.",
      path: ["parentName"],
    }
  );

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;

export interface RegistrationRecord extends RegistrationFormData {
  id: string;
  createdAt: string;
  status: "pending_verification" | "confirmed";
  verificationCode: string;
}
