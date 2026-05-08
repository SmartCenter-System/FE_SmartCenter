import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import router from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 phút: Data được coi là "fresh" trong 5p, không gọi lại API
      gcTime: 10 * 60 * 1000, // 10 phút: Giữ cache trong 10p sau khi component unmount
      refetchOnWindowFocus: false, // Tắt tự động gọi lại API khi chuyển tab/focus lại trình duyệt
      retry: 1, // Nếu lỗi mạng, chỉ thử lại 1 lần (mặc định là 3)
    },
  },
});

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}