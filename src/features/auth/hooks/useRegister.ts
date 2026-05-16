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
      // eslint-disable-next-line no-console
      console.debug("Registration successful:", res);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload = ((res as any)?.data ?? res) as AuthResponseRaw;
      
      // Case 1: Auto login if tokens are provided
      if (payload?.accessToken && payload?.refreshToken) {
        const cleanUser = normalizeAuthResponse(payload, payload.accessToken);

        setAuth({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          userId: cleanUser.userId,
          role: cleanUser.role,
          email: cleanUser.email,
          firstName: cleanUser.firstName,
          lastName: cleanUser.lastName,
        });

        toast.success("Đăng ký thành công! Chào mừng bạn.");
        navigate("/dashboard", { replace: true });
        return;
      }

      // Case 2: Standard flow (verify email or manual login)
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      
      // Small delay to let the user see the toast before navigating
      setTimeout(() => {
        navigate("/login", { 
          replace: true,
          state: { email: variables.email } 
        });
      }, 500);
    },
    onError: (error: any) => {
      const message = error.userMessage || error.message || "Đăng ký thất bại";
      toast.error(message);
    }
  });
}
