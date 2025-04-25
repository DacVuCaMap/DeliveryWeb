
import axios from "axios";
import { toast } from "sonner";

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

//acitve
export const activeUser = async (email: string, code: string) => {
    try {
        const response = await api.get(`api/auth/active?email=${email}&code=${code}`);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi active:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}

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

export const logoutUser = async () => {
    try {
        const response = await api.post("api/auth/logout");
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi đăng nhập:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}

/// get near shipper
export const getNearShipper = async (lat: number, lng: number, status: number) => {
    try {
        const response = await api.get(`/api/location/shipper-locations/near?lat=${lat}&lng=${lng}&status=${status}`);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi get near shipper:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}

export const updateShipperLocation = async (postData: any) => {
    try {
        const response = await api.post(`/api/location/shipper-locations/update`, postData);
        return response.data;
    } catch (error: any) {
        toast.error("Lỗi server")
        console.error("Lỗi khi update shipper location:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}


/// vietmap from be
export const apiFetchStyleVietMap = async () => {
    try {
        const response = await api.get(`/api/vietmap/style`);

        return response;
    } catch (error: any) {
        toast.error("Lỗi server")
        console.error("Lỗi khi lỗi khi route:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}
/// vietmap from be
export const fetchRouteVietMap = async (start: string, end: string) => {
    console.log(`/api/vietmap/route?start=${start}&end=${end}`)
    try {
        const response = await api.get(`/api/vietmap/route?start=${start}&end=${end}`)

        return response;
    } catch (error: any) {
        toast.error("Lỗi server")
        console.error("Lỗi khi lỗi khi route:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}
/// vietmap from be
export const fetchPlaceVietMap = async (refId: string) => {
    try {
        const response = await api.get(`/api/vietmap/place?refId=${refId}`)
        return response;
    } catch (error: any) {
        toast.error("Lỗi server")
        console.error("Lỗi khi place:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}
export const fetchAutoCompleteVietMap = async (text: string, lat?: number, lng?: number) => {
    try {
        const response = await api.get(`/api/vietmap/autocomplete?text=${text}&lat=${lat}&lng=${lng}`)
        return response;
    } catch (error: any) {
        toast.error("Lỗi server")
        console.error("Lỗi khi autocomplete:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}
//near store
export const apiNearStore = async (lat: number, lng: number, status: number) => {
    try {
        const response = await api.get(`/api/location/store-location/near?lat=${lat}&lng=${lng}&status=${status}`)
        return response.data;
    } catch (error: any) {
        toast.error("Lỗi server")
        console.error("Lỗi khi near store:", error);
        throw error.response?.data || "Lỗi không xác định";
    }
}