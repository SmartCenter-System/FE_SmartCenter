import { createBrowserRouter } from "react-router-dom";
import { PrivateRoute, RoleGuard } from "@/shared/components/guards";

// ─── Auth & Error Pages ───────────────────────────────────────────────────────
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import NotFoundPage from "@/shared/pages/error/NotFoundPage";
import UnauthorizedPage from "@/shared/pages/error/UnauthorizedPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

// ─── Landing / Public Pages ───────────────────────────────────────────────────
import HomePage from "@/features/landing/pages/HomePage";
import ExploreCoursePage from "@/features/courses/pages/ExploreCoursePage";
import LandingLayout from "@/features/landing/pages/LandingLayout";
import CourseDetailPage from "@/features/courses/pages/CourseDetailPage";
import CourseStudyingPage from "@/features/courses/pages/CourseStudyingPage";
import CheckoutPage from "@/features/orders/pages/CheckoutPage";
import ConsultationPage from "@/features/consultation/pages/ConsultantPage";

// ─── Student Dashboard (yêu cầu đăng nhập) ───────────────────────────────────
import StudentDashboardPage from "@/features/dashboard/pages/StudentDashboardPage";
import AdminDashboardPage from "@/features/dashboard/pages/AdminDashboardPage";
import StaffDashboardPage from "@/features/dashboard/pages/StaffDashboardPage";
import LecturerDashboardPage from "@/features/dashboard/pages/LecturerDashboardPage";
import LecturerCourseManagementPage from "@/features/dashboard/pages/LecturerCourseManagementPage";
import LecturerStudentProgressPage from "@/features/dashboard/pages/LecturerStudentProgressPage";
import LecturerGradingPage from "@/features/dashboard/pages/LecturerGradingPage";
import StaffConsultationManagementPage from "@/features/dashboard/pages/StaffConsultationManagementPage";
import DashboardRedirect from "@/shared/components/common/DashboardRedirect";

// ─── Admin Panel ──────────────────────────────────────────────────────────────
import AdminLayout from "@/shared/layouts/AdminLayout";
import CourseManagementPage from "@/features/courses/pages/admin/CourseManagementPage";
import CourseEditorPage from "@/features/courses/pages/admin/CourseEditorPage";
import CourseContentEditor from "@/features/courses/pages/admin/CourseContentEditor";
import UserManagementPage from "@/features/users/pages/admin/UserManagementPage";
import OrderManagementPage from "@/features/orders/pages/admin/OrderManagementPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

// ─── User Profile ────────────────────────────────────────────────────────────
import ProfileUserPage from "@/features/users/pages/user/ProfileUserPage";
import MyCoursesPage from "@/features/courses/pages/MyCoursesPage";

// ─── Staff Panel ──────────────────────────────────────────────────────────────
import StaffLayout from "@/shared/layouts/StaffLayout";
import LecturerLayout from "@/shared/layouts/LecturerLayout";
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
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "courses", element: <ExploreCoursePage /> },
      { path: "courses/:id", element: <CourseDetailPage /> },
      { path: "courses/:id/study/:lessonId", element: <CourseStudyingPage /> },
      { path: "contact", element: <ConsultationPage /> },
      { path: "consultation", element: <ConsultationPage /> },
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
          {
            path: "/profile",
            element: <SettingsPage />,
          },
          // Student Dashboard — chỉ STUDENT
          {
            element: <RoleGuard allowedRoles={["STUDENT"]} />,
            children: [
              {
                path: "/dashboard",
                element: <DashboardRedirect />,
              },
              {
                path: "/dashboard/student",
                element: <StudentDashboardPage />,
              },
              {
                path: "/dashboard/my-courses",
                element: <MyCoursesPage />,
              },
              {
                path: "/dashboard/settings",
                element: <SettingsPage />,
              },
            ],
          },
          // User Profile
          {
            path: "/profile",
            element: <ProfileUserPage />,
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
          { index: true, element: <AdminDashboardPage /> },
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "courses", element: <CourseManagementPage /> },
          { path: "courses/create", element: <CourseEditorPage /> },
          { path: "courses/:id/edit", element: <CourseEditorPage /> },
          { path: "courses/:id/content", element: <CourseContentEditor /> },
          { path: "users", element: <UserManagementPage /> },
          { path: "orders", element: <OrderManagementPage /> },
          { path: "consultations", element: <StaffConsultationManagementPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
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
          { index: true, element: <StaffDashboardPage /> },
          { path: "dashboard", element: <StaffDashboardPage /> },
          { path: "enrollments", element: <EnrollmentManagementPage /> },
          { path: "consultations", element: <StaffConsultationManagementPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  
  // ─── Protected: chỉ LECTURER ─────────────────────────────────────
  {
    element: <RoleGuard allowedRoles={["LECTURER", "ADMIN"]} />,
    children: [
      {
        path: "/lecturer",
        element: <LecturerLayout />,
        children: [
          { index: true, element: <LecturerDashboardPage /> },
          { path: "dashboard", element: <LecturerDashboardPage /> },
          { path: "courses", element: <LecturerCourseManagementPage /> },
          { path: "courses/:id/content", element: <CourseContentEditor /> },
          { path: "courses/:id/students", element: <LecturerStudentProgressPage /> },
          { path: "exams/:examId/grade/:studentId", element: <LecturerGradingPage /> },
          { path: "settings", element: <SettingsPage /> },
          // Thêm các route cho giảng viên sau này
        ],
      },
    ],
  },

  // ─── Misc ─────────────────────────────────────────────────────────
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;