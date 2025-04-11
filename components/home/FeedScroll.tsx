"use client"
import React, { useEffect, useRef } from 'react'
import "./FeedScroll.css"
import NewFeed from './NewFeed';
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
        },
    ];
    console.log(videos)
    const scrollRef = useRef<HTMLDivElement>(null);
    const lastTouchY = useRef<number | null>(null);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            lastTouchY.current = e.touches[0].clientY; // Lưu vị trí bắt đầu vuốt
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!scrollRef.current || lastTouchY.current === null) return;

            const currentTouchY = e.touches[0].clientY;
            const deltaY = lastTouchY.current - currentTouchY; // Khoảng cách vuốt
            const scrollHeight = window.innerHeight; // Chiều cao 1 video
            const container = scrollRef.current;
            const currentScroll = container.scrollTop;

            // Xác định hướng vuốt và chỉ cho phép scroll 1 video
            if (deltaY > 0) {
                // Vuốt lên -> scroll xuống 1 video
                container.scrollTo({
                    top: Math.min(currentScroll + scrollHeight, container.scrollHeight - scrollHeight),
                    behavior: "smooth",
                });
            } else if (deltaY < 0) {
                // Vuốt xuống -> scroll lên 1 video
                container.scrollTo({
                    top: Math.max(currentScroll - scrollHeight, 0),
                    behavior: "smooth",
                });
            }

            // Ngăn scroll mặc định để kiểm soát hoàn toàn
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
    );
}