import axios from "axios";
import { toast } from "sonner";
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

// Khởi tạo URL gốc (Bảo vệ trường hợp biến env bị thiếu)
const base = env.API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: base === "/api" ? "" : base,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// 1. REQUEST INTERCEPTOR (Gắn Token)
// ==========================================
apiClient.interceptors.request.use((config) => {
  // Lấy token trực tiếp từ store
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// 2. RESPONSE INTERCEPTOR (Bắt lỗi & Tự động bóc tách Data)
// ==========================================
apiClient.interceptors.response.use(
  (response) => {
    const apiResponse = response.data;

    // Nếu Backend trả về cấu trúc Wrapper chuẩn { success, data, message, ... }
    if (apiResponse && typeof apiResponse === "object" && "success" in apiResponse) {
      // Nếu thành công -> Trả về cục data bên trong cho service dùng luôn
      if (apiResponse.success) {
        return apiResponse.data;
      }

      // Nếu success = false -> Ném lỗi để catch xử lý
      return Promise.reject(apiResponse);
    }

    // Trường hợp khác (không bọc wrapper) -> Trả về nguyên bản
    return apiResponse;
  },
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;

    // ----------------------------------------
    // A. XỬ LÝ REFRESH TOKEN TỰ ĐỘNG
    // ----------------------------------------
    if (is401 && originalRequest.url && !originalRequest.url.includes("/login") && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        const refreshToken = useAuthStore.getState().refreshToken;

        if (refreshToken) {
          try {
            // Gọi API cấp lại token (Đảm bảo URL khớp với Swagger)
            const { data } = await axios.post(`${base}/api/auth/refresh`, { refreshToken });

            // Lấy token mới (dự phòng trường hợp BE bọc lớp data)
            const newAuth = data.data ?? data;

            // Cập nhật lại Zustand Store an toàn
            const currentStore = useAuthStore.getState();
            currentStore.setAuth({
              accessToken: newAuth.accessToken,
              refreshToken: newAuth.refreshToken,
              role: currentStore.role,
              userId: currentStore.userId,
              email: currentStore.email,
              firstName: currentStore.firstName,
              lastName: currentStore.lastName,
            });

            processQueue(null, newAuth.accessToken);
            originalRequest.headers.Authorization = `Bearer ${newAuth.accessToken}`;

            // Gọi lại request ban đầu vừa bị xịt
            return apiClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);

            // Xóa Auth và văng ra log in nếu refresh token cũng hết hạn
            const store = useAuthStore.getState();
            store.clearAuth();

            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // Không có refresh token -> Kick ra log in
          isRefreshing = false;
          const store = useAuthStore.getState();
          store.clearAuth();

          if (!window.location.pathname.includes("/login")) window.location.href = "/login";
          return Promise.reject(error);
        }
      }

      // Nếu đang trong quá trình refresh, tống các request đến sau vào Hàng đợi (Queue)
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

    // ----------------------------------------
    // B. PARSER LỖI CHUYÊN SÂU TỪ BACKEND
    // ----------------------------------------
    let message = "Đã có lỗi xảy ra từ máy chủ";
    const responseData = error.response?.data;

    if (responseData) {
      // Ưu tiên đọc trường message của cấu trúc Wrapper
      if (responseData.message) {
        message = responseData.message;
      }
      // Xử lý lỗi validation (mảng errors) của .NET/Spring Boot
      if (responseData.errors && typeof responseData.errors === "object") {
        const errorList = Object.values(responseData.errors).flat();
        if (errorList.length > 0) message = String(errorList[0]);
      }
      // Nếu BE ném thẳng text string
      else if (typeof responseData === "string" && !responseData.includes("<!DOCTYPE")) {
        message = responseData;
      }
    } else if (error.request) {
      message = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.";
    }

    // Gắn message sạch vào error để hook React Query có thể lấy ra show UI
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).userMessage = message;

    // ----------------------------------------
    // C. BẬT TOAST THÔNG BÁO LỖI TỰ ĐỘNG
    // ----------------------------------------
    const isLogoutEndpoint = originalRequest.url?.includes("/logout");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isSilent = (originalRequest as any).silent === true;

    // Không show Toast nếu: đang logout, request có flag silent, hoặc lỗi 401 (vì 401 đã xử lý ở trên)
    if (!isLogoutEndpoint && !isSilent && !is401) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
