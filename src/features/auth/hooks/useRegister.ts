import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/features/services";
import { useAuthStore } from "@/features/auth/store";
import { jwtDecode } from "jwt-decode";
import type { AuthResponse, RegisterRequest } from "../type";
import type { RoleType } from "@/shared/types";

interface JwtPayload {
  sub: string;
  email: string;
  role: RoleType;
}

export function useRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data) => authService.register(data),
    onSuccess: (res, variables) => {
      const decoded = jwtDecode<JwtPayload>(res.accessToken);

      setAuth({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        role: decoded.role,
        userId: res.user?.userId ?? decoded.sub ?? null,
      });

      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
      navigate(`/verify-email?email=${encodeURIComponent(variables.email)}`, { 
        replace: true,
        state: location.state 
      });
    },
    onError: (error: any) => {
      toast.error(error.userMessage || "Đăng ký thất bại");
    },
  });
}
