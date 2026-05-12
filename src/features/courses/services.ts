import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  Course,
  CourseFilterParams,
  PublicCourseQueryParams,
  PublicCourseListResult,
  CourseRaw,
  CreateCoursePayload,
  UpdateCoursePayload,
  PublicCourseItem,
} from "./type";
import type { PaginatedData } from "@/shared/types";

/**
 * Chuẩn hóa giá trị hình thức học (1: Online, 2: Offline).
 * @param value Giá trị thô từ API
 */
function normalizeCourseType(value: unknown): 1 | 2 {
  return value === 2 ? 2 : 1;
}

/**
 * Adapter chuẩn hóa Lesson từ Backend
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCourseLesson(raw: any) {
  return {
    id: String(raw?.id ?? ""),
    title: String(raw?.title ?? ""),
    isPreview: Boolean(raw?.isPreview),
  };
}

/**
 * Adapter chuẩn hóa Section từ Backend
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCourseSection(raw: any) {
  return {
    id: String(raw?.id ?? ""),
    title: String(raw?.title ?? ""),
    lessons: Array.isArray(raw?.lessons) ? raw.lessons.map(normalizeCourseLesson) : [],
  };
}

/**
 * Adapter chuẩn hóa cấu trúc Course chung từ Backend.
 * Dùng cho các trang quản trị (Admin/Staff/Lecturer).
 * @param {CourseRaw} raw - Dữ liệu khóa học thô từ API
 * @returns {Course} Dữ liệu khóa học đã làm sạch
 */
function normalizeCourse(raw: CourseRaw): Course {
  return {
    courseId: String(raw?.courseId ?? raw?.id ?? ""),
    courseName: String(raw?.courseName ?? raw?.title ?? ""),
    description: raw?.description ?? undefined,
    imgUrl: raw?.imgUrl ?? raw?.thumbnail ?? null,
    basePrice: Number(raw?.basePrice ?? raw?.price ?? 0),
    courseType: normalizeCourseType(raw?.courseType ?? raw?.mode),
    startAt: raw?.startAt ?? null,
    endAt: raw?.endAt ?? null,
    academicYear: raw?.academicYear !== undefined && raw?.academicYear !== null ? Number(raw.academicYear) : null,
    maxStudents: raw?.maxStudents ?? null,
    lecturerId: raw?.lecturerId ?? null,
    lecturerName: String(raw?.lecturerName ?? raw?.lecturer?.fullName ?? "Chưa có giảng viên"),
    isActive: Boolean(raw?.isActive ?? true),
    sections: Array.isArray(raw?.sections) ? raw.sections.map(normalizeCourseSection) : [],
  };
}

/**
 * Adapter chuẩn hóa cấu trúc Course dành riêng cho trang Public.
 * Dùng cho ExploreCoursePage.
 * @param {CourseRaw} raw - Dữ liệu khóa học thô từ API
 * @returns {PublicCourseItem} Dữ liệu khóa học public đã làm sạch
 */
function normalizePublicCourse(raw: CourseRaw): PublicCourseItem {
  return {
    id: String(raw?.courseId ?? raw?.id ?? ""),
    title: String(raw?.courseName ?? raw?.title ?? ""),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cateId: String((raw as any)?.categoryId ?? (raw as any)?.cateId ?? ""),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cateName: String((raw as any)?.categoryName ?? (raw as any)?.cateName ?? ""),
    mode: normalizeCourseType(raw?.courseType ?? raw?.mode),
    price: Number(raw?.basePrice ?? raw?.price ?? 0),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    availableSlots: Number((raw as any)?.availableSlots ?? raw?.maxStudents ?? 0),
    imgUrl: raw?.imgUrl ?? raw?.thumbnail ?? null,
  };
}


