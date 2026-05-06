import * as z from "zod";

export const classStatusSchema = z.enum(["OPEN", "CLOSED", "IN_PROGRESS", "COMPLETED"]);

export const classSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  className: z.string().min(1, "Tên lớp không được để trống"),
  lecturerId: z.string().uuid("Vui lòng chọn giảng viên"),
  maxStudents: z.number().min(1, "Số học viên tối đa phải lớn hơn 0"),
  enrollmentDeadline: z.string().datetime("Hạn chót đăng ký không hợp lệ"),
  startDate: z.string().datetime("Ngày khai giảng không hợp lệ"),
  status: classStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createClassSchema = classSchema.pick({
  className: true,
  lecturerId: true,
  maxStudents: true,
  enrollmentDeadline: true,
  startDate: true,
  status: true,
});

export type Class = z.infer<typeof classSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
