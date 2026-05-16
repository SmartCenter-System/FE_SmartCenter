import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/features/services";
import { useAuthStore } from "@/features/auth/store";
import { normalizeAuthResponse } from "../normalize";
import type { AuthResponseRaw, RegisterRequest } from "../type";

export function useRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponseRaw, Error, RegisterRequest>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data) => authService.register(data) as any,
    onSuccess: (res, variables) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload = ((res as any)?.data ?? res) as AuthResponseRaw;
      
      // Nếu Backend trả về token ngay (Auto login sau khi đăng ký)
      if (payload.accessToken && payload.refreshToken) {
        // 1. Chạy qua máy lọc nước
        const cleanUser = normalizeAuthResponse(payload, payload.accessToken);

        // 2. Lưu vào kho
        setAuth({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          userId: cleanUser.userId,
          role: cleanUser.role,
          email: cleanUser.email,
          firstName: cleanUser.firstName,
          lastName: cleanUser.lastName,
        });

        toast.success("Đăng ký thành công! Đang chuyển hướng...");
        navigate("/dashboard", { replace: true });
        return;
      }

      // Nếu Backend KHÔNG trả về token (Yêu cầu xác thực email trước)
      toast.success("Đăng ký thành công! Hãy kiểm tra email của bạn.");
      navigate(`/login`, { 
        replace: true,
        state: { email: variables.email } 
      });
    },
    onError: (error: any) => {
      const message = error.userMessage || error.message || "Đăng ký thất bại";
      toast.error(message);
    }
  });
}
