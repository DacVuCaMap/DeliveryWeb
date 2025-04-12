"use client"
import React, { useEffect, useRef } from 'react'
import "./FeedScroll.css"
import NewFeed from './NewFeed';
import { ArrowDown, ArrowUp, Shirt } from 'lucide-react';
interface Video {
    id: number;
    username: string;
    avatar: string;
    videoUrl: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    music: string;
    isFollowing: boolean;
    productName: string;
    productPrice: string;
    quantity: number;
    icon: any;
    statusShip:string;
    productExpired:string;
}

export default function FeedScroll() {
    const videos: Video[] = [
        {
            id: 1,
            username: "user1",
            avatar: "/avatar1.jpg",
            videoUrl: "/video/testvid.mp4",
            description: "Video tuyệt vời nhất hôm nay! #tiktok #fun",
            likes: 1200,
            comments: 45,
            shares: 23,
            music: "Original Sound - user1",
            isFollowing: false,
            productName: "Phở bò bát tràng ",
            productPrice: "200.000đ",
            quantity: 21,
            icon: <Shirt className="w-6 h-6" />,
            statusShip:"Giao nhanh",
            productExpired:"2 tiếng"
        },
        {
            id: 2,
            username: "user2",
            avatar: "/avatar1.jpg",
            videoUrl: "/video/test2.mp4",
            description: "Video tuyệt vời nhất hôm nay! #tiktok #fun",
            likes: 1200,
            comments: 45,
            shares: 23,
            music: "Original Sound - user1",
            isFollowing: false,
            productName: "Áo thun cao cấp",
            productPrice: "1.200.000đ",
            quantity: 31,
            icon: <Shirt className="w-6 h-6" />,
            statusShip:"Giao COD",
            productExpired:""
        },
        {
            id: 3,
            username: "user3",
            avatar: "/avatar1.jpg",
            videoUrl: "/video/test3.mp4",
            description: "Video tuyệt vời nhất hôm nay! #tiktok #fun",
            likes: 1200,
            comments: 45,
            shares: 23,
            music: "Original Sound - user1",
            isFollowing: false,
            productName: "Áo 3 lỗ",
            productPrice: "200.000đ",
            quantity: 1,
            icon: <Shirt className="w-6 h-6" />,
            statusShip:"Giao nhanh",
            productExpired:"21 ngày"
        },
    ];
    const scrollRef = useRef<HTMLDivElement>(null);
    const lastTouchY = useRef<number | null>(null);

    const scrollOnePage = (direction: "up" | "down") => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollHeight = window.innerHeight;
        const currentScroll = container.scrollTop;

        container.scrollTo({
            top:
                direction === "down"
                    ? Math.min(currentScroll + scrollHeight, container.scrollHeight - scrollHeight)
                    : Math.max(currentScroll - scrollHeight, 0),
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            lastTouchY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!scrollRef.current || lastTouchY.current === null) return;

            const currentTouchY = e.touches[0].clientY;
            const deltaY = lastTouchY.current - currentTouchY;
            const scrollHeight = window.innerHeight;
            const container = scrollRef.current;
            const currentScroll = container.scrollTop;

            if (deltaY > 0) {
                scrollOnePage("down");
            } else if (deltaY < 0) {
                scrollOnePage("up");
            }

            e.preventDefault();
        };

        const container = scrollRef.current;
        if (container) {
            container.addEventListener("touchstart", handleTouchStart, { passive: false });
            container.addEventListener("touchmove", handleTouchMove, { passive: false });
            return () => {
                container.removeEventListener("touchstart", handleTouchStart);
                container.removeEventListener("touchmove", handleTouchMove);
            };
        }
    }, []);

    return (
        <div className="relative">
            {/* Scrollable video list */}
            <div
                ref={scrollRef}
                className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth scroll-hide"
            >
                {videos.map((video) => (
                    <div className="h-screen snap-start" key={video.id}>
                        <NewFeed video={video} />
                    </div>
                ))}
            </div>

            {/* Nút điều hướng */}
            <div className="absolute hidden right-2 top-1/2 transform -translate-y-1/2 lg:flex flex-col gap-2 z-50">
                <button
                    onClick={() => scrollOnePage("up")}
                    className="bg-black/70 hover:bg-black text-white p-4 rounded-full"
                >
                    <ArrowUp size={20} />
                </button>
                <button
                    onClick={() => scrollOnePage("down")}
                    className="bg-black/70 hover:bg-black text-white p-4 rounded-full"
                >
                    <ArrowDown size={20} />
                </button>
            </div>
        </div>
    );
}