import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export interface DashboardStats {
  pendingConsultations: number;
  newStudentsToday: number;
  pendingOrders: number;
}

export function useDashboardStaff() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await dashboardService.fetchStaffStats();
      return res as unknown as DashboardStats;
    },
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep data in cache for 10 minutes
    refetchOnMount: false, // Keep cached stats when returning to the page
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}