export const courseService = {
  /**
   * Lấy danh sách khóa học Public (có lọc, phân trang).
   * @param params Bộ tham số truy vấn
   */
  async getPublicCourses(params?: PublicCourseQueryParams): Promise<PublicCourseListResult> {
    const data = (await apiClient.get<CourseRaw[] | PaginatedData<CourseRaw>>(API_ENDPOINTS.COURSES.BASE, {
      params: {
        CategoryId: params?.CategoryId,
        Mode: params?.Mode,
        MinPrice: params?.MinPrice,
        MaxPrice: params?.MaxPrice,
        Keyword: params?.Keyword,
        PageIndex: params?.PageIndex ?? 1,
        PageSize: params?.PageSize ?? 12,
      },
    })) as unknown as CourseRaw[] | PaginatedData<CourseRaw>;

    const itemsRaw: CourseRaw[] = Array.isArray(data) ? data : data.items || [];
    const total = Array.isArray(data) ? data.length : data.totalCount ?? data.total ?? itemsRaw.length;

    return {
      items: itemsRaw.map(normalizePublicCourse),
      total,
    };
  },

  /**
   * Lấy danh sách khóa học chi tiết (Course) cho quản trị viên/giảng viên.
   * @param params Bộ tham số truy vấn mở rộng
   */
  async getCourses(params?: CourseFilterParams): Promise<{ data: Course[]; total: number }> {
    const pageData = (await apiClient.get<CourseRaw[] | PaginatedData<CourseRaw>>(API_ENDPOINTS.COURSES.BASE, {
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
    })) as unknown as CourseRaw[] | PaginatedData<CourseRaw>;

    const itemsRaw: CourseRaw[] = Array.isArray(pageData) ? pageData : pageData.items || [];
    const total = Array.isArray(pageData) ? pageData.length : pageData.totalCount ?? pageData.total ?? itemsRaw.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsRaw: CourseRaw[] = Array.isArray(pageData) ? pageData : ((pageData as any)?.items || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = Array.isArray(pageData) ? pageData.length : ((pageData as any)?.totalCount ?? (pageData as any)?.total ?? itemsRaw.length);

    return {
      data: itemsRaw.map(normalizeCourse),
      total,
    };
  },

  /**
   * Alias cho getCourses (Dùng chung cho nhiều component Admin)
   * @param params Bộ tham số truy vấn mở rộng
   */
  async getAll(params?: CourseFilterParams): Promise<{ data: Course[]; total: number }> {
    return this.getCourses(params);
  },

  /**
   * Lấy chi tiết khóa học theo ID.
   * @param courseId ID khóa học
   */
  async getById(courseId: string): Promise<Course> {
    const data = (await apiClient.get<CourseRaw>(API_ENDPOINTS.COURSES.BY_ID(courseId))) as unknown as CourseRaw;
    return normalizeCourse(data);
  },

  /**
   * Lấy dữ liệu preview của khóa học (Ví dụ các video trailer)
   * @param courseId ID khóa học
   */
  getPreviews(courseId: string) {
    return apiClient.get(API_ENDPOINTS.COURSES.PREVIEWS(courseId));
  },

  /**
   * Tạo mới một khóa học
   * @param data Dữ liệu khóa học
   */
  async create(data: CreateCoursePayload): Promise<Course> {
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

    const res = (await apiClient.post<CourseRaw>(API_ENDPOINTS.COURSES.BASE, payload)) as unknown as CourseRaw;
    return normalizeCourse(res);
  },

  /**
   * Cập nhật thông tin khóa học
   * @param courseId ID khóa học
   * @param data Dữ liệu cập nhật
   */
  async update(courseId: string, data: UpdateCoursePayload): Promise<Course> {
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

    const res = (await apiClient.put<CourseRaw>(API_ENDPOINTS.COURSES.BY_ID(courseId), payload)) as unknown as CourseRaw;
    return normalizeCourse(res);
  },

  /**
   * Xóa một khóa học
   * @param courseId ID khóa học
   */
  async remove(courseId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(courseId));
  },

  /**
   * Alias cho hàm remove
   * @param courseId ID khóa học
   */
  async delete(courseId: string): Promise<void> {
    return this.remove(courseId);
  },

  /**
   * Lấy danh sách khóa học phổ biến nhất
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getTopPopularCourses(): Promise<any[]> {
    const res = await apiClient.get<CourseRaw[]>(API_ENDPOINTS.COURSES.TOP_POPULAR);
    return Array.isArray(res) ? res : [];
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
