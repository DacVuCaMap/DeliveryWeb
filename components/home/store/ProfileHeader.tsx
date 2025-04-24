// app/store/[slug]/components/ProfileHeader.tsx
"use client"; // Cần thiết nếu có tương tác phía client (như nút Follow/Message)

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu cho props
type ProfileData = {
    coverImageUrl: string;
    profileImageUrl: string;
    name: string;
    handle?: string;
    email?: string;
    role?: string;
    bio: string;
    stats: {
        posts: number;
        followers: string;
        following: string;
    };
};

type Props = {
    data: ProfileData;
    scrolled: boolean
};




export default function ProfileHeader({ data, scrolled }: Props) {

    return (
        <div className="bg-none pb-4">

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
                    {!data.email && (
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
                    )}
                    {data.role && <Badge className="py-2 px-4">{data.role}</Badge>}
                </div>

                {/* Spacer to push content below the profile picture */}
                <div className="h-12"></div> {/* Chiều cao bằng 1/2 chiều cao ảnh profile */}

                {/* User Name and Handle */}
                <div className="mt-2">
                    <h1 className="text-2xl font-bold">{data.name}</h1>
                    <p className="text-sm text-gray-400">{data.handle}</p>
                    <p className="text-sm text-gray-400">{data.email}</p>
                </div>

                {/* Bio */}
                <p className="mt-3 text-sm text-gray-300">{data.bio}</p>

                {!data.email && (
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
                )}
                {!data.email && (
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
                )}
            </div>
        </div>
    );
}