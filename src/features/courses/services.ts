import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { Course, CourseFilterParams, CreateCoursePayload, UpdateCoursePayload } from "./type";

export const courseService = {
  getAll: (params?: CourseFilterParams) =>
    apiClient.get(API_ENDPOINTS.COURSES.BASE, { params }) as unknown as Promise<Course[]>,

  getById: (courseId: string) =>
    apiClient.get(API_ENDPOINTS.COURSES.BY_ID(courseId)) as unknown as Promise<Course>,

  getPreviews: (courseId: string) =>
    apiClient.get(API_ENDPOINTS.COURSES.PREVIEWS(courseId)) as unknown as Promise<unknown>,

  create: (data: CreateCoursePayload) =>
    apiClient.post(API_ENDPOINTS.COURSES.BASE, data) as unknown as Promise<Course>,

  update: (courseId: string, data: UpdateCoursePayload) =>
    apiClient.put(API_ENDPOINTS.COURSES.BY_ID(courseId), data) as unknown as Promise<Course>,

  remove: (courseId: string) =>
    apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(courseId)) as unknown as Promise<void>,
};
