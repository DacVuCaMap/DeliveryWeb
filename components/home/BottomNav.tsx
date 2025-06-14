"use client";

import { Button } from "@/components/ui/button";
import { Home, PlusSquare, User, Video, MessageSquare, MessageCircle, MapPinned, UserRound, Store, MessageSquareText, Plus, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CameraRecordButton from "./CameraRecordButton";

export function BottomNav() {
    const router = useRouter();
    const path = usePathname();
    const rootPath = "/" + path.split('/')[1];
    return (
        <div className="w-full bg-black dark:bg-white dark:text-black text-white flex flex-row justify-center items-center z-10 fixed bottom-0">
            <Link href={"/home"} className={`flex-1 flex flex-col items-center hover:bg-orange-500 hover:text-white py-1 ${rootPath === "/home" && "text-orange-400"}`}>
                <Home className="w-5 h-5" strokeWidth={3} />
                <span className="text-xs">Home</span>
            </Link>
            <Link href={"/shipper"} className={`flex-1 flex flex-col items-center hover:bg-orange-500 hover:text-white py-1 ${rootPath === "/shipper" && "text-orange-400"}`} >
                <Truck className="w-5 h-5" strokeWidth={3} />
                <span className="text-xs">Shipper </span>
            </Link>
            {/* <button onClick={handleOpenCamera} className="relative w-[60px] h-[40px] cursor-pointer mx-2">
                <div className="absolute inset-0 bg-orange-500 text-white rounded-xl flex items-center justify-center z-10 hover:bg-orange-600 ">
                    <Plus size={20} strokeWidth={3} />
                </div>
            </button> */}
            <div className="relative w-[60px] h-[40px] cursor-pointer mx-2">
                <CameraRecordButton />
            </div>
            <Link href={"/store"} className={`flex-1 flex flex-col items-center hover:bg-orange-500 hover:text-white py-1 ${rootPath === "/store" && "text-orange-400"}`} >
                <Store className="w-5 h-5" strokeWidth={3} />
                <span className="text-xs">Cửa hàng</span>
            </Link>
            <Link href={"/profile"} className={`flex-1 flex flex-col items-center hover:bg-orange-500 hover:text-white py-1 ${rootPath === "/profile" && "text-orange-400"}`} >
                <UserRound className="w-5 h-5" strokeWidth={3} />
                <span className="text-xs">Hồ sơ </span>
            </Link>
        </div>
    );
}