
import ContentRow from './ContentRow';
import ContinueWatchingCard from './ContinueWatchingCard';
import MovieCard from './MovieCard';
import SearchStoreBar from './SeachStoreBar';
import TrendingBanner from './TrendingBanner';

// Placeholder data (Replace with your actual data fetching)
const continueWatchingItems = [
  { id: 1, title: 'Xe đạp bk1', price: 600000, imageUrl: '/testImg/biketest.png' },
  { id: 2, title: 'Review xe đạp GIANT', price: 2300000, imageUrl: '/testImg/biketest2.png' },
  { id: 3, title: 'Xe hot 2025', price: 900000, imageUrl: '/testImg/biketest3.png' },
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

      {/* Now Trending Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Thịnh hành 🔥</h2>
          <span className="text-xs text-gray-400">1/5</span>
        </div>
        <TrendingBanner
          imageUrl="https://www.apple.com/v/iphone-16/f/images/meta/iphone-16_overview__fcivqu9d5t6q_og.png?202504170936" // Replace with your astronaut image
          title="The White and Gray Evil Killers"
          tags={['TV Show', 'Thriller', 'Teen']}
        />
      </section>

      {/* Continue Watching Section */}
      <ContentRow title="Đã xem gần đây" showSeeAll>
        {continueWatchingItems.map((item) => (
          <ContinueWatchingCard key={item.id} item={item} />
        ))}
      </ContentRow>

      {/* Movies Section */}
      <ContentRow title="Short videos" showSeeAll>
        {movieItems.map((item) => (
          <MovieCard key={item.id} item={item} /> 
        ))}
      </ContentRow>
    </main>
  );
}