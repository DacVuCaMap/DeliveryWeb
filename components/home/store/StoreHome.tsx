"use client"
import { useEffect, useState } from 'react';
import ContentRow from './ContentRow';
import ContinueWatchingCard from './ContinueWatchingCard';
import MovieCard from './MovieCard';
import SearchStoreBar from './SeachStoreBar';
import TrendingBanner from './TrendingBanner';
import TrendingSliderStore from './TrendingSlideStore';

// Placeholder data (Replace with your actual data fetching)
const trendingItems = [
  {
    id: 1,
    imageUrl: 'https://www.apple.com/v/iphone-16/f/images/meta/iphone-16_overview__fcivqu9d5t6q_og.png?202504170936', // Banner 1 (Ví dụ)
    title: 'iPhone 16 Launch',
    tags: ['Tech', 'Apple', 'Mobile']
  },
  {
    id: 2,
    imageUrl: '/testImg/banner1.png', // Banner 2
    title: 'The Return of the King',
    tags: ['Fantasy', 'Adventure', 'Epic']
  },
  {
    id: 3,
    imageUrl: '/testImg/banner2.png', // Banner 3
    title: 'Cyberpunk City Nights',
    tags: ['Sci-Fi', 'Action', 'Neon']
  },
  {
    id: 4,
    imageUrl: '/testImg/banner3.png', // Banner 4
    title: 'Secrets of the Deep',
    tags: ['Documentary', 'Nature', 'Ocean']
  },
  {
    id: 5,
    imageUrl: '/testImg/banner4.png', // Banner 5 (Astronaut gốc)
    title: 'The White and Gray Evil Killers',
    tags: ['TV Show', 'Thriller', 'Teen']
  },
];
const continueWatchingItems = [
  { id: 1, title: 'Xe đạp bk1', price: 600000, imageUrl: '/testImg/biketest.png' },
  { id: 2, title: 'Review xe đạp GIANT', price: 2300000, imageUrl: '/testImg/biketest2.png' },
  { id: 3, title: 'Xe hot 2025', price: 900000, imageUrl: '/testImg/biketest3.png' },
  { id: 4, title: 'K20 Xe đạp chuẩn cho dân chơi', price: 1900000, imageUrl: '/testImg/biketest4.png' },
  { id: 5, title: 'Xe KVB Sơn tùng hay đi', price: 4200000, imageUrl: '/testImg/testbike5.png' },
];

const movieItems = [
  { id: 1, title: 'Xe đạp BIKE GIANT 1', rating: 4.5, price: 10230000, imageUrl: '/testImg/testbike5.png' },
  { id: 2, title: 'Loa JBL 3 hàng xách tay', rating: 6.9, price: 3200000, imageUrl: '/testImg/jblbanner.png' },
  { id: 3, title: 'Ốp điện thoại IPHONE 16', rating: 7.2, price: 200000, imageUrl: '/testImg/opdienthoai.png' },
  { id: 4, title: ' Quạt trần KL 9', rating: 8.1, price: 5200000, imageUrl: '/testImg/quat.png' },
];

export default function StoreHome() {

  return (
    <main className="bg-black  text-white p-4 pb-10 space-y-8">
      {/* Search Bar */}
      <SearchStoreBar />

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Thịnh hành 🔥</h2>
          {/* Có thể bỏ số trang ở đây vì Swiper có pagination riêng */}
          {/* <span className="text-xs text-gray-400">...</span> */}
        </div>
        {/* Sử dụng TrendingSlider component */}
        <TrendingSliderStore items={trendingItems} />
      </section>


      {/* Continue Watching Section */}
      <ContentRow title="Đã xem gần đây" showSeeAll>
        {continueWatchingItems.map((item) => (
          <ContinueWatchingCard key={item.id} item={item} />
        ))}
      </ContentRow>

      <div className='bg-orange-600 p-4 -mx-4'>
        {/* Movies Section */}
        <ContentRow title="Sản phẩm mới nhất" showSeeAll>
          {movieItems.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </ContentRow>
      </div>
      {/* Movies Section */}
      <ContentRow title="Sản phẩm giao nhanh" showSeeAll>
        {movieItems.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </ContentRow>
      {/* Movies Section */}
      <ContentRow title="Sản phẩm ship COD" showSeeAll>
        {movieItems.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </ContentRow>
    </main>
  );
}