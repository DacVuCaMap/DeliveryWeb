"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, MessageSquare, Settings, Inbox, PackageOpen, Truck, Star, History, Heart, Store } from "lucide-react";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";
type UserInfo = {
  name: string,
  email: string
}
export default function ProfileView() {
  const { user } = useUser();
  const [clientUser, setClientUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setClientUser(user);
  }, [user]);

  return (
    <div className="min-w-sreen flex flex-col gap-4 lg:px-4 py-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={"/signup"} className="outline p-2 rounded-2xl text-gray-600 hover:underline flex flex-row gap-2">
          <Store/>
          <span>Trở thành người bán</span>
        </Link>
        <div className="flex space-x-4">
          <ShoppingCart className="w-6 h-6" />
          <MessageSquare className="w-6 h-6" />
          <Settings className="w-6 h-6" />
        </div>
      </div>

      {/* Profile */}
      <Card className="bg-orange-500">
        <CardContent className="flex items-center space-x-4 py-4 ">
          <div className="bg-gray-300 w-12 h-12 rounded-full overflow-hidden" >
            <Image
              width={50}
              height={50}
              src="/images/user/owner.jpg"
              alt="User"
            />
          </div>

          <div>
            <Link href={"/"} className="flex items-center space-x-2 ">
              <h2 className="font-semibold text-white text-xl hover:underline">{clientUser?.name}</h2>
              <Badge>Người dùng</Badge>
            </Link>
            <p className="text-sm text-gray-100">{clientUser?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Email verification */}
      <div className="text-sm bg-yellow-100 text-yellow-800 p-3 rounded">
        Vui lòng xác minh email của bạn để bảo vệ tài khoản và nhận những cập nhật đơn hàng quan trọng. <span className="text-blue-600">Thiết lập ngay</span>
      </div>

      {/* Đơn mua */}
      <Card>
        <CardContent>
          <h3 className="font-medium mb-4">Đơn mua</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
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

      {/* 15.4 Sale Giữa Tháng */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">15.4 Sale Giữa Tháng</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="bg-yellow-300 text-white font-bold rounded-full w-12 h-12 mx-auto flex items-center justify-center">15.4</div>
              <p className="text-sm mt-1">Trang chính</p>
            </div>
            <div>
              <div className="bg-blue-500 text-white font-bold rounded-full w-12 h-12 mx-auto flex items-center justify-center">⚡</div>
              <p className="text-sm mt-1">Khung Giờ Săn Sale</p>
            </div>
            <div>
              <div className="bg-orange-500 text-white font-bold rounded-full w-12 h-12 mx-auto flex items-center justify-center">TV</div>
              <p className="text-sm mt-1">Live & Video</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Đơn mua */}
      <Card>
        <CardContent>
          <h3 className="font-medium mb-4">Quản lý chung</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
              <History size={30} />
              <span>Lịch sử đơn hàng</span>
            </Link>
            <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
              <Heart size={30} />
              <span>Video đã thích</span>
            </Link>
            <Link href={"/"} className="flex flex-col items-center justify-center gap-2 hover:text-orange-500">
              <Bell size={30} />
              <span>Thông báo</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}