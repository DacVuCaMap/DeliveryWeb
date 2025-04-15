'use client'; // Thêm dòng này nếu bạn đang sử dụng Next.js App Router

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserInfo {
    name: string;
    avt: string;
    role: string;
    email:string;
}

interface UserContextType {
    user: UserInfo | null;
    setUser: (user: UserInfo | null) => void;
    logout: () => void;
}

// Tạo context với giá trị mặc định
const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    logout: () => { },
});

// Sử dụng React.FC để khai báo kiểu component rõ ràng
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(() => {
        // Chỉ chạy localStorage ở phía client
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('userInfo') || 'null');
        }
        return null;
    });

    // Cập nhật localStorage khi user thay đổi
    const updateUser = (newUser: UserInfo | null) => {
        setUser(newUser);
        if (typeof window !== 'undefined') {
            localStorage.setItem('userInfo', JSON.stringify(newUser));
        }
    };
    // Hàm đăng xuất
    const logout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userInfo');
        }
    };

    // Đảm bảo trả về JSX element
    return (
        <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};


// Export hook để sử dụng context này
export const useUser = () => useContext(UserContext);