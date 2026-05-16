import * as z from "zod";
import type { BaseFilterParams, BaseEntityRaw } from "@/shared/types";
import { courseSchema, createCourseSchema, updateCourseSchema, courseTypeSchema } from "./schema";

export type CourseType = z.infer<typeof courseTypeSchema>;
export type Course = z.infer<typeof courseSchema>;
export type CreateCoursePayload = z.infer<typeof createCourseSchema>;
export type UpdateCoursePayload = z.infer<typeof updateCourseSchema>;

// ─── Dữ liệu thô từ Server (Raw Data) ──────────────────────────

/**
 * Interface mô tả cấu trúc dữ liệu thô Category từ Backend.
 * Bao trùm các biến thể tên trường do lỗi đồng bộ (cateId, categoryId...)
 */
export interface CategoryRaw extends BaseEntityRaw {
  cateId?: string;
  categoryId?: string;
  id?: string;
  Id?: string;
  cateName?: string;
  categoryName?: string;
  name?: string;
  Name?: string;
}

/**
 * Interface mô tả cấu trúc dữ liệu thô Course từ Backend.
 * Dùng làm màng lọc bảo vệ các UI khỏi kiểu dữ liệu rác/thiếu.
 */
export interface CourseRaw extends BaseEntityRaw {
  courseId?: string;
  id?: string;
  courseName?: string;
  title?: string;
  description?: string;
  imgUrl?: string;
  thumbnail?: string;
  basePrice?: number;
  price?: number;
  courseType?: number;
  mode?: number;
  startAt?: string;
  endAt?: string;
  academicYear?: string;
  maxStudents?: number;
  lecturerId?: string;
  lecturerName?: string;
  lecturer?: { fullName?: string };
  isActive?: boolean;
  sections?: any[];
}

// ─── Dữ liệu sạch cho UI (Normalized Data) ──────────────────────────

/**
 * Interface mô tả cấu trúc dữ liệu Category sạch sẽ được dùng xuyên suốt trên UI.
 */
export interface Category {
  id: string;
  name: string;
}

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

export interface PublicCourseListResult {
  items: PublicCourseItem[];
  total: number;
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
