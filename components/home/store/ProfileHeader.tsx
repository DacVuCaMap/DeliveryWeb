// app/store/[slug]/components/ProfileHeader.tsx
"use client"; // Cần thiết nếu có tương tác phía client (như nút Follow/Message)

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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
    scrolled:boolean
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



export default function ProfileHeader({ data,scrolled }: Props) {

    return (
        <div className="bg-none pb-4">
            {/* Header Icons (Positioned over cover image) */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 pt-10 z-10">
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
                <div className={`absolute -top-12 left-0 flex flex-row justify-between items-center w-full pr-4`}>
                    <Image
                        src={data.profileImageUrl}
                        alt={data.name}
                        width={500} // Kích thước lớn hơn một chút
                        height={500}
                        className="rounded-full w-25 h-25 border-4 border-black bg-black" // Thêm border để tách biệt
                    />
                    <div className="flex flex-row gap-2">
                        <AnimatePresence>
                            {scrolled && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex space-x-3 mt-5">
                                        <button className=" flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 transition duration-200">
                                            + Follow
                                        </button>
                                        <button className=" bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-6 transition duration-200">
                                            Message
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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

                <AnimatePresence>
                    {!scrolled && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="flex space-x-3 mt-5">
                                <button className="flex-1 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 transition duration-200">
                                    + Follow
                                </button>
                                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 transition duration-200">
                                    Message
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}