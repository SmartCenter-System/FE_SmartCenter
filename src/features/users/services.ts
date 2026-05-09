import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

import { apiClient } from "@/lib/axios";
import { id } from "zod/v4/locales";

// Core Types
export type UserRole = "ADMIN" | "STAFF" | "LECTURER" | "STUDENT";
export type UserStatus = "ACTIVE" | "LOCKED";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: number;
  imgUrl: string | null;
  address: string | null;
  city: string | null;
  zaloLink: string | null;
  bio: string | null;
  expertise: string | null;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
  errors: string | null;
  traceId: string;
  timestampUtc: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  zaloLink?: string;
  imgUrl?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
}

export interface UserFilterParams {
  search?: string;
  role?: UserRole | "ALL";
  status?: UserStatus | "ALL";
  page?: number;
  limit?: number;
}

export const userService = {
  // Lấy danh sách người dùng
  async getUsers(params?: UserFilterParams): Promise<{ data: User[], total: number }> {
    // TODO: Uncomment dòng bên dưới để dùng API thật khi backend hoàn thành
    // return apiClient.get("/admin/users", { params }) as any;
    
    // TODO: Xóa mock data khi đã tích hợp API
    const mockData: User[] = [
      {
        id: "usr-1",
        fullName: "Hệ thống Quản Trị",
        email: "admin@smartcenter.edu.vn",
        role: "ADMIN",
        status: "ACTIVE",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        createdAt: "2024-01-01T00:00:00Z"
      },
      {
        id: "usr-2",
        fullName: "Nguyễn Tư Vấn",
        email: "tuvan_a@smartcenter.edu.vn",
        role: "STAFF",
        status: "ACTIVE",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        createdAt: "2024-02-15T08:30:00Z"
      },
      {
        id: "usr-3",
        fullName: "Thầy Nguyễn Đức Anh",
        email: "ducanh.math@smartcenter.edu.vn",
        role: "LECTURER",
        status: "ACTIVE",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        createdAt: "2024-03-10T10:15:00Z"
      },
      {
        id: "usr-4",
        fullName: "Trần Đăng Khoa",
        email: "khoatd.2k8@gmail.com",
        role: "STUDENT",
        status: "ACTIVE",
        createdAt: "2024-04-01T14:20:00Z"
      },
      {
        id: "usr-5",
        fullName: "Lê Hoàng Phúc (Spam)",
        email: "phuclh_spam@gmail.com",
        role: "STUDENT",
        status: "LOCKED",
        createdAt: "2024-04-05T09:45:00Z"
      }
    ];

    let filtered = [...mockData];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(u => u.fullName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    if (params?.role && params.role !== "ALL") {
      filtered = filtered.filter(u => u.role === params.role);
    }
    if (params?.status && params.status !== "ALL") {
      filtered = filtered.filter(u => u.status === params.status);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: filtered, total: filtered.length });
      }, 500);
    });
  },

  // Thay đổi trạng thái tài khoản
  async toggleUserStatus(_id: string, _newStatus: UserStatus): Promise<void> {
    // TODO: Uncomment dòng bên dưới để dùng API thật
    return apiClient.patch(`/admin/users/${id}/status`, { status: _newStatus }) as any;
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 400);
    });
  },

  // Tạo tài khoản nội bộ mới (Staff, Lecturer)
  async createInternalUser(data: { fullName: string; email: string; role: UserRole }): Promise<User> {
    // TODO: Uncomment dòng bên dưới để dùng API thật
    // return apiClient.post("/admin/users", data) as any;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `usr-${Date.now()}`,
          ...data,
          status: "ACTIVE",
          createdAt: new Date().toISOString()
        });
      }, 800);
    });
  },
  // Lấy profile người dùng hiện tại
  async getProfile(): Promise<any> {
    return apiClient.get(API_ENDPOINTS.USER.GET_PROFILE);
  },
};
