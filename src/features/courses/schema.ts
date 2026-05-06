import * as z from "zod";

export const courseStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const courseLevelSchema = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]);
export const courseFormatSchema = z.enum(["ONLINE", "OFFLINE"]);

export const courseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Tiêu đề không được để trống").max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  description: z.string().optional(),
  thumbnail: z.string().url("URL ảnh không hợp lệ").optional().nullable(),
  price: z.number().min(0, "Giá không được âm"),
  originalPrice: z.number().min(0, "Giá gốc không được âm").optional().nullable(),
  level: courseLevelSchema,
  status: courseStatusSchema,
  format: courseFormatSchema,
  authorId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createCourseSchema = courseSchema.pick({
  title: true,
  description: true,
  thumbnail: true,
  price: true,
  originalPrice: true,
  level: true,
  status: true,
  format: true,
});

export const updateCourseSchema = createCourseSchema.partial();
