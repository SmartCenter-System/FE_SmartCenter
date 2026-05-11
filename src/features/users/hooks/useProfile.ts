import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../profileService";
import { toast } from "sonner";
import type { UpdateProfileRequest } from "../services";

export const PROFILE_QUERY_KEY = ["user-profile"];

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success("Cập nhật thành công");
    }
  });
}