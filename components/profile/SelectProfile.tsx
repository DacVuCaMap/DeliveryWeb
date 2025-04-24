"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, MessageSquare, Settings, Inbox, PackageOpen, Truck, Star, History, Heart, Store, ListRestart, Bike, LogOut, Zap, Package2, Rocket } from "lucide-react";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";
import { logoutUser } from "@/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function SelectProfile() {
    const { logout } = useUser();
    const router = useRouter();
    const handleLogout = async () => {
        const response = await logoutUser();
        console.log(response);
        if (response && response.success) {
            logout();
            // Hiển thị thông báo thành công
            toast.success('Đã đăng xuất thành công');
            // Chuyển hướng về trang đăng nhập
            router.push('/signin');
        }
        else {
            toast.error('Đăng xuất thất bại');
        }
    }
    return (
        <div className="">

            {/* Đơn mua */}
            <Card className="rounded-none bg-black/10 border-none text-white">
                <CardContent>
                    <h3 className="font-medium mb-4">Đơn mua</h3>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs ">
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <Inbox size={30} />
                            <span>Chờ xác nhận</span>
                        </Link>
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <PackageOpen size={30} />
                            <span>Chờ lấy hàng</span>
                        </Link>
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <Truck size={30} />
                            <span>Hàng đang giao</span>
                        </Link>
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <Star size={30} />
                            <span>Đánh giá</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>


            {/* Đơn mua */}
            <Card className="rounded-none bg-black/10 border-none text-white">
                <CardContent>
                    <h3 className="font-medium mb-4">Quản lý chung</h3>
                    <div className="grid grid-cols-4 gap-2 text-center text-sm">
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <History size={30} />
                            <span>Lịch sử mua hàng</span>
                        </Link>
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <Bike size={30} />
                            <span>Lịch sử ship</span>
                        </Link>
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <ListRestart size={30} />
                            <span>Lịch sử COD</span>
                        </Link>
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <Heart size={30} />
                            <span>Video đã thích</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* 15.4 Sale Giữa Tháng */}
            <Card className="rounded-none bg-black/10 border-none text-white">
                <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Tiện ích</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <Zap size={30} />
                            <span>Đơn hàng gần bạn</span>
                        </Link>
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <span className="text-xl font-bold">COD</span>
                            <span>Top COD</span>
                        </Link>
                        <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
                            <Rocket size={30} />
                            <span>Shipper gần bạn</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 mb-6">
                <button onClick={handleLogout} className="outline w-full p-2 rounded-2xl text-gray-400 hover:underline flex flex-row items-center justify-center gap-2 hover:bg-gray-200">
                    <LogOut />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    )
}
