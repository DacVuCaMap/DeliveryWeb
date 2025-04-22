"use client"
import Image from "next/image";
import React from "react";

type Props = {
    slug: string;
};

export default function StoreView(props: Props) {
    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-orange-500 flex flex-col">
                <div className="bg-orange-500 text-white px-6 py-4 flex items-center space-x-4">
                    <Image
                        src="/images/salexedap.png"
                        height={500}
                        width={500}
                        alt="avatar"
                        className="w-20 h-20 rounded-full border-2 border-white"
                    />
                    <div>
                        <h1 className="text-xl font-bold">Cua hang Xe Dap</h1>
                        <p className="text-sm">Kiến Thức Thú Vị</p>
                    </div>


                </div>
                {/* Info */}
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                        Kênh mình chủ yếu chia sẻ những đoạn phim hay nhé
                    </p>
                    <div className="flex space-x-6 mt-2 text-sm text-gray-800">
                        <span>145.2K Followers</span>
                        <span>2.1M Likes</span>
                    </div>
                </div>
            </div>

            {/* Playlist section */}
            <div className="px-6">
                <h2 className="text-lg font-semibold mb-2">Danh sách phát</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    <div className="w-40 h-24 bg-gray-200 rounded shadow-sm flex items-center justify-center text-center text-xs font-medium">
                        Người ẩn danh
                    </div>
                    <div className="w-40 h-24 bg-gray-200 rounded shadow-sm flex items-center justify-center text-center text-xs font-medium">
                        Hương vị tuyệt vời
                    </div>
                </div>
            </div>

            {/* Video grid */}
            <div className="px-6 mt-6">
                <h2 className="text-lg font-semibold mb-2">Video</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded overflow-hidden shadow-sm">
                            <div className="h-40 bg-gray-300"></div>
                            <div className="p-2 text-xs text-gray-700">Video {i + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
