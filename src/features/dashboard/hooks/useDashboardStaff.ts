import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { useAuthStore } from "@/features/auth/store";

export interface DashboardStats {
  pendingConsultations: number;
  newStudentsToday: number;
  pendingOrders: number;
}

export function useDashboardStaff() {
  const role = useAuthStore(state => state.role);

  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await dashboardService.fetchStaffStats();
      return res as unknown as DashboardStats;
    },
    enabled: role === "STAFF", // Chỉ gọi API nếu là STAFF để tránh lỗi 403
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep data in cache for 10 minutes
    refetchOnMount: false, // Keep cached stats when returning to the page
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}
