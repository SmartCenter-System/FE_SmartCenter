import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, RegisterRequest } from "../type";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { jwtDecode } from "jwt-decode";
import { authService } from "@/features/services";
import type { RoleType } from "@/shared/types";

interface JwtPayload {
  sub: string;
  email: string;
  role: RoleType;
}

export function useRegister() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data) => authService.register(data),
    onSuccess: (res) => {
      const decoded = jwtDecode<JwtPayload>(res.accessToken);

      setAuth({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        role: decoded.role,
        userId: res.user?.userId ?? decoded.sub ?? null,
      });
      toast.success("Đăng ký thành công!");
      if (decoded.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Đăng ký thất bại");
    },
  });
}
