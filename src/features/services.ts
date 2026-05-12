import { apiClient } from "@/lib/axios";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./auth/type";
import { API_ENDPOINTS } from "@/shared/constants";
import { useAuthStore } from "./auth/store";

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

export const categoryService = {
  async getAll() {
    const data = await apiClient.get<any>(API_ENDPOINTS.CATEGORY.GET_ALL);
    
    // Dữ liệu từ interceptor đã là ruột của ApiResponse.data
    // Nó có thể là mảng trực tiếp hoặc nằm trong { items: [] }
    const items = Array.isArray(data) ? data : (data.items || []);
    
    // Chuẩn hóa dữ liệu trả về để Frontend luôn có id và name
    return items.map((cat: any) => {
      // Tìm ID: ưu tiên cateId (như trong Course), sau đó đến categoryId, id...
      const id = String(cat?.cateId ?? cat?.categoryId ?? cat?.id ?? cat?.Id ?? "");
      // Tìm Name: ưu tiên cateName, sau đó đến categoryName, name...
      const name = String(cat?.cateName ?? cat?.categoryName ?? cat?.name ?? cat?.Name ?? "Chưa đặt tên");
      
      return { id, name };
    });
  },
};
