import axios, { Method } from "axios";

const apiRequest = async (
  endpoint: string,
  method: Method,
  body: any = {}, // Axios Method type ensures valid HTTP methods
  headers: any = {} // Request body, default is an empty object
) => {
    try {
        const BASE_URL = 'http://127.0.0.1:8000/api/v1';
        const  url = `${BASE_URL}/${endpoint}`;
        const response = await axios({
            url,
            method,
            data: method !== 'GET' ? body : undefined,
            headers
        })

        // Return response data
        return response.data;
    } catch (error: any) {
        // Handle error
        throw error.response ? error.response.data :   new Error("An unexpected error occurred");
    }
};

export default apiRequest;