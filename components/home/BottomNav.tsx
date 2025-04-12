"use client";

import { Button } from "@/components/ui/button";
import { Home, PlusSquare, User, Video, MessageSquare, MessageCircle, MapPinned, UserRound, Store, MessageSquareText, Plus } from "lucide-react";

export function BottomNav() {
    return (
        <div className="w-full bg-black dark:bg-white dark:text-black text-white flex flex-row justify-center items-center z-50 fixed bottom-0">
            <button className="flex-1 flex flex-col items-center hover:bg-gray-500 py-1">
                <Home className="w-5 h-5" />
                <span className="text-xs">Home</span>
            </button>
            {/* <button className="flex-1 flex flex-col items-center hover:bg-gray-500 py-1" >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">Chat</span>
            </button> */}
            <button className="flex-1 flex flex-col items-center hover:bg-gray-500 py-1" >
                <Store className="w-5 h-5" />
                <span className="text-xs">Cửa hàng</span>
            </button>
            <button className="relative w-[60px] h-[40px] cursor-pointer">
                {/* Background cyan
                <div className="absolute left-0 top-0 w-full h-full rounded-xl bg-cyan-400 -translate-x-1 z-0" />
                {/* Background pink */}
                {/* <div className="absolute right-0 top-0 w-full h-full rounded-xl bg-pink-500 translate-x-1 z-0" /> */}

                {/* Main white button */}
                <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center z-10">
                    <Plus size={20} strokeWidth={3} className="text-black" />
                </div>
            </button>
            <button className="flex-1 flex flex-col items-center hover:bg-gray-500 py-1" >
                <MessageSquareText className="w-5 h-5" />
                <span className="text-xs">Đơn hàng </span>
            </button>
            <button className="flex-1 flex flex-col items-center hover:bg-gray-500 py-1" >
                <UserRound className="w-5 h-5" />
                <span className="text-xs">Hồ sơ </span>
            </button>
        </div>
    );
}