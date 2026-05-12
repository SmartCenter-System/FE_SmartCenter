import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/features/services";

/**
 * Hook dùng để lấy tất cả các danh mục khóa học hiện có từ hệ thống.
 * Các danh mục thường ít thay đổi, do đó chúng được cache trong thời gian dài.
 * 
 * @returns Đối tượng React Query chứa dữ liệu danh sách danh mục, trạng thái loading và các hàm refetch.
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"], // Cache key cho các danh mục global
    queryFn: () => categoryService.getAll(), // Gọi API lấy danh sách danh mục
    staleTime: 1000 * 60 * 30, // Dữ liệu được giữ mới (fresh) trong 30 phút để giảm thiểu gọi API không cần thiết
  });
}
