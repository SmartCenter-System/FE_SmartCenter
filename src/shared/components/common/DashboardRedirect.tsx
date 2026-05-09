import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

export default function DashboardRedirect() {
  const { role } = useAuthStore();

  // Chuẩn hóa role đề phòng trường hợp cache cũ hoặc định dạng khác nhau
  let userRole = role;
  const r = String(role).toUpperCase();

  if (r === "1" || r === "ADMIN") userRole = "ADMIN";
  else if (r === "2" || r === "STUDENT") userRole = "STUDENT";
  else if (r === "3" || r === "LECTURER") userRole = "LECTURER";
  else if (r === "4" || r === "STAFF") userRole = "STAFF";

  switch (userRole) {
    case "ADMIN":
      return <Navigate to="/admin" replace />;
    case "STAFF":
      return <Navigate to="/staff" replace />;
    case "LECTURER":
      return <Navigate to="/lecturer" replace />;
    case "STUDENT":
    default:
      return <Navigate to="/dashboard/student" replace />;
  }
}
