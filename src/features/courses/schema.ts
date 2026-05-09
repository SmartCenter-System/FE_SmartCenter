import * as z from "zod";

export const courseTypeSchema = z.union([z.literal(1), z.literal(2)]); // 1=Online, 2=Offline

const courseLessonSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  isPreview: z.boolean(),
});

const courseSectionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  lessons: z.array(courseLessonSchema),
});

export const courseSchema = z.object({
  courseId: z.string().uuid(),
  courseName: z.string().min(1, "Tiêu đề không được để trống").max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  description: z.string().optional(),
  imgUrl: z.string().url("URL ảnh không hợp lệ").optional().nullable(),
  basePrice: z.number().min(0, "Giá không được âm"),
  courseType: courseTypeSchema,
  startAt: z.string().optional().nullable(),
  endAt: z.string().optional().nullable(),
  maxStudents: z.number().optional().nullable(),
  academicYear: z.number().optional().nullable(),
  lecturerId: z.string().optional().nullable(),
  lecturerName: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sections: z.array(courseSectionSchema).optional(),
});

export const createCourseSchema = z.object({
  courseName: z.string().min(1, "Tên khóa học không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  basePrice: z.number().min(0, "Giá bán không được âm"),
  imgUrl: z.string().url("URL ảnh không hợp lệ hoặc chưa tải ảnh lên"),
  courseType: courseTypeSchema.default(1),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  maxStudents: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().min(0, "Số lượng học viên không được âm").optional()),
  academicYear: z.number().optional(),
  lecturerId: z.string().min(1, "Vui lòng chọn giảng viên"),
}).refine(
  (data) => {
    if (data.courseType === 2) {
      const students = data.maxStudents ?? 0;
      return students > 0;
    }
    return true;
  },
  {
    message: "Học Offline bắt buộc phải giới hạn số học viên > 0",
    path: ["maxStudents"],
  }
);

export const updateCourseSchema = z.object({
  courseName: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().optional(),
  imgUrl: z.string().url().optional(),
  courseType: courseTypeSchema.optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  maxStudents: z.number().optional(),
  lecturerId: z.string().optional(),
  isActive: z.boolean().optional(),
}).refine(
  (data) => {
    // Nếu có courseType là Offline (2) hoặc đang sửa thông tin liên quan đến offline
    if (data.courseType === 2 && data.maxStudents !== undefined) {
      return data.maxStudents > 0;
    }
    return true;
  },
  {
    message: "Số lượng học viên tối đa cho học Offline phải lớn hơn 0",
    path: ["maxStudents"],
  }
);
