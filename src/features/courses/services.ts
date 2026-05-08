import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { Course, CourseFilterParams, CreateCoursePayload, UpdateCoursePayload } from "./type";

const mapCourse = (apiCourse: any): Course => ({
  courseId: apiCourse.id,
  courseName: apiCourse.title,
  basePrice: apiCourse.price,
  courseType: apiCourse.mode === 1 ? 1 : 2,
  imgUrl: apiCourse.imgUrl || null,
  description: apiCourse.description || "",
  startAt: apiCourse.startAt,
  endAt: apiCourse.endAt,
  maxStudents: apiCourse.availableSlots,
  academicYear: apiCourse.academicYear,
});

export const courseService = {
  getAll: async (params?: CourseFilterParams): Promise<{ items: Course[]; total: number }> => {
    const response = (await apiClient.get<any>(API_ENDPOINTS.COURSES.BASE, { 
      params: {
        ...params,
        PageIndex: params?.page,
        PageSize: params?.limit
      } 
    })) as any;
    
    return {
      items: (response?.items || []).map(mapCourse),
      total: response?.total || 0
    };
  },

  getById: async (courseId: string): Promise<Course> => {
    const data = (await apiClient.get<any>(API_ENDPOINTS.COURSES.BY_ID(courseId))) as any;
    return mapCourse(data);
  },

  getPreviews: (courseId: string) =>
    apiClient.get(API_ENDPOINTS.COURSES.PREVIEWS(courseId)),

  create: async (data: CreateCoursePayload): Promise<Course> => {
    const res = (await apiClient.post<any>(API_ENDPOINTS.COURSES.BASE, data)) as any;
    return mapCourse(res);
  },

  update: async (courseId: string, data: UpdateCoursePayload): Promise<Course> => {
    const res = (await apiClient.put<any>(API_ENDPOINTS.COURSES.BY_ID(courseId), data)) as any;
    return mapCourse(res);
  },

  remove: (courseId: string) =>
    apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(courseId)),
};
