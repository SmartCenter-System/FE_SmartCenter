import { useQuery } from "@tanstack/react-query";
import { enrollmentService } from "../service";
import { useAuthStore } from "@/features/auth/store";

export const ENROLLMENT_KEYS = {
  all: ["enrollments"] as const,
  me: () => [...ENROLLMENT_KEYS.all, "me"] as const,
};

export function useMyEnrollments(enabled = true) {
  // Role-based access control: only STUDENT role can fetch enrollments
  const userRole = useAuthStore((state) => state.role);
  const isStudent = userRole === "STUDENT";
  const shouldQueryBeEnabled = enabled && isStudent;

  return useQuery({
    queryKey: ENROLLMENT_KEYS.me(),
    queryFn: () => enrollmentService.getMyEnrollments(),
    enabled: shouldQueryBeEnabled,
    staleTime: 1000 * 60 * 30, // Keep data fresh for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep data in cache for 1 hour
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: false,
  });
}
