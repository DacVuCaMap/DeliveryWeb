"use client";

import { Button } from "@/components/ui/button";
import { Home, PlusSquare, User, Video, MessageSquare, MessageCircle, MapPinned, UserRound } from "lucide-react";

export function BottomNav() {
    return (
        <div className="w-full bg-orange-400 text-white flex flex-row justify-center items-center z-50 py-1 fixed bottom-0">
            <button className="flex-1 flex flex-col items-center text-white hover:bg-orange-600">
                <Home className="w-5 h-5" />
                <span className="text-xs">Trang chủ</span>
            </button>
            {/* <button className="flex-1 flex flex-col items-center text-white hover:bg-orange-600" >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">Chat</span>
            </button> */}
            <button className="flex-1 flex flex-col items-center text-white hover:bg-orange-600" >
                <MapPinned className="w-5 h-5" />
                <span className="text-xs">Map</span>
            </button>
            <button className="flex-1 flex flex-col items-center text-white hover:bg-orange-600" >
                <UserRound className="w-5 h-5" />
                <span className="text-xs">Hồ sơ </span>
            </button>
        </div>
    );
}