import { toast } from "sonner";
import type { RoleType } from "@/shared/types";
import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, LoginRequest } from "../type";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { jwtDecode } from "jwt-decode";
import { authService } from "@/features/services";

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (res) => {
      const decoded = jwtDecode<any>(res.accessToken);

      // Lấy role từ JWT, xử lý trường hợp .NET dùng claim URI dài
      const rawRole =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded.Role ||
        decoded.ROLE;

      // Mapping role từ Backend (1: Admin, 2: Student, 3: Lecturer, 4: Staff)
      let userRole: RoleType = "STUDENT";
      const r = String(rawRole).toUpperCase();

      if (r === "1" || r === "ADMIN") userRole = "ADMIN";
      else if (r === "2" || r === "STUDENT") userRole = "STUDENT";
      else if (r === "3" || r === "LECTURER") userRole = "LECTURER";
      else if (r === "4" || r === "STAFF") userRole = "STAFF";

      // Extract userId (handling .NET claims)
      const extractedUserId =
        decoded.sub ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded.nameid ||
        decoded.Id ||
        "";

      setAuth({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        role: userRole,
        userId: extractedUserId,
      });
      toast.success("Đăng nhập thành công!");

      // Chuyển hướng theo role
      if (from && from !== "/") {
        navigate(from, { replace: true });
      } else {
        switch (userRole) {
          case "ADMIN":
            navigate("/admin", { replace: true });
            break;
          case "STAFF":
            navigate("/staff", { replace: true });
            break;
          case "LECTURER":
            navigate("/lecturer", { replace: true });
            break;
          case "STUDENT":
          default:
            navigate("/dashboard", { replace: true });
            break;
        }
      }
    },
  });
}
