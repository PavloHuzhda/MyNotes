//authService.ts
import axios from "axios";
import { API_BASE_URL } from "../configuration/config"

// Define API URL
const API_URL = `${API_BASE_URL}/users`;


// Register User
export const registerUser = async (userData: {
    username: string;
    email: string;
    firstname: string;
    secondname: string;
    password: string;
    confirmPassword: string;
}): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Login User
export const loginUser = async (data: { identifier: string; password: string }): Promise<{ message: string; token: string }> => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data; // Expecting the backend to return `{ message, token }`
};

// Optionally, export logout or token handling logic here, if needed
export const logoutUser = (): void => {
    localStorage.removeItem("token"); // Example of local storage usage
    window.location.href = "/login";
};

// Get current user's details, if implemented in the backend
export const getCurrentUser = async (): Promise<unknown> => {
    const token = localStorage.getItem("token"); // Assuming you're using JWT
    const response = await axios.get(`${API_URL}/current`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const forgotPasswordUser = async (userData: { email: string }): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, userData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to send forgot password email.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const resetPasswordUser = async (resetData: { token: string, newPassword: string }): Promise<{ message: string }> => {
    console.log("Reset Password Service - Payload:", resetData);

    try {
        const response = await axios.post(`${API_URL}/reset-password`, resetData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Backend Response Error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to reset password.");
        }
        console.error("Unexpected Error:", error);
        throw new Error("An unexpected error occurred.");
    }
};