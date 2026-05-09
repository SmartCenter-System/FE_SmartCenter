// Định nghĩa interface cho DashboardData
export interface DashboardData {
  totalWatchTimeMinutes: number;
  completedLessons: number;
  inProgressLessons: number;
}



// Custom hook sử dụng service
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const data = await dashboardService.getStats();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    retry: 1,
  });
}