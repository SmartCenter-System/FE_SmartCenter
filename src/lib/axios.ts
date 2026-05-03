import { toast } from "sonner";
import axios from "axios";
import { env } from "./env";
import { useAuthStore } from "@/features/auth/store";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
//Task 1.1.1:Khởi tạo Axios Instance
export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

//Task 1.1.2: Interceptor (Gắn Token và xử lý lỗi 401)
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//2. Lọc dữ liệu trả về và bắt lỗi 401
apiClient.interceptors.response.use(
  (response) => {
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;
    if (is401 && !originalRequest.url?.includes("/auth")) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = useAuthStore.getState().refreshToken;

        if (refreshToken) {
          try {
            const { data } = await axios.post(`${env.API_URL}/auth/refresh`, { refreshToken });
            const newAuth = data.data ?? data;
            
            useAuthStore.getState().setAuth({
              accessToken: newAuth.accessToken,
              refreshToken: newAuth.refreshToken,
              role: useAuthStore.getState().role,
            });

            processQueue(null, newAuth.accessToken);
            originalRequest.headers.Authorization = `Bearer ${newAuth.accessToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            useAuthStore.getState().clearAuth();
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject: (err: any) => reject(err),
        });
      });
    }
    // Xử lý các lỗi khác (400, 403, 500...)
    const message = error.response?.data?.message ?? error.message ?? "Đã có lỗi xảy ra";
    const isLogoutEndpoint = originalRequest.url?.includes("/auth/logout");

    if (!isLogoutEndpoint) {
      toast.error(message);
    }
    return Promise.reject(error);
  },
);
