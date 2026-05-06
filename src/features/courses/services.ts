// import { apiClient } from "@/lib/axios";
import type { Course, CourseFilterParams } from "./type";

export const courseService = {
  // Lấy danh sách khóa học (dành cho Admin hoặc Public)
  async getCourses(params?: CourseFilterParams): Promise<{ data: Course[], total: number }> {
    // TODO: Uncomment dòng bên dưới để dùng API thật khi backend hoàn thành
    // return apiClient.get("/courses", { params }) as any;
    
    // TODO: Xóa phần mock data này khi đã tích hợp API
    const mockData: Course[] = [
      {
        id: "1",
        title: "Luyện thi THPT Quốc gia môn Toán 2026",
        description: "Tổng ôn kiến thức môn Toán 12, luyện đề bám sát cấu trúc thi của Bộ GD&ĐT.",
        price: 1500000,
        originalPrice: 2000000,
        level: "ALL_LEVELS",
        status: "PUBLISHED",
        format: "ONLINE",
        authorId: "user-1",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Khóa học IELTS 6.5+ dành cho học sinh THPT",
        description: "Luyện thi IELTS chuyên sâu 4 kỹ năng, tối ưu điểm xét tuyển Đại học.",
        price: 3000000,
        originalPrice: 4500000,
        level: "INTERMEDIATE",
        status: "PUBLISHED",
        format: "OFFLINE",
        authorId: "user-2",
        thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Đột phá điểm 9+ môn Vật Lý lớp 12",
        description: "Bứt phá điểm số với phương pháp giải nhanh độc quyền.",
        price: 4500000,
        originalPrice: 6000000,
        level: "ADVANCED",
        status: "PUBLISHED",
        format: "ONLINE",
        authorId: "user-3",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    let filtered = [...mockData];
    if (params?.search) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(params.search!.toLowerCase()));
    }
    if (params?.format && (params.format as any) !== "ALL") {
      filtered = filtered.filter(c => c.format === params.format);
    }
    if (params?.level && (params.level as any) !== "ALL") {
      filtered = filtered.filter(c => c.level === params.level);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: filtered, total: filtered.length });
      }, 500);
    });
  },

  // Lấy chi tiết 1 khóa học
  async getCourseById(id: string): Promise<Course> {
    // TODO: Uncomment dòng bên dưới để dùng API thật khi backend hoàn thành
    // return apiClient.get(`/courses/${id}`) as any;
    
    // TODO: Xóa phần mock data này khi đã tích hợp API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          title: "Luyện thi THPT Quốc gia môn Toán 2026",
          description: "Tổng ôn toàn bộ kiến thức Toán 12 từ cơ bản đến nâng cao. Rèn luyện kỹ năng giải nhanh trắc nghiệm và bấm máy tính Casio để tối đa hóa điểm số.",
          price: 4500000,
          originalPrice: 6000000,
          level: "BEGINNER",
          status: "PUBLISHED",
          format: "ONLINE",
          authorId: "user-1",
          thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  }
};
