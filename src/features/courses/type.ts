import * as z from "zod";
import type { BaseFilterParams } from "@/shared/types";
import { courseSchema, createCourseSchema, updateCourseSchema, courseTypeSchema } from "./schema";

export type CourseType = z.infer<typeof courseTypeSchema>;
export type Course = z.infer<typeof courseSchema>;
export type CreateCoursePayload = z.infer<typeof createCourseSchema>;
export type UpdateCoursePayload = z.infer<typeof updateCourseSchema>;

// Cấu trúc chi tiết Khóa học Public
export interface PublicCourseItem {
  id: string;
  title: string;
  cateId: string;
  cateName: string;
  mode: number;
  price: number;
  availableSlots: number;
  imgUrl: string | null;
}

export interface PublicCourseQueryParams {
  CategoryId?: string;
  Mode?: number;
  MinPrice?: number;
  MaxPrice?: number;
  Keyword?: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface CourseFilterParams extends BaseFilterParams {
  CategoryId?: string;
  CourseId?: string;
  MinPrice?: number;
  MaxPrice?: number;
  Mode?: CourseType;
  Keyword?: string;
  LecturerId?: string;
}

// Cấu trúc gói trả về chuẩn của Backend (Wrapper)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
  traceId: string;
  timestampUtc: string;
}

// Cấu trúc phân trang chuẩn
export interface PaginatedData<T> {
  items: T[];
  total: number;
}
