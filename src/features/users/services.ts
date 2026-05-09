import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";

// Core Types
export type UserRole = "ADMIN" | "STUDENT" | "LECTURER" | "STAFF";
export type UserStatus = "ACTIVE" | "LOCKED";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  bio?: string;
  expertise?: string;
  createdAt: string;
}

export interface UserFilterParams {
  search?: string;
  role?: UserRole | "ALL";
  status?: UserStatus | "ALL";
  page?: number;
  limit?: number;
}

const ROLE_MAP: Record<string, number> = {
  ADMIN: 1,
  STUDENT: 2,
  LECTURER: 3,
  STAFF: 4,
};

const REVERSE_ROLE_MAP: Record<number, UserRole> = {
  1: "ADMIN",
  2: "STUDENT",
  3: "LECTURER",
  4: "STAFF",
};

export const userService = {
  // Lấy danh sách người dùng
  async getUsers(params?: UserFilterParams): Promise<{ data: User[]; total: number }> {
    const roleValue = params?.role && params.role !== "ALL" ? ROLE_MAP[params.role] : undefined;
    const statusValue = params?.status === "ACTIVE" ? 1 : params?.status === "LOCKED" ? 2 : undefined;

    const res = (await apiClient.get(API_ENDPOINTS.ADMIN.USERS, {
      params: {
        Search: params?.search,
        Role: roleValue,
        Status: statusValue,
        PageIndex: params?.page ?? 1,
        PageSize: params?.limit ?? 100,
      },
    })) as any;

    // Chuẩn hóa dữ liệu từ Backend .NET
    const rawData = res?.items || res?.data || (Array.isArray(res) ? res : []);
    const data = rawData.map((u: any) => {
      // Chuẩn hóa Status
      const rawStatus = u.status ?? u.Status ?? u.isActive ?? u.IsActive;
      let normalizedStatus: UserStatus = "LOCKED";
      if (rawStatus === 1 || rawStatus === "1" || rawStatus === true || rawStatus === "ACTIVE" || rawStatus === "Active") {
        normalizedStatus = "ACTIVE";
      }

      // Chuẩn hóa Role
      const rawRole = u.role ?? u.Role;
      let normalizedRole: UserRole = "STUDENT";
      if (typeof rawRole === "number") {
        normalizedRole = REVERSE_ROLE_MAP[rawRole] || "STUDENT";
      } else if (typeof rawRole === "string") {
        normalizedRole = rawRole.toUpperCase() as UserRole;
      }

      return {
        id: u.id || u.Id || "",
        fullName: u.fullName || u.FullName || u.userName || "N/A",
        email: u.email || u.Email || "",
        role: normalizedRole,
        status: normalizedStatus,
        avatar: u.avatar || u.Avatar || u.imgUrl || null,
        phone: u.phone || u.Phone || "",
        bio: u.bio || u.Bio || "",
        expertise: u.expertise || u.Expertise || "",
        createdAt: u.createdAt || u.CreatedAt || new Date().toISOString(),
      };
    });

    return {
      data,
      total: Number(res?.totalCount ?? res?.total ?? data.length),
    };
  },

  async getById(id: string): Promise<User> {
    const res = (await apiClient.get(`${API_ENDPOINTS.ADMIN.USERS}/${id}`)) as any;
    const u = res.data || res;
    
    // Reuse normalization logic
    const rawStatus = u.status ?? u.Status ?? u.isActive ?? u.IsActive;
    let normalizedStatus: UserStatus = "LOCKED";
    if (rawStatus === 1 || rawStatus === "1" || rawStatus === true || rawStatus === "ACTIVE" || rawStatus === "Active") {
      normalizedStatus = "ACTIVE";
    }

    const rawRole = u.role ?? u.Role;
    let normalizedRole: UserRole = "STUDENT";
    if (typeof rawRole === "number") {
      normalizedRole = REVERSE_ROLE_MAP[rawRole] || "STUDENT";
    } else if (typeof rawRole === "string") {
      normalizedRole = rawRole.toUpperCase() as UserRole;
    }

    return {
      id: u.id || u.Id || "",
      fullName: u.fullName || u.FullName || u.userName || "N/A",
      email: u.email || u.Email || "",
      role: normalizedRole,
      status: normalizedStatus,
      avatar: u.avatar || u.Avatar || u.imgUrl || null,
      phone: u.phone || u.Phone || "",
      bio: u.bio || u.Bio || "",
      expertise: u.expertise || u.Expertise || "",
      createdAt: u.createdAt || u.CreatedAt || new Date().toISOString(),
    };
  },

  // Thay đổi trạng thái tài khoản
  async toggleUserStatus(id: string, newStatus: UserStatus): Promise<void> {
    const endpoint = newStatus === "ACTIVE" 
      ? API_ENDPOINTS.ADMIN.USER_UNLOCK(id) 
      : API_ENDPOINTS.ADMIN.USER_LOCK(id);
    
    await apiClient.patch(endpoint);
  },

  // Tạo tài khoản nội bộ mới (Staff, Lecturer)
  async createInternalUser(data: {
    fullName: string;
    email: string;
    role: UserRole;
    password?: string;
    phone?: string;
    bio?: string;
    expertise?: string;
  }): Promise<User> {
    const nameParts = data.fullName.trim().split(" ");
    const lastName = nameParts.length > 1 ? nameParts.pop() || "" : "";
    const firstName = nameParts.join(" ") || data.fullName;

    const payload = {
      firstName,
      lastName,
      email: data.email,
      password: data.password || "123456aA@",
      phone: data.phone || "",
      bio: data.bio || "",
      expertise: data.expertise || "",
    };

    // Chọn endpoint dựa trên Role
    let endpoint = API_ENDPOINTS.AUTH.REGISTER;
    if (data.role === "LECTURER") {
      endpoint = API_ENDPOINTS.AUTH.REGISTER_LECTURER;
      (payload as any).expertise = data.expertise || "";
      (payload as any).bio = data.bio || "";
    }

    const res = (await apiClient.post(endpoint, payload)) as any;
    return res;
  },

  // Profile methods
  async getProfile(): Promise<User> {
    const res = (await apiClient.get(API_ENDPOINTS.USER.PROFILE)) as any;
    const u = res.data || res;
    
    // Reuse normalization logic
    const rawStatus = u.status ?? u.Status ?? u.isActive ?? u.IsActive;
    let normalizedStatus: UserStatus = "LOCKED";
    if (rawStatus === 1 || rawStatus === "1" || rawStatus === true || rawStatus === "ACTIVE" || rawStatus === "Active") {
      normalizedStatus = "ACTIVE";
    }

    const rawRole = u.role ?? u.Role;
    let normalizedRole: UserRole = "STUDENT";
    if (typeof rawRole === "number") {
      normalizedRole = REVERSE_ROLE_MAP[rawRole] || "STUDENT";
    } else if (typeof rawRole === "string") {
      normalizedRole = rawRole.toUpperCase() as UserRole;
    }

    return {
      id: u.id || u.Id || "",
      fullName: u.fullName || u.FullName || u.userName || "N/A",
      email: u.email || u.Email || "",
      role: normalizedRole,
      status: normalizedStatus,
      avatar: u.avatar || u.Avatar || u.imgUrl || null,
      phone: u.phone || u.Phone || "",
      bio: u.bio || u.Bio || "",
      expertise: u.expertise || u.Expertise || "",
      createdAt: u.createdAt || u.CreatedAt || new Date().toISOString(),
    };
  },

  async updateProfile(data: any): Promise<void> {
    await apiClient.post(API_ENDPOINTS.USER.UPDATE, data);
  },

  // Xóa người dùng
  async deleteUser(id: string): Promise<void> {
    // Backend spec không có DELETE cho admin/users nhưng giữ theo code cũ nếu backend hỗ trợ ẩn
    await apiClient.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
  },
};
