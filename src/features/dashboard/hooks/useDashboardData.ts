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
      try {
        const response = await dashboardService.getAll();
        console.log("Dashboard API Response:", response);
        
        // Axios interceptor extract response.data.data, nên response chính là DashboardData object
        if (response && typeof response === 'object' && 'totalWatchTimeMinutes' in response) {
          return response as unknown as DashboardData;
        }
        
        console.error("Invalid response format:", response);
        throw new Error("Invalid dashboard data format");
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    retry: 1,
  });
}