import { createBaseService } from "@/shared/services/BaseService";

// Định nghĩa interface cho DashboardData
export interface DashboardData {
  totalWatchTimeMinutes: number;
  completedLessons: number;
  inProgressLessons: number;
}

// Tạo service cho dashboard
export const dashboardService = createBaseService<DashboardData>({
  endpoint: "/api/Courses/dashboard",
});