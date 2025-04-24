import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

interface TrendingBannerProps {
  imageUrl: string;
  title: string;
  tags: string[];
}

const TrendingBanner: React.FC<TrendingBannerProps> = ({ imageUrl, title, tags }) => {
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-4 md:p-6 z-20 w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{title}</h1>
        <div className="flex space-x-2 text-xs text-gray-300 mb-4">
          {tags.map((tag, index) => (
            <span key={index}>{tag}{index < tags.length - 1 ? ' ·' : ''}</span>
          ))}
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-2 rounded-full transition duration-200">
            <FaPlay className="mr-2" /> Play
          </button>
          <button className="flex items-center justify-center bg-gray-700/70 hover:bg-gray-600/70 text-white font-semibold px-6 py-2 rounded-full transition duration-200 backdrop-blur-sm">
            <FiPlus className="mr-2" /> My List
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingBanner;