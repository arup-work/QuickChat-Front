import apiRequest from "../helpers/utils/api"
import { showErrorToast } from "../helpers/utils/toastUtils";

const MessageService = {
    fetchAllMessage: async(token: string,receiverId: string) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${token}` };
            const response = await apiRequest(`/message/${receiverId}`,"GET",null,bearerToken);
            return response.messages;
        } catch (error) {
            const errorMessage = (error as Error).message || 'An error occurred while fetching users.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    },
    fetchAllUsersLatMessages: async(token: string) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${token}` };
            const response = await apiRequest(`/message/last-messages`,"GET",null,bearerToken);
            return response.messages;
        } catch (error) {
            const errorMessage = (error as Error).message || 'An error occurred while fetching users.';
            showErrorToast(errorMessage);
            return { data: null, error: errorMessage };
        }
    } 
}

export default MessageService;