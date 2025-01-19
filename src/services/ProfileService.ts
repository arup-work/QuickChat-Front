import apiRequest from "../helpers/utils/api";
import { showErrorToast } from "../helpers/utils/toastUtils";

const ProfileService = {
  updateProfileName: async (token: string, userId: string, name: string) => {
    try {
      const bearerToken = { Authorization: `Bearer ${token}` };
      const response = await apiRequest(
        `user/update-name/${userId}`,
        "POST",
        { name },
        bearerToken
      );
      return response;
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An error occurred while fetching users.";
      showErrorToast(errorMessage);
      return { data: null, error: errorMessage };
    }
  },

  updateProfileImage: async(token: string, userId: string, image: Blob) => {
    const formData = new FormData();
    formData.append('image',image);

    try {
      const bearerToken = { Authorization: `Bearer ${token}` };
      const response = await apiRequest(
        `user/update-profile-image/${userId}`,
        "POST",
        formData,
        bearerToken
      );
      return response;
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An error occurred while fetching users.";
      showErrorToast(errorMessage);
      return { data: null, error: errorMessage };
    }
  }
};

export default ProfileService;
