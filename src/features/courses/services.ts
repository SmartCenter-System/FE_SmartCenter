import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  Course,
  CourseFilterParams,
  PublicCourseItem,
  PublicCourseQueryParams,
  PublicCourseListResult,
} from "./type";

interface PublicCourseApiResponse {
  items?: any[];
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
    academicYear: raw?.academicYear ?? null,
    maxStudents: raw?.maxStudents ?? null,
    lecturerId: raw?.lecturerId ?? null,
    lecturerName: raw?.lecturerName ?? raw?.lecturer?.fullName ?? "Chưa có giảng viên",
    isActive: Boolean(raw?.isActive ?? true),
    sections: Array.isArray(raw?.sections) ? raw.sections.map(normalizeCourseSection) : [],
  };
}

export const courseService = {
  async getPublicCourses(params?: PublicCourseQueryParams): Promise<PublicCourseListResult> {
    const response = (await apiClient.get(API_ENDPOINTS.COURSES.BASE, {
      params: {
        CategoryId: params?.CategoryId,
        Mode: params?.Mode,
        MinPrice: params?.MinPrice,
        MaxPrice: params?.MaxPrice,
        Keyword: params?.Keyword,
        PageIndex: params?.PageIndex ?? 1,
        PageSize: params?.PageSize ?? 12,
      },
    })) as PublicCourseApiResponse;

    const rawItems = Array.isArray(response?.items) ? response.items : [];
    const items: PublicCourseItem[] = rawItems.map((item: any) => ({
      id: String(item.id || item.courseId),
      title: item.courseName || item.title,
      mode: normalizeCourseType(item.courseType || item.mode),
      price: item.basePrice || item.price || 0,
      availableSlots: item.maxStudents || item.availableSlots || 0,
    }));

    return {
      items,
      pageIndex: response.pageIndex ?? 1,
      pageSize: response.pageSize ?? 12,
      totalCount: response.totalCount || response.total || items.length,
      totalPages: response.totalPages ?? 1,
      hasPreviousPage: response.hasPreviousPage ?? false,
      hasNextPage: response.hasNextPage ?? false,
    };
  },

  async getCourses(params?: CourseFilterParams): Promise<{ data: Course[]; total: number }> {
    const response = (await apiClient.get(API_ENDPOINTS.COURSES.BASE, {
      params: {
        CategoryId: params?.CategoryId,
        CourseId: params?.CourseId,
        MinPrice: params?.MinPrice,
        MaxPrice: params?.MaxPrice,
        Mode: params?.Mode,
        LecturerId: params?.LecturerId,
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

  async create(data: any): Promise<Course> {
    const payload = {
      courseName: data.courseName,
      description: data.description,
      basePrice: data.basePrice,
      imgUrl: data.imgUrl,
      courseType: data.courseType,
      maxStudents: data.maxStudents,
      academicYear: data.academicYear,
      lecturerId: data.lecturerId,
      startAt: data.startAt,
      endAt: data.endAt,
    };

    const res = (await apiClient.post(API_ENDPOINTS.COURSES.BASE, payload)) as any;
    return normalizeCourse(res);
  },

  async update(courseId: string, data: any): Promise<Course> {
    const payload = {
      courseName: data.courseName,
      description: data.description,
      basePrice: data.basePrice,
      imgUrl: data.imgUrl,
      startAt: data.startAt,
      endAt: data.endAt,
      maxStudents: data.maxStudents,
      isActive: data.isActive,
    };

    const res = (await apiClient.put(API_ENDPOINTS.COURSES.BY_ID(courseId), payload)) as any;
    return normalizeCourse(res);
  },

  async remove(courseId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(courseId));
  },

  async delete(courseId: string): Promise<void> {
    return this.remove(courseId);
  },

  async getTopPopularCourses() {
    const res = await apiClient.get(API_ENDPOINTS.COURSES.TOP_POPULAR);
    return (res.data || res) as any[];
  },

  // Section Management
  async getSections(courseId: string) {
    return apiClient.get(API_ENDPOINTS.SECTION.BASE, { params: { courseId } });
  },

  async createSection(courseId: string, data: any) {
    return apiClient.post(API_ENDPOINTS.SECTION.BASE, data, { params: { courseId } });
  },

  async updateSection(sectionId: string, courseId: string, data: any) {
    return apiClient.put(API_ENDPOINTS.SECTION.BY_ID(sectionId), data, { params: { courseId } });
  },

  async deleteSection(sectionId: string, courseId: string) {
    return apiClient.delete(API_ENDPOINTS.SECTION.BY_ID(sectionId), { params: { courseId } });
  },

  // Lesson Management
  async getLessons(courseId: string, sectionId: string) {
    return apiClient.get(API_ENDPOINTS.LESSON.BASE, { params: { courseId, sectionId } });
  },

  async createLesson(courseId: string, sectionId: string, data: any) {
    return apiClient.post(API_ENDPOINTS.LESSON.BASE, data, { params: { courseId, sectionId } });
  },

  async updateLesson(lessonId: string, courseId: string, sectionId: string, data: any) {
    return apiClient.put(API_ENDPOINTS.LESSON.BY_ID(lessonId), data, { params: { courseId, sectionId } });
  },

  async deleteLesson(lessonId: string, courseId: string, sectionId: string) {
    return apiClient.delete(API_ENDPOINTS.LESSON.BY_ID(lessonId), { params: { courseId, sectionId } });
  },
};
