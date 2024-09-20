import apiRequest from "../helpers/utils/api";
import { showErrorToast, showSuccessToast } from "../helpers/utils/toastUtils";

const AuthService = {
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await apiRequest("auth/register", "POST", {
        name,
        email,
        password,
      });
      return response;
    } catch (error: any) {
      showErrorToast(error.message);
    }
  },
  login: async (email: string, password: string) => {
    try {
        const response = await apiRequest("auth/login", "POST", {
          email,
          password
        });
        showSuccessToast(response.message);
    } catch (error: any) {
      console.log(error);
      
      showErrorToast(error.message);
    }
  },
};

export default AuthService;
