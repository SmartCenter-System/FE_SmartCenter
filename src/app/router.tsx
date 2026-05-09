import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute, RoleGuard } from "@/shared/components/guards";

// ─── Auth & Error Pages ───────────────────────────────────────────────────────
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import NotFoundPage from "@/shared/pages/error/NotFoundPage";
import UnauthorizedPage from "@/shared/pages/error/UnauthorizedPage";

// ─── Landing / Public Pages ───────────────────────────────────────────────────
import HomePage from "@/features/landing/pages/HomePage";
import ExploreCoursePage from "@/features/courses/pages/ExploreCoursePage";
import LandingLayout from "@/features/landing/pages/LandingLayout";
import CoursesPage from "@/features/courses/pages/CoursesPage";
import CourseDetailPage from "@/features/courses/pages/CourseDetailPage";
import CourseStudyingPage from "@/features/courses/pages/CourseStudyingPage";
import CheckoutPage from "@/features/orders/pages/CheckoutPage";
import ConsultantPage from "@/pages/consultant/ConsultantPage";

// ─── Student Dashboard (yêu cầu đăng nhập) ───────────────────────────────────
import StudentDashboardPage from "@/features/dashboard/pages/StudentDashboardPage";

// ─── Admin Panel ──────────────────────────────────────────────────────────────
import AdminLayout from "@/shared/layouts/AdminLayout";
import CourseManagementPage from "@/features/courses/pages/admin/CourseManagementPage";
import CourseEditorPage from "@/features/courses/pages/admin/CourseEditorPage";
import CourseContentEditor from "@/features/courses/pages/admin/CourseContentEditor";
import UserManagementPage from "@/features/users/pages/admin/UserManagementPage";

// ─── Staff Panel ──────────────────────────────────────────────────────────────
import StaffLayout from "@/shared/layouts/StaffLayout";
import EnrollmentManagementPage from "@/features/courses/pages/staff/EnrollmentManagementPage";

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
      { path: "contact", element: <ConsultantPage /> },
    ],
  },

  // ─── Protected: yêu cầu đăng nhập (mọi role) ─────────────────────
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <LandingLayout />,
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
    element: <LandingLayout />,
    children: [
      {
        path: "/explore-course",
        element: <ExploreCoursePage />,
      },
    ],
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