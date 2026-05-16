// Định nghĩa interface cho DashboardData
export interface DashboardData {
  totalWatchTimeMinutes: number;
  completedLessons: number;
  inProgressLessons: number;
}



// Custom hook sử dụng service
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { useAuthStore } from "@/features/auth/store";

export function useDashboardData() {
  const { accessToken } = useAuthStore();
  return useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const data = await dashboardService.getStats();
      return data || {
        totalWatchTimeMinutes: 0,
        completedLessons: 0,
        inProgressLessons: 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    retry: 1,
    enabled: !!accessToken,
  });
}