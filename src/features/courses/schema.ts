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
  isActive: z.boolean().optional(),
  sections: z.array(courseSectionSchema).optional(),
});

export const createCourseSchema = z.object({
  courseName: z.string().min(1),
  description: z.string(),
  basePrice: z.number(),
  imgUrl: z.string().url(),
  courseType: courseTypeSchema.optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  maxStudents: z.number().optional(),
  academicYear: z.number().optional(),
});

export const updateCourseSchema = z.object({
  courseName: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().optional(),
  imgUrl: z.string().url().optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  maxStudents: z.number().optional(),
  isActive: z.boolean().optional(),
});
