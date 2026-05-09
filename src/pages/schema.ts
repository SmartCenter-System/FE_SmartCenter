import { z } from "zod";

export const consultationSchema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
  courseId: z.string().optional(),
  description: z.string().optional(),
});
