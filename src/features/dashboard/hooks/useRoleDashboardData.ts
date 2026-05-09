import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

// ─── Admin Dashboard Hook ───────────────────────────────────────
export function useAdminDashboardData() {
  return useQuery({
    queryKey: ["adminDashboardData"],
    queryFn: () => dashboardService.getAdminStats(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// ─── Staff Dashboard Hook ───────────────────────────────────────
export function useStaffDashboardData() {
  return useQuery({
    queryKey: ["staffDashboardData"],
    queryFn: async () => {
      // Endpoint giả định
      // @ts-ignore
      const response = await apiClient.get("/api/Staff/DashboardStats", { silent: true }).catch(() => null);
      return response;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// ─── Lecturer Dashboard Hook ────────────────────────────────────
export function useLecturerDashboardData() {
  return useQuery({
    queryKey: ["lecturerDashboardData"],
    queryFn: async () => {
      // Endpoint giả định
      // @ts-ignore
      const response = await apiClient.get("/api/Lecturer/DashboardStats", { silent: true }).catch(() => null);
      return response;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
