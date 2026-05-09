import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute, RoleGuard } from "@/shared/components/guards";

// ─── Auth & Error Pages ───────────────────────────────────────────────────────
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import UnauthorizedPage from "@/pages/error/UnauthorizedPage";

// ─── Landing / Public Pages ───────────────────────────────────────────────────
import HomePage from "@/features/landing/HomePage";
import ExploreCoursePage from "@/features/courses/pages/ExploreCoursePage";
import LandingLayout from "@/features/landing/LandingLayout";
import CoursesPage from "@/pages/courses/CoursesPage";
import CourseDetailPage from "@/pages/courses/CourseDetailPage";
import CourseStudyingPage from "@/pages/courses/CourseStudyingPage";
import CheckoutPage from "@/pages/checkout/CheckoutPage";

// ─── Student Dashboard (yêu cầu đăng nhập) ───────────────────────────────────
import StudentDashboardPage from "@/features/dashboard/pages/StudentDashboardPage";

// ─── Admin Panel ──────────────────────────────────────────────────────────────
import AdminLayout from "@/shared/layouts/AdminLayout";
import CourseManagementPage from "@/pages/admin/courses/CourseManagementPage";
import CourseEditorPage from "@/pages/admin/courses/CourseEditorPage";
import CourseContentEditor from "@/pages/admin/courses/CourseContentEditor";
import UserManagementPage from "@/pages/admin/users/UserManagementPage";

// ─── Staff Panel ──────────────────────────────────────────────────────────────
import StaffLayout from "@/shared/layouts/StaffLayout";
import EnrollmentManagementPage from "@/pages/staff/enrollments/EnrollmentManagementPage";

const router = createBrowserRouter([
  // ─── Public routes (không cần đăng nhập) ─────────────────────────
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "courses/:id", element: <CourseDetailPage /> },
      { path: "courses/:id/study/:lessonId", element: <CourseStudyingPage /> },
    ],
  },

  // ─── Protected: yêu cầu đăng nhập (mọi role) ─────────────────────
  {
    element: <PrivateRoute />,
    children: [
      // Student checkout — đăng nhập là được, không cần role cụ thể
      {
        path: "/checkout/:id",
        element: <CheckoutPage />,
      },
      // Student Dashboard
      {
        path: "/dashboard",
        element: <StudentDashboardPage />,
      },
    ],
  },

  // ─── Protected: chỉ ADMIN ─────────────────────────────────────────
  {
    element: <RoleGuard allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/courses" replace /> },
          { path: "courses", element: <CourseManagementPage /> },
          { path: "courses/create", element: <CourseEditorPage /> },
          { path: "courses/:id/edit", element: <CourseEditorPage /> },
          { path: "courses/:id/content", element: <CourseContentEditor /> },
          { path: "users", element: <UserManagementPage /> },
        ],
      },
    ],
  },

  {
    path: "/explore-course",
    element: <ExploreCoursePage />,
  },
  // ─── Protected: chỉ STAFF (và ADMIN) ─────────────────────────────
  {
    element: <RoleGuard allowedRoles={["STAFF", "ADMIN"]} />,
    children: [
      {
        path: "/staff",
        element: <StaffLayout />,
        children: [
          { index: true, element: <Navigate to="/staff/enrollments" replace /> },
          { path: "enrollments", element: <EnrollmentManagementPage /> },
        ],
      },
    ],
  },

  // ─── Misc ─────────────────────────────────────────────────────────
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;