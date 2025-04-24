// app/store/[slug]/components/LiveStreamSection.tsx
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Định nghĩa kiểu dữ liệu cho stream
type Stream = {
    id: number;
    title: string;
    viewers: string;
    thumbnailUrl: string;
    price:number;
};

type Props = {
    streams: Stream[];
};

// Icon mắt xem (Ví dụ)
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1 text-gray-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


export default function LiveStreamSection({ streams }: Props) {
    return (
        <div className="px-4 py-5 pb-20 mt-4">
            <div>
                {/* Stream List (Scrollable Horizontally) */}
                <div className="md:flex md:space-x-4 md:overflow-x-auto md:pb-2 grid sm:grid-cols-3 grid-cols-2 gap-4 custom-scrollbar">
                    {streams.map((stream) => (
                        <Link href={`/videos/${stream.id}`} key={stream.id} className="flex-shrink-0 w-42"> {/* w-36 tương ứng 144px */}
                            <div className="relative aspect-[9/16] w-full bg-black overflow-hidden rounded-md z-0">
                                <Image
                                    src={stream.thumbnailUrl}
                                    alt={stream.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Viewer Count Overlay */}
                                <div className="absolute bottom-1.5 left-1.5 bg-black bg-opacity-60 px-1.5 py-0.5 rounded text-xs flex items-center text-white">
                                    <EyeIcon />
                                    <span className="ml-1">{stream.viewers}</span>
                                </div>
                            </div>
                            <h3 className="text-sm font-medium truncate mt-1">{stream.title}</h3>
                            <div className="flex flex-row text-blue-400 text-xs gap-1">
                                <span className="text-gray-400">Giá:</span>
                                <span>{(stream.price).toLocaleString("vi-VN")} vnd</span>
                            </div>
                        </Link>
                    ))}
                    <div className="flex-shrink-0 w-1"></div>
                </div>
            </div>
        
        </div>
    );
}