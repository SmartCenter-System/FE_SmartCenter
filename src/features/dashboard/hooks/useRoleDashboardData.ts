import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { useAuthStore } from "@/features/auth/store";
import type {
  CleanAdminDashboard,
  CleanLecturerDashboard,
  CleanStaffDashboard,
} from "../type";

// ─── Admin Dashboard Hook ───────────────────────────────────────
export function useAdminDashboardData() {
  return useQuery<CleanAdminDashboard>({
    queryKey: ["adminDashboardData"],
    queryFn: () => dashboardService.getAdminStats(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// ─── Staff Dashboard Hook ───────────────────────────────────────
export function useStaffDashboardData() {
  return useQuery<CleanStaffDashboard>({
    queryKey: ["staffDashboardData"],
    queryFn: () => dashboardService.getStaffStats(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// ─── Lecturer Dashboard Hook ────────────────────────────────────
export function useLecturerDashboardData() {
  const userId = useAuthStore((state) => state.userId);

  return useQuery<CleanLecturerDashboard>({
    queryKey: ["lecturerDashboardData", userId],
    queryFn: () => (userId ? dashboardService.getLecturerStats(userId) : Promise.reject("No User ID")),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
