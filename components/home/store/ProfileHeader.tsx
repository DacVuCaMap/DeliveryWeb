// app/store/[slug]/components/ProfileHeader.tsx
"use client"; // Cần thiết nếu có tương tác phía client (như nút Follow/Message)

import Image from "next/image";
import React from "react";

// Định nghĩa kiểu dữ liệu cho props
type ProfileData = {
    coverImageUrl: string;
    profileImageUrl: string;
    name: string;
    handle: string;
    bio: string;
    stats: {
        posts: number;
        followers: string;
        following: string;
    };
};

type Props = {
    data: ProfileData;
};

// SVG Icons (Ví dụ đơn giản, nên dùng thư viện icon)
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const MoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);


export default function ProfileHeader({ data }: Props) {
    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 w-full">
                <Image
                    src={data.coverImageUrl}
                    alt="Cover Photo"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-50" // Điều chỉnh độ mờ nếu cần
                />
                {/* Lớp phủ gradient hoặc màu tối để text dễ đọc hơn */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            </div>

            {/* Header Icons (Positioned over cover image) */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 pt-10 md:pt-4 z-10">
                 {/* Giả định có thanh status bar iOS, nên thêm padding top */}
                <button className="text-white">
                    <BackIcon />
                </button>
                <button className="text-white">
                    <MoreIcon />
                </button>
            </div>

            {/* Profile Info Container */}
            <div className="relative px-4 pb-4 z-0">
                {/* Profile Picture (Overlapping) */}
                <div className="absolute -top-12 left-4">
                    <Image
                        src={data.profileImageUrl}
                        alt={data.name}
                        width={500} // Kích thước lớn hơn một chút
                        height={500}
                        className="rounded-full w-25 h-25 border-4 border-black bg-black" // Thêm border để tách biệt
                    />
                </div>

                {/* Spacer to push content below the profile picture */}
                <div className="h-12"></div> {/* Chiều cao bằng 1/2 chiều cao ảnh profile */}

                {/* User Name and Handle */}
                <div className="mt-2">
                    <h1 className="text-2xl font-bold">{data.name}</h1>
                    <p className="text-sm text-gray-400">{data.handle}</p>
                </div>

                {/* Bio */}
                <p className="mt-3 text-sm text-gray-300">{data.bio}</p>

                {/* Stats */}
                <div className="flex space-x-6 mt-4">
                    <div>
                        <span className="font-bold">{data.stats.posts}</span>
                        <span className="text-gray-400 ml-1 text-sm">Video</span>
                    </div>
                    <div>
                        <span className="font-bold">{data.stats.followers}</span>
                        <span className="text-gray-400 ml-1 text-sm">Followers</span>
                    </div>
                    <div>
                        <span className="font-bold">{data.stats.following}</span>
                        <span className="text-gray-400 ml-1 text-sm">Following</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-5">
                    <button className="flex-1 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 transition duration-200">
                       <PlusIcon /> Follow
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 transition duration-200">
                        Message
                    </button>
                </div>
            </div>
        </div>
    );
}