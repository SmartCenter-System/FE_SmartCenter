import { toast } from "sonner";
import type { RoleType } from "@/shared/types";
import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, LoginRequest } from "../type";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { jwtDecode } from "jwt-decode";
import { authService } from "@/features/services";

interface JwtPayload {
  sub: string;
  email: string;
  role: RoleType;
}

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (res) => {
      const decoded = jwtDecode<JwtPayload>(res.accessToken);

      setAuth({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        role: decoded.role,
      });
      toast.success("Đăng nhập thành công!");
      if (decoded.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    },
  });
}
