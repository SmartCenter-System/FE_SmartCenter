import { useMutation, useQuery } from "@tanstack/react-query";
import { courseService } from "../services";
import type { PublicCourseQueryParams } from "../type";

/**
 * Interface đại diện cho trạng thái của các bộ lọc được áp dụng cho khóa học công khai.
 * @property {string} keyword - Từ khóa tìm kiếm để lọc khóa học theo tiêu đề/tên.
 * @property {number} [mode] - Hình thức học của khóa học (VD: 1 cho Online, 2 cho Offline).
 * @property {string} [categoryId] - ID của danh mục để lọc khóa học.
 * @property {number} [minPrice] - Giới hạn giá tối thiểu cho khóa học.
 * @property {number} [maxPrice] - Giới hạn giá tối đa cho khóa học.
 */
export interface PublicCourseFilterState {
  keyword: string;
  mode?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Hook dùng để lấy danh sách khóa học công khai dựa trên các tham số truy vấn.
 * Sử dụng React Query để cache và quản lý vòng đời fetch dữ liệu.
 * @param {PublicCourseQueryParams} params - Các tham số truy vấn được gửi đến API.
 * @returns Đối tượng React Query chứa `data`, `isLoading`, `isError` và các phương thức fetch.
 */
export function usePublicCourses(params: PublicCourseQueryParams, enabled = true) {
  return useQuery({
    queryKey: ["public-courses", params], // Khóa cache duy nhất dựa trên params
    queryFn: () => courseService.getPublicCourses(params), // Gọi API lấy khóa học
    placeholderData: (prev) => prev, // Giữ dữ liệu cũ trong lúc fetch dữ liệu mới
    retry: false, // Không thử lại khi lỗi để tránh vòng lặp vô hạn với mã lỗi 400
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false, // Không gọi lại API khi quay lại tab để tiết kiệm request
    refetchOnReconnect: false,
    enabled,
  });
}

/**
 * Hook để thực hiện mutation áp dụng bộ lọc khóa học công khai.
 * Có thể được sử dụng để đồng bộ hóa trạng thái bộ lọc hoặc kích hoạt các effect khi áp dụng bộ lọc.
 * @param {function} onApplied - Callback được thực thi thành công khi một bộ lọc được áp dụng.
 * @returns Đối tượng mutation của React Query.
 */
export function useApplyPublicCourseFiltersMutation(
  onApplied: (next: PublicCourseFilterState) => void,
) {
  return useMutation({
    mutationFn: async (next: PublicCourseFilterState) => next, // Mô phỏng mutation bất đồng bộ cho state mới
    onSuccess: (next) => {
      onApplied(next); // Gọi callback với state mới
    },
  });
}
