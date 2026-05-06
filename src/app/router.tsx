import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import UnauthorizedPage from "@/pages/error/UnauthorizedPage";
import HomePage from "@/features/landing/HomePage";
import ExploreCoursePage from "@/features/courses/pages/ExploreCoursePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/courses",
    element: <ExploreCoursePage />,
  },
  {
    path: "/explore-course",
    element: <ExploreCoursePage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  }
]);

export default router;