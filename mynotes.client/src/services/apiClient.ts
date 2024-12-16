import axios from "axios";
import { API_BASE_URL } from "../configuration/config";

// Create Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Add interceptor to attach token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${ token }`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
export default apiClient;