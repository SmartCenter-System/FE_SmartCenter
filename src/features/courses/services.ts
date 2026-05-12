import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  Course,
  CourseFilterParams,
  PublicCourseItem,
  PublicCourseQueryParams,
  PublicCourseListResult,
} from "./type";

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
    const data: any = await apiClient.get(API_ENDPOINTS.COURSES.BASE, {
      params: {
        CategoryId: params?.CategoryId,
        Mode: params?.Mode,
        MinPrice: params?.MinPrice,
        MaxPrice: params?.MaxPrice,
        Keyword: params?.Keyword,
        PageIndex: params?.PageIndex ?? 1,
        PageSize: params?.PageSize ?? 12,
      },
    });

    return data || { items: [], total: 0 };
  },

  async getCourses(params?: CourseFilterParams): Promise<{ data: Course[]; total: number }> {
    const pageData: any = await apiClient.get(API_ENDPOINTS.COURSES.BASE, {
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
    });

    return {
      data: (pageData.items || []).map(normalizeCourse),
      total: pageData.totalCount ?? pageData.total ?? (pageData.items?.length || 0),
    };
  },

  async getAll(params?: CourseFilterParams): Promise<{ data: Course[]; total: number }> {
    return this.getCourses(params);
  },

  async getById(courseId: string): Promise<Course> {
    const data: any = await apiClient.get(API_ENDPOINTS.COURSES.BY_ID(courseId));
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

    const res: any = await apiClient.post(API_ENDPOINTS.COURSES.BASE, payload);
    return normalizeCourse(res.data);
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

    const res: any = await apiClient.put(API_ENDPOINTS.COURSES.BY_ID(courseId), payload);
    return normalizeCourse(res.data);
  },

  async remove(courseId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(courseId));
  },

  async delete(courseId: string): Promise<void> {
    return this.remove(courseId);
  },

  async getTopPopularCourses() {
    const res: any = await apiClient.get(API_ENDPOINTS.COURSES.TOP_POPULAR);
    return (res.data || []) as any[];
  },

  // Section Management
  async getSections(courseId: string) {
    if (!courseId) throw new Error("Course ID is required");
    return apiClient.get(API_ENDPOINTS.SECTION.BASE, { params: { courseId } });
  },

  async createSection(courseId: string, data: { title: string }) {
    if (!courseId) throw new Error("Course ID is required");
    return apiClient.post(API_ENDPOINTS.SECTION.BASE, data, { params: { courseId } });
  },

  async updateSection(sectionId: string, courseId: string, data: { title: string }) {
    return apiClient.put(API_ENDPOINTS.SECTION.BY_ID(sectionId), data, { params: { courseId } });
  },

  async deleteSection(sectionId: string, courseId: string) {
    return apiClient.delete(API_ENDPOINTS.SECTION.BY_ID(sectionId), { params: { courseId } });
  },

  // Lesson Management
  async getLessons(courseId: string, sectionId: string) {
    return apiClient.get(API_ENDPOINTS.LESSON.BASE, { params: { courseId, sectionId } });
  },

  async createLesson(
    courseId: string,
    sectionId: string,
    data: {
      title: string;
      description?: string;
      videoUrl?: string;
      order?: number;
      isPreview?: boolean;
      duration?: number;
    },
  ) {
    const payload = {
      title: data.title,
      videoUrl: data.videoUrl || "https://youtube.com/watch?v=placeholder",
      description: data.description || "",
      order: data.order || 0,
      isPreview: data.isPreview || false,
      duration: data.duration || 0,
    };
    return apiClient.post(API_ENDPOINTS.LESSON.BASE, payload, { params: { courseId, sectionId } });
  },

  async updateLesson(
    lessonId: string,
    courseId: string,
    sectionId: string,
    data: {
      title: string;
      description?: string;
      videoUrl?: string;
      order?: number;
      isPreview?: boolean;
      duration?: number;
    },
  ) {
    const payload = {
      title: data.title,
      videoUrl: data.videoUrl || "https://youtube.com/watch?v=placeholder",
      description: data.description || "",
      order: data.order || 0,
      isPreview: data.isPreview || false,
      duration: data.duration || 0,
    };
    return apiClient.put(API_ENDPOINTS.LESSON.BY_ID(lessonId), payload, { params: { courseId, sectionId } });
  },

  async deleteLesson(lessonId: string, courseId: string, sectionId: string) {
    return apiClient.delete(API_ENDPOINTS.LESSON.BY_ID(lessonId), { params: { courseId, sectionId } });
  },

  async getDashboardData() {
    const res: any = await apiClient.get(API_ENDPOINTS.COURSES.DASHBOARD);
    return res.data;
  },
};
