import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  Course,
  CourseFilterParams,
  CreateCoursePayload,
  PublicCourseItem,
  PublicCourseListResult,
  PublicCourseQueryParams,
  UpdateCoursePayload,
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

function normalizeCourseType(value: unknown): 1 | 2 {
  return value === 2 ? 2 : 1;
}

function normalizeCourseLesson(raw: any) {
  return {
    id: String(raw?.id ?? ""),
    title: String(raw?.title ?? ""),
    isPreview: Boolean(raw?.isPreview),
  };
}

function normalizeCourseSection(raw: any) {
  return {
    id: String(raw?.id ?? ""),
    title: String(raw?.title ?? ""),
    lessons: Array.isArray(raw?.lessons) ? raw.lessons.map(normalizeCourseLesson) : [],
  };
}

function normalizeCourse(raw: any): Course {
  return {
    courseId: String(raw?.courseId ?? raw?.id ?? ""),
    courseName: String(raw?.courseName ?? raw?.title ?? ""),
    description: raw?.description ?? undefined,
    imgUrl: raw?.imgUrl ?? raw?.thumbnail ?? null,
    basePrice: Number(raw?.basePrice ?? raw?.price ?? 0),
    courseType: normalizeCourseType(raw?.courseType ?? raw?.mode),
    startAt: raw?.startAt ?? null,
    endAt: raw?.endAt ?? null,
    maxStudents: raw?.maxStudents ?? raw?.availableSlots ?? null,
    academicYear: raw?.academicYear ?? null,
    isActive: raw?.isActive ?? true,
    sections: Array.isArray(raw?.sections) ? raw.sections.map(normalizeCourseSection) : undefined,
  };
}

function normalizePublicCourse(raw: any): PublicCourseItem {
  return {
    id: String(raw?.id ?? raw?.courseId ?? ""),
    title: String(raw?.title ?? raw?.courseName ?? ""),
    mode: Number(raw?.mode ?? raw?.courseType ?? 1),
    price: Number(raw?.price ?? raw?.basePrice ?? 0),
    availableSlots: Number(raw?.availableSlots ?? raw?.maxStudents ?? 0),
  };
}

export const courseService = {
  async getPublicCourses(params?: PublicCourseQueryParams): Promise<PublicCourseListResult> {
    const response = (await apiClient.get(API_ENDPOINTS.COURSES.BASE, { params })) as PublicCourseApiResponse;
    const rawItems = Array.isArray(response?.items) ? response.items : [];
    const items = rawItems.map(normalizePublicCourse);
    const pageIndex = response?.pageIndex ?? params?.PageIndex ?? 1;
    const pageSize = response?.pageSize ?? params?.PageSize ?? 9;
    const totalCount = Number(response?.totalCount ?? response?.total ?? items.length);
    const totalPages = Number(response?.totalPages ?? Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1))));

    return {
      items,
      pageIndex,
      pageSize,
      totalCount,
      totalPages,
      hasPreviousPage: response?.hasPreviousPage ?? pageIndex > 1,
      hasNextPage: response?.hasNextPage ?? pageIndex < totalPages,
    };
  },

  async getTopPopularCourses(): Promise<PublicCourseItem[]> {
    const response = (await apiClient.get(API_ENDPOINTS.COURSES.TOP_POPULAR)) as unknown;
    const rawItems = Array.isArray(response) ? response : [];
    return rawItems.map((item) => normalizePublicCourse(item));
  },

  async getCourses(params?: CourseFilterParams): Promise<{ data: Course[]; total: number }> {
    const response = (await apiClient.get(API_ENDPOINTS.COURSES.BASE, {
      params: {
        CategoryId: params?.CategoryId,
        CourseId: params?.CourseId,
        MinPrice: params?.MinPrice,
        MaxPrice: params?.MaxPrice,
        Mode: params?.Mode,
        Keyword: params?.Keyword ?? params?.search,
        PageIndex: params?.page ?? 1,
        PageSize: params?.limit ?? 10,
      },
    })) as PublicCourseApiResponse;

    const rawItems = Array.isArray(response?.items) ? response.items : [];

    return {
      data: rawItems.map(normalizeCourse),
      total: Number(response?.totalCount ?? response?.total ?? rawItems.length),
    };
  },

  async getAll(params?: CourseFilterParams): Promise<{ data: Course[]; total: number }> {
    return this.getCourses(params);
  },

  async getById(courseId: string): Promise<Course> {
    const data = (await apiClient.get(API_ENDPOINTS.COURSES.BY_ID(courseId))) as any;
    return normalizeCourse(data);
  },

  getPreviews(courseId: string) {
    return apiClient.get(API_ENDPOINTS.COURSES.PREVIEWS(courseId));
  },

  async create(data: CreateCoursePayload): Promise<Course> {
    const res = (await apiClient.post(API_ENDPOINTS.COURSES.BASE, data)) as any;
    return normalizeCourse(res);
  },

  async update(courseId: string, data: UpdateCoursePayload): Promise<Course> {
    const res = (await apiClient.put(API_ENDPOINTS.COURSES.BY_ID(courseId), data)) as any;
    return normalizeCourse(res);
  },

  remove(courseId: string) {
    return apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(courseId));
  },
};
