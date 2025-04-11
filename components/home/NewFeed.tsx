"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Heart, MessageCircle, Music, Plus, Share2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
export default function NewFeed({ video }: { video: Video }) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            if (!scrollRef.current) return;

            const container = scrollRef.current;
            const scrollHeight = window.innerHeight; // Chiều cao 1 video
            const currentScroll = container.scrollTop;
            const targetScroll = Math.round(currentScroll / scrollHeight) * scrollHeight;

            // Giới hạn scroll khi vuốt mạnh
            container.scrollTo({
                top: targetScroll,
                behavior: "auto", // Dùng "auto" thay "smooth" để phản hồi nhanh hơn trên mobile
            });
        };

        const container = scrollRef.current;
        if (container) {
            container.addEventListener("touchend", handleTouchMove);
            return () => container.removeEventListener("touchend", handleTouchMove);
        }
    }, []);
    return (
        <div className="flex justify-center">
            <div className="w-full lg:w-1/4 aspect-[9/16] relative overflow-hidden lg:rounded-lg shadow-lg bg-black">
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className="w-full h-full object-cover absolute top-0 left-0"
                    loop
                    autoPlay
                    muted
                    playsInline
                    onClick={togglePlay}
                />

                {/* Left overlay - User info */}
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={video.avatar} />
                            <AvatarFallback>{video.username[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold">{video.username}</span>
                        {!video.isFollowing && (
                            <Button size="sm" className="ml-2 bg-red-600 hover:bg-red-700">
                                <Plus className="w-4 h-4 mr-1" /> Follow
                            </Button>
                        )}
                    </div>
                    <p className="mt-2 text-sm line-clamp-2">{video.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                        <Music className="w-4 h-4" />
                        <span className="truncate">{video.music}</span>
                    </div>
                </div>

                {/* Right actions */}
                <div className="absolute right-2 bottom-8 -translate-y-1/2 flex flex-col gap-6 text-white z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex flex-col items-center"
                        onClick={() => setIsLiked(!isLiked)}
                    >
                        <Heart className={`w-8 h-8 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="text-xs mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="flex flex-col items-center">
                        <MessageCircle className="w-8 h-8" />
                        <span className="text-xs mt-1">{video.comments}</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="flex flex-col items-center">
                        <Share2 className="w-8 h-8" />
                        <span className="text-xs mt-1">{video.shares}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
