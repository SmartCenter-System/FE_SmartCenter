import * as z from "zod";
import type { BaseFilterParams } from "@/shared/types";
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

export interface CourseFilterParams extends BaseFilterParams {
  CategoryId?: string;
  CourseId?: string;
  MinPrice?: number;
  MaxPrice?: number;
  Mode?: CourseType;
  Keyword?: string;
}
