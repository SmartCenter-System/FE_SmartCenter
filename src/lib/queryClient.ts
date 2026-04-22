import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      retry: 1, // Chỉ retry 1 lần khi lỗi
      refetchOnWindowFocus: true, // Tự động refetch khi focus lại tab
    },
  },
});
