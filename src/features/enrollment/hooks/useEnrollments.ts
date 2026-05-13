import { useQuery } from "@tanstack/react-query";
import { enrollmentService } from "../service";

export const ENROLLMENT_KEYS = {
  all: ["enrollments"] as const,
  me: () => [...ENROLLMENT_KEYS.all, "me"] as const,
};

export function useMyEnrollments(enabled = true) {
  return useQuery({
    queryKey: ENROLLMENT_KEYS.me(),
    queryFn: () => enrollmentService.getMyEnrollments(),
    enabled,
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: false,
  });
}
