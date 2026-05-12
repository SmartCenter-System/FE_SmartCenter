import { apiClient } from "@/lib/axios";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./auth/type";
import { API_ENDPOINTS } from "@/shared/constants";
import { useAuthStore } from "./auth/store";

import type { Category, CategoryRaw } from "./courses/type";

// ==========================================
// 1. DỊCH VỤ AUTHENTICATION
// ==========================================
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, { silent: true } as any) as unknown as AuthResponse;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data, { silent: true } as any) as unknown as AuthResponse;
  },

  async logout(): Promise<void> {
    const refreshToken = useAuthStore.getState().refreshToken;
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken }) as unknown as void;
  },

  async verifyEmail(code: number): Promise<void> {
    return apiClient.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      params: { code },
      silent: true,
    } as any) as unknown as void;
  },

  async forgotPassword(email: string): Promise<void> {
    // Spec shows ForgotPasswordRequest { email: string }
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }) as unknown as void;
  },

  async resetPassword(code: number, newPassword: string): Promise<void> {
    // Spec shows ResetPasswordRequest { code: int, newPassword: string }
    return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      code,
      newPassword,
    }) as unknown as void;
  },

  async registerLecturer(data: any): Promise<AuthResponse> {
    // Spec shows RegisterLecturerRequest with expertise, bio etc.
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER_LECTURER, data) as unknown as AuthResponse;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }) as unknown as AuthResponse;
  },
};

// ==========================================
// 2. DỊCH VỤ DANH MỤC (CATEGORY)
// ==========================================

/**
 * Adapter chuẩn hóa dữ liệu Category từ Backend.
 * Xử lý mọi biến thể tên trường (cateId, categoryId...) về chuẩn { id, name }.
 * @param {CategoryRaw} raw - Object dữ liệu thô từ API
 * @returns {Category} Object dữ liệu đã làm sạch
 */
function normalizeCategory(raw: CategoryRaw): Category {
  return {
    id: String(raw.cateId ?? raw.categoryId ?? raw.id ?? raw.Id ?? ""),
    name: String(raw.cateName ?? raw.categoryName ?? raw.name ?? raw.Name ?? "Chưa đặt tên"),
  };
}

export const categoryService = {
  /**
   * Lấy danh sách tất cả danh mục khóa học.
   * Dữ liệu trả về được đảm bảo luôn sạch và đúng chuẩn `Category[]`.
   */
  async getAll(): Promise<Category[]> {
    // 1. Fetch data
    const data = await apiClient.get<CategoryRaw[] | { items: CategoryRaw[] }>(
      API_ENDPOINTS.CATEGORY.GET_ALL
    );
    
    // 2. Bóc vỏ bọc (nếu BE trả về { items: [] } thay vì mảng trực tiếp)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: CategoryRaw[] = Array.isArray(data) ? data : ((data as any)?.items || []);
    
    // 3. Normalize dữ liệu sạch, lọc bỏ rác
    return items.map(normalizeCategory).filter((cat) => cat.id !== "");
  },
};
