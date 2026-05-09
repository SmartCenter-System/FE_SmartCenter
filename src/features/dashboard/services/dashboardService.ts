import { apiClient } from "@/lib/axios";

// Định nghĩa interface cho DashboardData
export interface DashboardData {
  totalWatchTimeMinutes: number;
  completedLessons: number;
  inProgressLessons: number;
}

// Tạo service cho dashboard
export const dashboardService = {
  getStats: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>("/api/Courses/dashboard");
    return response.data;
  },
};