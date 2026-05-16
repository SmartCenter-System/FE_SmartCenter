import { toast } from "sonner";
import type { RoleType } from "@/shared/types";
import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, LoginRequest, AuthResponseRaw } from "../type";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { jwtDecode } from "jwt-decode";
import { authService } from "@/features/services";
import { normalizeAuthResponse } from "../normalize";

interface JwtPayload {
  sub: string;
  email: string;
  role: RoleType;
  UserId?: string;
  studentId?: string;
  Email?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  userId?: string;
  nameid?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
}

function pickString(source: Record<string, unknown> | undefined, keys: string[]) {
  if (!source) return null;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return null;
}

function normalizeRole(value?: string | null): RoleType | null {
  if (!value) return null;
  const upper = value.toUpperCase();
  if (upper === "ADMIN" || upper === "1") return "ADMIN";
  if (upper === "STUDENT" || upper === "2") return "STUDENT";
  if (upper === "LECTURER" || upper === "3") return "LECTURER";
  if (upper === "STAFF" || upper === "4") return "STAFF";
  if (upper === "GUEST") return "GUEST";
  return null;
}

function splitFullName(fullname?: string | null) {
  const normalized = (fullname ?? "").trim().replace(/\s+/g, " ");
  if (!normalized) {
    return { firstName: null, lastName: null };
  }

  const parts = normalized.split(" ");
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: null };
  }

  return {
    firstName: parts[parts.length - 1],
    lastName: parts.slice(0, -1).join(" "),
  };
}

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (res) => {
      // eslint-disable-next-line no-console
      console.debug("Login successful:", res);

      // 1. Unbox payload if nested
      const payload = ((res as any)?.data ?? res) as AuthResponseRaw;
      const accessToken = payload.accessToken || (payload as any).AccessToken;
      const refreshToken = payload.refreshToken || (payload as any).RefreshToken;

      if (!accessToken || !refreshToken) {
        toast.error("Phản hồi đăng nhập không hợp lệ. Vui lòng thử lại.");
        return;
      }

      // 2. Normalize user data
      const cleanUser = normalizeAuthResponse(payload, accessToken);

      // 3. Save to Store
      setAuth({
        accessToken,
        refreshToken,
        userId: cleanUser.userId,
        role: cleanUser.role,
        email: cleanUser.email,
        firstName: cleanUser.firstName,
        lastName: cleanUser.lastName,
      });

      toast.success("Đăng nhập thành công! Đang chuyển hướng...");

      // 4. Delayed Navigation to ensure UI feedback is visible
      setTimeout(() => {
        const isAuthPage = from === "/login" || from === "/register" || from === "/verify-email";
        
        if (from && from !== "/" && !isAuthPage) {
          navigate(from, { replace: true });
        } else {
          switch (cleanUser.role) {
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
      }, 500);
    },
    onError: (error: any) => {
      const message = error.userMessage || error.message || "Đăng nhập thất bại";
      toast.error(message);
    }
  });
}
