import { apiClient } from "@/lib/axios";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./auth/type";
import { API_ENDPOINTS } from "@/shared/constants";

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials) as unknown as AuthResponse;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data) as unknown as AuthResponse;
  },

  async logout(): Promise<void> {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT) as unknown as void;
  },
};
