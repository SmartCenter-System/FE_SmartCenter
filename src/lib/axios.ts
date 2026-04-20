import { toast } from "sonner";
import axios from "axios";
import { env } from "./env";
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
  //TODO: Tạm thời lấy token từ localStorage. Ở Week 2 (Task 2.1), đổi sang lấy từ useAuthStore của Zustand cho chuẩn.
  const token = localStorage.getItem("accessToken");
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
      //TODO: Ở Week 2, mình sẽ thêm logic Queue Refresh Token vào đây
      //Tạm thời bây giờ: Xóa token và bắt đăng nhập lại.
      localStorage.removeItem("accessToken");
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
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
