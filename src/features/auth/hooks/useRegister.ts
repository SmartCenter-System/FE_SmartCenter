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
      
      if (!payload.accessToken || !payload.refreshToken) {
        toast.error("Phản hồi đăng ký không hợp lệ.");
        return;
      }

      // 1. Chạy qua máy lọc nước
      const cleanUser = normalizeAuthResponse(payload, payload.accessToken);

      // 2. Lưu vào kho
      setAuth({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        user: cleanUser,
      });

      toast.success("Đăng ký thành công! Hãy kiểm tra email.");
      navigate(`/verify-email?email=${encodeURIComponent(variables.email)}`, { 
        replace: true,
        state: location.state 
      });
    }
  });
}
