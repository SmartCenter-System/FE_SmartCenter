import * as z from "zod";

export const consultationSchema = z.object({
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  phoneNumber: z.string().min(1, "Số điện thoại không được để trống"),
  courseId: z.string().optional(),
  description: z.string().optional(),
});
