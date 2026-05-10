import * as z from "zod";
import type { BaseFilterParams, PaginatedList } from "@/shared/types";
import { 
  courseSchema, 
  createCourseSchema, 
  updateCourseSchema, 
  courseTypeSchema
} from "./schema";

export type CourseType = z.infer<typeof courseTypeSchema>;

export type Course = z.infer<typeof courseSchema>;
export type CreateCoursePayload = z.infer<typeof createCourseSchema>;
export type UpdateCoursePayload = z.infer<typeof updateCourseSchema>;

export interface PublicCourseItem {
  id: string;
  courseName: string;
  courseType: number;
  basePrice: number;
  maxStudents: number;
  imgUrl?: string;
  description?: string;
  categoryId?: string;
  lecturerName?: string;
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

export type PublicCourseListResult = PaginatedList<PublicCourseItem>;

export interface CourseFilterParams extends BaseFilterParams {
  CategoryId?: string;
  CourseId?: string;
  MinPrice?: number;
  MaxPrice?: number;
  Mode?: CourseType;
  Keyword?: string;
  LecturerId?: string;
}
