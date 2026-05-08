import * as z from "zod";
import type { BaseFilterParams } from "@/shared/types";
import { 
  courseSchema, 
  createCourseSchema, 
  updateCourseSchema, 
  courseStatusSchema, 
  courseLevelSchema,
  courseFormatSchema
} from "./schema";

export type CourseStatus = z.infer<typeof courseStatusSchema>;
export type CourseLevel = z.infer<typeof courseLevelSchema>;
export type CourseFormat = z.infer<typeof courseFormatSchema>;

export type Course = z.infer<typeof courseSchema>;
export type CreateCoursePayload = z.infer<typeof createCourseSchema>;
export type UpdateCoursePayload = z.infer<typeof updateCourseSchema>;

export interface PublicCourseItem {
  id: string;
  title: string;
  mode: number;
  price: number;
  availableSlots: number;
}

export interface PublicCourseQueryParams {
  CategoryId?: string;
  CourseId?: string;
  MinPrice?: number;
  MaxPrice?: number;
  Mode?: number;
  Keyword?: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface PublicCourseListResult {
  items: PublicCourseItem[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CourseFilterParams extends BaseFilterParams {
  status?: CourseStatus;
  level?: CourseLevel;
  format?: CourseFormat;
  authorId?: string;
}
