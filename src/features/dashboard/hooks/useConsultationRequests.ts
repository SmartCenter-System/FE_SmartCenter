import { useQuery } from "@tanstack/react-query";
import { consultationService } from "@/features/consultation/service";
import type { ConsultationQueryParams } from "@/features/consultation/service";

export interface ConsultationItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  courseId?: string;
  courseName?: string;
  note?: string;
  status: string;
  createdAt: string;
}

export function useConsultationRequests(page = 1, pageSize = 10, search?: string) {
  return useQuery<{ totalCount: number; items: ConsultationItem[] }>({
    queryKey: ["consultation-requests", page, pageSize, search],
    queryFn: async () => {
      const params: ConsultationQueryParams = { PageIndex: page, PageSize: pageSize };
      if (search) params.Search = search;
      const res = await consultationService.getConsultations(params);
      return res as { totalCount: number; items: ConsultationItem[] };
    },
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep data in cache for 10 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
    refetchIntervalInBackground: false, // Don't refetch in background when tab is inactive
    refetchOnMount: false, // Don't refetch just because the page remounts
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}
