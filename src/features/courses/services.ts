import { apiClient } from "@/lib/axios";
import type {
  Course,
  CourseFilterParams,
  PublicCourseListResult,
  PublicCourseQueryParams,
} from "./type";

interface PublicCourseApiResponse {
  items?: unknown;
  total?: number;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export const courseService = {
  async getPublicCourses(params?: PublicCourseQueryParams): Promise<PublicCourseListResult> {
    const response = await apiClient.get("/Courses", { params }) as PublicCourseApiResponse;
    const items = Array.isArray(response?.items) ? response.items : [];
    const pageIndex = response?.pageIndex ?? params?.PageIndex ?? 1;
    const pageSize = response?.pageSize ?? params?.PageSize ?? 9;
    const totalCount = response?.totalCount ?? response?.total ?? items.length;
    const totalPages = response?.totalPages ?? Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));

    return {
      items: items as PublicCourseListResult["items"],
      pageIndex,
      pageSize,
      totalCount,
      totalPages,
      hasPreviousPage: response?.hasPreviousPage ?? pageIndex > 1,
      hasNextPage: response?.hasNextPage ?? pageIndex < totalPages,
    };
  },

  // Lấy danh sách khóa học (dành cho Admin hoặc Public)
  async getCourses(params?: CourseFilterParams): Promise<{ data: Course[], total: number }> {
    // TODO: Uncomment dòng bên dưới để dùng API thật khi backend hoàn thành
    // return apiClient.get("/courses", { params }) as any;
    
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
