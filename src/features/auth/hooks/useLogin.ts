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
  if (upper === "ADMIN" || upper === "STUDENT" || upper === "LECTURER" || upper === "STAFF" || upper === "GUEST") {
    return upper;
  }
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
  const { setAuth } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (res) => {
      const payload = ((res as unknown as { data?: AuthResponse })?.data ?? res) as AuthResponse;
      const payloadRecord = payload as unknown as Record<string, unknown>;
      const userRecord = (payloadRecord.user ?? {}) as Record<string, unknown>;

      const accessToken = pickString(payloadRecord, ["accessToken", "AccessToken"]);
      const refreshToken = pickString(payloadRecord, ["refreshToken", "RefreshToken"]);

      if (!accessToken || !refreshToken) {
        toast.error("Phản hồi đăng nhập không hợp lệ. Vui lòng thử lại.");
        return;
      }

      const decoded = jwtDecode<JwtPayload>(accessToken);
      const decodedRole =
        decoded.role ??
        (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as RoleType | undefined);
      const role =
        normalizeRole(pickString(payloadRecord, ["role", "Role"])) ??
        normalizeRole(pickString(userRecord, ["role", "Role"])) ??
        normalizeRole(decodedRole);
      const fullName =
        pickString(payloadRecord, ["fullname", "fullName", "FullName"]) ??
        [
          pickString(userRecord, ["lastName", "LastName"]),
          pickString(userRecord, ["firstName", "FirstName"]),
        ]
          .filter(Boolean)
          .join(" ");
      const splitName = splitFullName(fullName);

      setAuth({
        accessToken,
        refreshToken,
        role,
        userId:
          pickString(payloadRecord, ["userId", "UserId", "studentId", "StudentId"]) ??
          pickString(userRecord, ["userId", "UserId", "studentId", "StudentId"]) ??
          decoded.UserId ??
          decoded.studentId ??
          decoded.sub ??
          decoded.userId ??
          decoded.nameid ??
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
          null,
        email:
          pickString(payloadRecord, ["email", "Email"]) ??
          pickString(userRecord, ["email", "Email"]) ??
          decoded.Email ??
          decoded.email ??
          null,
        firstName:
          pickString(userRecord, ["firstName", "FirstName"]) ??
          splitName.firstName,
        lastName:
          pickString(userRecord, ["lastName", "LastName"]) ??
          splitName.lastName,
      });
      toast.success("Đăng nhập thành công!");
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "STAFF") {
        navigate("/staff/enrollments", { replace: true });
      } else {
        // STUDENT / LECTURER / GUEST: về dashboard hoặc trang đã lưu (e.g. sau redirect từ PrivateRoute)
        const destination = from && from !== "/" ? from : "/dashboard";
        navigate(destination, { replace: true });
      }
    },
    
  });

  
}
