import apiRequest from "../helpers/utils/api"
import { showErrorToast } from "../helpers/utils/toastUtils";

const UserService = {
    fetchAllUsers: async(token: string) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${token}` };
            const response = await apiRequest("user/all-users", "GET", null, bearerToken);
            return response.users;
            
        } catch (error) {
            const errorMessage = (error as Error).message || 'An error occurred while fetching users.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    }
}

export default UserService;