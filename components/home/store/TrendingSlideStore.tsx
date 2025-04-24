// components/TrendingSlider.tsx
'use client';

import React from 'react';
// Core Swiper modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'; // Import các module cần dùng

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // CSS cho mũi tên
import 'swiper/css/pagination'; // CSS cho dấu chấm
import 'swiper/css/effect-fade'; // CSS cho hiệu ứng fade (nếu dùng)

// Import component banner của bạn
import TrendingBanner from './TrendingBanner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho mỗi banner item (nếu chưa có)
interface BannerItem {
  id: number | string;
  imageUrl: string;
  title: string;
  tags: string[];
}

interface TrendingSliderProps {
  items: BannerItem[]; // Nhận mảng các banner items
}

const TrendingSliderStore: React.FC<TrendingSliderProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null; // Không render gì nếu không có items
  }

  return (
    <div className="relative trending-slider-container"> {/* Thêm class để custom CSS nếu cần */}
      <Swiper
        // Cài đặt các module bạn muốn sử dụng
        modules={[Navigation, Pagination, Autoplay, EffectFade]}

        // Cấu hình cơ bản
        spaceBetween={0} // Khoảng cách giữa các slide (0 cho banner đơn)
        slidesPerView={1} // Hiển thị 1 slide mỗi lần

        // Module Navigation (Mũi tên)
        // navigation // Bật mũi tên (có thể truyền object để custom selector)
        navigation={{
          nextEl: '.swiper-button-next-custom', // Selector cho nút next tùy chỉnh
          prevEl: '.swiper-button-prev-custom', // Selector cho nút prev tùy chỉnh
        }}

        // Module Pagination (Dấu chấm)
        pagination={{ clickable: true }} // Bật dấu chấm và cho phép click

        // Module Autoplay
        autoplay={{
          delay: 2000, // Thời gian chuyển slide (ms)
          disableOnInteraction: false, // Không tắt autoplay khi người dùng tương tác
          pauseOnMouseEnter: true, // Tạm dừng khi rê chuột vào (tùy chọn)
        }}

        // Module EffectFade (Hiệu ứng mờ dần) - tùy chọn
         effect="fade"
         fadeEffect={{ crossFade: true }} // Cho hiệu ứng mờ chồng mượt hơn

        // Các cấu hình khác
        loop={true} // Lặp vô hạn
        className="mySwiper" // Class tùy chỉnh cho Swiper container
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            {/* Render component banner của bạn bên trong mỗi slide */}
            <TrendingBanner
              imageUrl={item.imageUrl}
              title={item.title}
              tags={item.tags}
            />
          </SwiperSlide>
        ))}

        {/* Optional: Custom Navigation Buttons nếu không dùng mặc định */}
         <button className="swiper-button-prev-custom absolute top-1/2 left-4 z-10 cursor-pointer p-2 bg-black/30 rounded-full text-white"><ChevronLeft /></button>
         <button className="swiper-button-next-custom absolute top-1/2 right-4 z-10 cursor-pointer p-2 bg-black/30 rounded-full text-white"><ChevronRight /></button>
      </Swiper>
    </div>
  );
};

export default TrendingSliderStore;