import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import type { RoleType } from "@/shared/types";

interface RoleGuardProps {
  /** Danh sách role được phép truy cập route này */
  allowedRoles: RoleType[];
}

/**
 * Bảo vệ route theo role.
 * - Nếu chưa đăng nhập → /login
 * - Nếu đã đăng nhập nhưng không có role phù hợp → /unauthorized
 *
 * Dùng sau PrivateRoute hoặc độc lập khi cần phân quyền cụ thể.
 *
 * @example
 * <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
 *   <Route path="admin/..." element={<AdminPage />} />
 * </Route>
 */
export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { accessToken, role } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Chuẩn hóa role (xử lý trường hợp role là số từ Backend cũ hoặc cache)
  let normalizedRole = role;
  const r = String(role).toUpperCase();

  if (r === "1" || r === "ADMIN") normalizedRole = "ADMIN";
  else if (r === "2" || r === "STUDENT") normalizedRole = "STUDENT";
  else if (r === "3" || r === "LECTURER") normalizedRole = "LECTURER";
  else if (r === "4" || r === "STAFF") normalizedRole = "STAFF";

  if (!normalizedRole || !allowedRoles.includes(normalizedRole as RoleType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
