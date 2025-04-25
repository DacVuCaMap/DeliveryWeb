"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import ProfileHeader from '../home/store/ProfileHeader';
import SelectProfile from './SelectProfile';
import { useUser } from '@/context/userContext';
import { Bike, ChevronLeft, Eye, Heart, History, Inbox, ListRestart, LogOut, MessageSquare, PackageOpen, Rocket, Settings, ShoppingCart, Star, Truck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/utils/api';
import { toast } from 'sonner';
type SelectOption = {
  id: number;
  icon: React.ReactNode | null; // Giả định rằng <Inbox />, <PackageOpen />, v.v. là các React Node
  name: string;
  childTab:any[]
}

type TabItem = {
  id: string;
  selects: SelectOption[];
  label: string;
}
const tempData = {
  slug: "rosemad999",
  coverImageUrl: "/testImg/anhbia1.png", // Thay thế bằng URL ảnh bìa thật
  profileImageUrl: "/images/salexedap.png", // Thay thế bằng URL ảnh đại diện thật
  name: "",
  email: "",
  role: "",
  bio: "Sở thích của tôi là mua sắm và mua sắm :>>>",
  stats: {
    posts: 736,
    followers: "92K",
    following: "34K",
  },
  liveStreams: [
    { id: 1, title: "Xe đạp bk1 ", price: 100000, viewers: "5.8K", thumbnailUrl: "/testImg/biketest.png" },
    { id: 2, title: "Xe đạp mới nhập..", price: 650000, viewers: "2.8K", thumbnailUrl: "/testImg/biketest2.png" },
    { id: 3, title: "Hàng trung quốc", price: 2000000, viewers: "2.1K", thumbnailUrl: "/testImg/biketest3.png" },
    { id: 4, title: "Nội địa BK1", price: 1200000, viewers: "5.1K", thumbnailUrl: "/testImg/biketest4.png" },
    { id: 5, title: "Xe đạp hoàng kim 1", price: 6020000, viewers: "6.1K", thumbnailUrl: "/testImg/testbike5.png" },
    { id: 6, title: "Bike Siêu hot 2025", price: 4400000, viewers: "1.2tr", thumbnailUrl: "/testImg/testbike6.png" },
    { id: 7, title: "Nội địa BK4", price: 900000, viewers: "2K", thumbnailUrl: "/testImg/testbike7.png" },
    // Thêm các stream khác nếu cần
  ],
};
const tabs: TabItem[] = [
  {
    id: 'donmua',
    selects: [
      { id: 0, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <Inbox />, name: "Chờ xác nhận" },
      { id: 1, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <PackageOpen />, name: "Chờ lấy hàng" },
      { id: 2, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <Truck />, name: "Hàng đang giao" },
      { id: 3, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <Star />, name: "Đánh giá" },
    ],
    label: 'Đơn mua'
  },
  {
    id: 'chung',
    selects: [
      { id: 0, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <History />, name: "Lịch sử mua hàng" },
      { id: 1, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <Bike />, name: "Lịch sử ship" },
      { id: 2, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <ListRestart />, name: "Lịch sử COD" },
      { id: 3, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <Heart />, name: "Video đã thích" }
    ],
    label: 'Quản lý chung',
  },
  {
    id: 'tienich',
    selects: [
      { id: 0, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <Zap />, name: "Đơn hàng gần bạn" },
      { id: 1, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: null, name: "Top COD" },
      { id: 2, childTab:["Đơn hàng 1","Đơn hàng 2"],icon: <Rocket />, name: "Shipper gần bạn" },
    ],
    label: 'Tiện ích',
  }
];
export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState<TabItem>(tabs[0]);
  const [profileData, setProfileData] = useState(tempData)
  const { user } = useUser();
  const { logout } = useUser();
  const router = useRouter();
  useEffect(() => {

    if (user) {
      let userRoleBand = "";
      userRoleBand = user.role === "USER" ? "Người dùng" : userRoleBand;
      userRoleBand = user.role === "SHIPPER" ? "Shipper" : userRoleBand;
      userRoleBand = user.role === "PARTNER" ? "Đối tác bán hàng" : userRoleBand;
      setProfileData({ ...profileData, name: user.name, email: user.email, role: userRoleBand })
    }
  }, [user])
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const start1 = Math.max(0, 200 - scrollY);
  const start2 = Math.max(0, 300 - scrollY);

  const dynamicBg = `linear-gradient(180deg, 
          rgba(255, 255, 255, 0) 0px, 
          rgba(16, 24, 40, 0.47) ${start1}px, 
          rgba(16, 24, 40, 0.94) ${start2}px
      )`;

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
    <div className="min-h-screen text-white">
      <div className="relative flex flex-col h-full min-h-screen">
        {/* Background Cover Image */}
        <div className="fixed top-0 left-0 w-full h-screen z-[-2] bg-black" />

        <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
          <Image
            src={profileData.coverImageUrl}
            alt="Cover Photo"
            fill
            className="object-cover opacity-50"
          />
        </div>
        {/* Header Icons (Positioned over cover image) */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
          {/* Giả định có thanh status bar iOS, nên thêm padding top */}
          <button className="text-white">
            <ChevronLeft />
          </button>
          <div className="flex space-x-4">
            <ShoppingCart className="w-4 h-4" />
            <MessageSquare className="w-4 h-4" />
            <Settings className="w-4 h-4" />
          </div>
        </div>
        <div
          className="mt-[180px] flex-1"
          style={{ background: dynamicBg }}>

          <ProfileHeader scrolled={scrolled} data={profileData} />
          <div className={`flex justify-around sticky top-0  ${scrollY > 600 ? "bg-[rgba(16,24,40,0.93)]" : "bg-none"} z-10`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab)}
                className={`py-3 px-2 text-sm font-medium ${selectedTab.id === tab.id
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SelectProfile data={selectedTab  } />
        </div>
        <div className="p-4 bg-black">
          <button onClick={handleLogout} className="outline w-full p-2 rounded-2xl text-gray-400 hover:underline flex flex-row items-center justify-center gap-2 hover:bg-gray-200">
            <LogOut />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

    </div>
  )
}
