import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { UserProfile, UpdateProfileRequest } from "./services";

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return apiClient.get(API_ENDPOINTS.USER.GET_PROFILE) as unknown as UserProfile;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data) as unknown as UserProfile;
  },
};