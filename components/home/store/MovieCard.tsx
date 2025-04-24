import Image from 'next/image';
import { FaStar, FaRegHeart } from 'react-icons/fa'; // Or FaHeart for filled

interface MovieItem {
  id: number | string;
  title: string;
  rating: number;
  price: number;
  imageUrl: string;
}

interface MovieCardProps {
  item: MovieItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  return (
    <div className="flex-shrink-0 w-36 sm:w-40 space-y-2">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden group">
        <Image
          src={item.imageUrl}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center">
          <FaStar className="text-yellow-400 mr-1" />
          <span>{item.rating.toFixed(1)}</span>
        </div>
        {/* Favorite Button */}
        <button className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-white hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <FaRegHeart size={14} />
        </button>
      </div>
      <h3 className="text-sm font-semibold truncate">{item.title}</h3>
      <p className="text-xs text-gray-400">{(item.price).toLocaleString("vi-VN")} vnd</p>
    </div>
  );
};

export default MovieCard;