
import axios from "axios";

// Tạo một instance của axios để tái sử dụng
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Ví dụ: "http://localhost:8080"
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Đặt ở đây, không trong headers
});

export const registerUser = async (formData: any) => {
    try {
        const response = await api.post("api/auth/register", formData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi đăng ký:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const postData = { email: email, password: password }
        const response = await api.post("api/auth/login", postData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi đăng nhập:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
};