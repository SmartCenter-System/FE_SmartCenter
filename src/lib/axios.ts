import { toast } from "sonner";
import axios from "axios";
import { env } from "./env";
import { useAuthStore } from "@/features/auth/store";

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason: any) => void }> = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
const base = env.API_URL === "/api" ? "" : env.API_URL;

export const apiClient = axios.create({
  baseURL: base,
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

// 2. Lọc dữ liệu trả về và bắt lỗi 401
apiClient.interceptors.response.use(
  (response) => {
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;

    // 1. Xử lý Refresh Token (Giữ nguyên logic ổn định cũ nhưng refactor nhẹ)
    if (is401 && !originalRequest.url?.includes("/auth") && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;
        const refreshToken = useAuthStore.getState().refreshToken;

        if (refreshToken) {
          try {
            const { data } = await axios.post(`${env.API_URL}/auth/refresh`, { refreshToken });
            const newAuth = data.data ?? data;

            useAuthStore.getState().setAuth({
              accessToken: newAuth.accessToken,
              refreshToken: newAuth.refreshToken,
              role: useAuthStore.getState().role as any,
              userId: useAuthStore.getState().userId,
              email: useAuthStore.getState().email,
              firstName: useAuthStore.getState().firstName,
              lastName: useAuthStore.getState().lastName,
            });

            processQueue(null, newAuth.accessToken);
            originalRequest.headers.Authorization = `Bearer ${newAuth.accessToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            useAuthStore.getState().clearAuth();
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          isRefreshing = false;
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

    // 2. Parser lỗi chuyên sâu cho .NET và Network
    let message = "Đã có lỗi xảy ra";
    const responseData = error.response?.data;

    if (responseData) {
      // Trường hợp 1: Có message trực tiếp
      if (responseData.message) {
        message = responseData.message;
      }
      // Trường hợp 2: Lỗi Validation của .NET (Object errors)
      else if (responseData.errors) {
        const errorList = Object.values(responseData.errors).flat();
        message = errorList.length > 0 ? String(errorList[0]) : "Dữ liệu không hợp lệ";
      }
      // Trường hợp 3: String error trực tiếp
      else if (typeof responseData === "string") {
        message = responseData;
      }
    } else if (error.request) {
      message = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra internet.";
    }

    const isLogoutEndpoint = originalRequest.url?.includes("/auth/logout");
    const isSilent = (originalRequest as any).silent === true;

    if (!isLogoutEndpoint && !isSilent && error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
