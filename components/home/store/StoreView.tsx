"use client"
import React, { useEffect, useState } from "react";
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
        { id: 1, title: "Xe đạp bk1 ",price:100000, viewers: "5.8K", thumbnailUrl: "/testImg/biketest.png" },
        { id: 2, title: "Xe đạp mới nhập..",price:650000, viewers: "2.8K", thumbnailUrl: "/testImg/biketest2.png" },
        { id: 3, title: "Hàng trung quốc",price:2000000, viewers: "2.1K", thumbnailUrl: "/testImg/biketest3.png" },
        { id: 4, title: "Nội địa BK1",price:1200000, viewers: "5.1K", thumbnailUrl: "/testImg/biketest4.png" },
        { id: 5, title: "Xe đạp hoàng kim 1",price:6020000, viewers: "6.1K", thumbnailUrl: "/testImg/testbike5.png" },
        { id: 6, title: "Bike Siêu hot 2025",price:4400000, viewers: "1.2tr", thumbnailUrl: "/testImg/testbike6.png" },
        { id: 7, title: "Nội địa BK4",price:900000, viewers: "2K", thumbnailUrl: "/testImg/testbike7.png" },
        // Thêm các stream khác nếu cần
    ],
};


export default function StoreViewPage(props: Props) {
    const [selectedTab, setSelectedTab] = useState('all');
    const [scrollY, setScrollY] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setScrollY(y);
            setScrolled(y > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const start1 = Math.max(0, 200 - scrollY);
    const start2 = Math.max(0, 300 - scrollY);

    const dynamicBg = `linear-gradient(180deg, 
        rgba(255, 255, 255, 0) 0px, 
        rgba(16, 24, 40, 0.47) ${start1}px, 
        rgba(16, 24, 40, 0.94) ${start2}px
    )`;

    const tabs = [
        { id: 'all', label: 'Tất cả sản phẩm' },
        { id: 'fast', label: 'Ship nhanh' },
        { id: 'cod', label: 'Sản phẩm COD' },
    ];
    return (
        <div className="min-h-screen text-white">
            <div className="relative flex flex-col  h-full">
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


                <div
                    className="mt-[300px]"
                    style={{ background: dynamicBg }}>

                    <ProfileHeader scrolled={scrolled} data={storeData} />
                    {/* Tab selection bar */}
                    <div className={`flex justify-around sticky top-0  ${scrollY>600 ? "bg-[rgba(16,24,40,0.93)]" : "bg-none" } z-10`}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`py-3 px-2 text-sm font-medium ${selectedTab === tab.id
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-gray-400'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <LiveStreamSection streams={storeData.liveStreams} />
                </div>

            </div>

        </div>
    );
}