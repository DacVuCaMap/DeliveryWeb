"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Box, Check, Heart, MessageCircle, Music, Plus, Share2, Shirt } from 'lucide-react';
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
    productName: string;
    productPrice: string;
    quantity: number;
    statusShip: string;
    productExpired: string;
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
            <div className="w-full h-screen lg:h-full lg:w-1/4 aspect-[9/16] relative overflow-hidden lg:rounded-lg shadow-lg bg-black">
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
                <div className="absolute lg:block hidden bottom-6 left-4 right-4 text-white z-10">
                    <button className='flex flex-row bg-green-500/40 px-2 py-2 rounded-lg mb-2 text-xs'>
                        <Check className='w-4 h-4 mr-1' />
                        <span>{video.statusShip}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={video.avatar} />
                            <AvatarFallback>{video.username[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold">{video.username}</span>
                        {/* {!video.isFollowing && (
                            <Button size="sm" className="ml-2 bg-orange-500 hover:bg-orange-700 text-white">
                                <Plus className="w-4 h-4 mr-1" /> Follow
                            </Button>
                        )} */}
                    </div>
                    {/* <p className="mt-2 text-sm line-clamp-2">{video.description}</p> */}
                    {/* <div className="flex items-center gap-2 mt-1 text-sm">
                        <Music className="w-4 h-4" />
                        <span className="truncate">{video.music}</span>
                    </div> */}
                    <div className="flex items-center gap-2 mt-1">
                        <span className="truncate text-lg">{video.productName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm font-bold">
                        <span className="truncate">{video.productPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-200">
                        <span className="truncate">Số lượng: {video.quantity}</span>
                    </div>
                    {video.productExpired && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-200">
                            <span className="truncate">Thời gian bán sản phẩm: {video.productExpired}</span>
                        </div>
                    )}
                    <div className='flex items-center justify-center mt-2'>
                        <button className='bg-orange-500 px-4 py-2 rounded-lg'>
                            Mua hàng
                        </button>
                    </div>
                </div>
                {/* Right actions */}
                <div className="absolute hidden right-2 bottom-32 lg:flex flex-col gap-4 text-white z-10">
                    <div className='flex flex-col items-center space-y-1'>
                        <button
                            className="flex flex-col items-center rounded-full p-4 bg-gray-600/40 backdrop-blur-md shadow-md transition"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />

                        </button>
                        <span className="text-xs mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                    </div>
                    <div className='flex flex-col items-center space-y-1'>
                        <button
                            className="flex flex-col items-center rounded-full p-4 bg-gray-600/40 backdrop-blur-md shadow-md transition"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <MessageCircle className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />

                        </button>
                        <span className="text-xs mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                    </div>
                    <div className='flex flex-col items-center space-y-1'>
                        <button
                            className="flex flex-col items-center rounded-full p-4 bg-gray-600/40 backdrop-blur-md shadow-md transition"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <Share2 className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />

                        </button>
                        <span className="text-xs mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                    </div>
                </div>
            </div>

            {/* for phone */}
            <div className='fixed lg:hidden h-screen w-screen'>
                {/* Left overlay - User info */}
                <div className="absolute bottom-12 left-4 right-4 text-white z-10">
                    <button className='flex flex-row bg-green-500/40 px-2 py-2 rounded-lg mb-2 text-xs'>
                        <Check className='w-4 h-4 mr-1' />
                        <span>{video.statusShip}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={video.avatar} />
                            <AvatarFallback>{video.username[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold">{video.username}</span>
                        {/* {!video.isFollowing && (
                            <Button size="sm" className="ml-2 bg-orange-500 hover:bg-orange-700 text-white">
                                <Plus className="w-4 h-4 mr-1" /> Follow
                            </Button>
                        )} */}
                    </div>
                    {/* <p className="mt-2 text-sm line-clamp-2">{video.description}</p> */}
                    {/* <div className="flex items-center gap-2 mt-1 text-sm">
                        <Music className="w-4 h-4" />
                        <span className="truncate">{video.music}</span>
                    </div> */}
                    <div className="flex items-center gap-2 mt-1">
                        <span className="truncate text-lg">{video.productName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm font-bold">
                        <span className="truncate">{video.productPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-200">
                        <span className="truncate">Số lượng: {video.quantity}</span>
                    </div>
                    {video.productExpired && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-200">
                            <span className="truncate">Thời gian bán sản phẩm: {video.productExpired}</span>
                        </div>
                    )}
                    <div className='flex items-center justify-center mt-2'>
                        <button className='bg-orange-500 px-4 py-2 rounded-lg'>
                            Mua hàng
                        </button>
                    </div>
                </div>
                {/* Right actions */}
                <div className="absolute right-2 bottom-32 flex flex-col gap-4 text-white z-10">
                    <div className='flex flex-col items-center space-y-1'>
                        <button
                            className="flex flex-col items-center rounded-full p-4 bg-gray-600/40 backdrop-blur-md shadow-md transition"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />

                        </button>
                        <span className="text-xs mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                    </div>
                    <div className='flex flex-col items-center space-y-1'>
                        <button
                            className="flex flex-col items-center rounded-full p-4 bg-gray-600/40 backdrop-blur-md shadow-md transition"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <MessageCircle className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />

                        </button>
                        <span className="text-xs mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                    </div>
                    <div className='flex flex-col items-center space-y-1'>
                        <button
                            className="flex flex-col items-center rounded-full p-4 bg-gray-600/40 backdrop-blur-md shadow-md transition"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <Share2 className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />

                        </button>
                        <span className="text-xs mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
