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

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
