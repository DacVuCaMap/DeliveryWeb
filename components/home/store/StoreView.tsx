"use client"
import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import LiveStreamSection from "./LiveStreamSection";
import './StoreView.css'
import Image from "next/image";
import { cn } from "@/lib/utils";
type Props = {
    slug: string // Lấy slug từ URL trong App Router
};

// Dữ liệu mẫu - Thay thế bằng dữ liệu thực tế từ API hoặc nguồn khác
const storeData = {
    slug: "rosemad999",
    coverImageUrl: "/testImg/headstore.png", // Thay thế bằng URL ảnh bìa thật
    profileImageUrl: "/images/salexedap.png", // Thay thế bằng URL ảnh đại diện thật
    name: "Shop xe đạp",
    handle: "@xedapvip",
    bio: "Gamers who are very active in the world of war with extraordinary intelligence are unmatched.",
    stats: {
        posts: 736,
        followers: "92K",
        following: "34K",
    },
    liveStreams: [
        { id: 1, title: "Xe đạp bk1 ", viewers: "5.8K", thumbnailUrl: "/testImg/biketest.png" },
        { id: 2, title: "Xe đạp mới nhập..", viewers: "2.8K", thumbnailUrl: "/testImg/biketest2.png" },
        { id: 3, title: "Hàng trung quốc", viewers: "2.1K", thumbnailUrl: "/testImg/biketest3.png" },
        // Thêm các stream khác nếu cần
    ],
};


export default function StoreViewPage(props: Props) {

    return (
        <div className="min-h-screen text-white">
            <div className="relative flex flex-col justify-end h-full pb-10">
                {/* Background Cover Image */}
                <div className="fixed top-0 left-0 w-full h-screen z-[-2] bg-black" />

                <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
                    <Image
                        src={storeData.coverImageUrl}
                        alt="Cover Photo"
                        fill
                        className="object-cover opacity-50"
                    />
                </div>


                <div className="mt-[300px] bg-content">

                    <ProfileHeader data={storeData} />
                    <LiveStreamSection streams={storeData.liveStreams} />
                </div>

            </div>

        </div>
    );
}