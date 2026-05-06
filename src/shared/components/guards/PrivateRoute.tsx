import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

/**
 * Bảo vệ route: chỉ cho phép người dùng đã đăng nhập (có accessToken).
 * Nếu chưa đăng nhập → redirect về /login, đồng thời lưu lại trang hiện tại
 * vào `location.state.from` để sau khi login xong có thể quay lại đúng chỗ.
 */
export default function PrivateRoute() {
  const { accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
