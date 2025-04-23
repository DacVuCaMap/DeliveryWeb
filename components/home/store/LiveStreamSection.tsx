// app/store/[slug]/components/LiveStreamSection.tsx
import Image from "next/image";
import React from "react";

// Định nghĩa kiểu dữ liệu cho stream
type Stream = {
    id: number;
    title: string;
    viewers: string;
    thumbnailUrl: string;
};

type Props = {
    streams: Stream[];
};

// Icon mắt xem (Ví dụ)
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1 text-gray-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


export default function LiveStreamSection({ streams }: Props) {
    return (
        <div className="px-4 py-5">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Live Stream</h2>
                <a href="#" className="text-sm text-gray-400 hover:text-gray-200">
                    See all &gt;
                </a>
            </div>

            {/* Stream List (Scrollable Horizontally) */}
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {/* --- Scrollbar Hide (Cài đặt Tailwind plugin nếu cần) ---
                    Để ẩn thanh cuộn một cách nhất quán, bạn có thể cần plugin:
                    1. npm install -D tailwind-scrollbar-hide
                    2. Thêm vào `tailwind.config.js`:
                       plugins: [
                         require('tailwind-scrollbar-hide')
                       ]
                    Nếu không muốn cài plugin, trình duyệt vẫn hiển thị thanh cuộn mặc định.
                 */}
                {streams.map((stream) => (
                    <div key={stream.id} className="flex-shrink-0 w-40"> {/* Đặt chiều rộng cố định cho card */}
                        <div className="relative mb-1.5">
                            <Image
                                src={stream.thumbnailUrl}
                                alt={stream.title}
                                width={160} // Tương ứng với w-40
                                height={90} // Tỷ lệ 16:9
                                className="rounded-md object-cover"
                            />
                            {/* Viewer Count Overlay */}
                            <div className="absolute bottom-1.5 left-1.5 bg-black bg-opacity-60 px-1.5 py-0.5 rounded text-xs flex items-center">
                                <EyeIcon />
                                <span>{stream.viewers}</span>
                            </div>
                        </div>
                        <h3 className="text-sm font-medium truncate">{stream.title}</h3>
                    </div>
                ))}
                 {/* Thêm một phần tử trống để tạo khoảng trống cuối cùng nếu cần */}
                 <div className="flex-shrink-0 w-1"></div>
            </div>
        </div>
    );
}