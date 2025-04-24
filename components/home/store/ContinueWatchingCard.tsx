import Image from 'next/image';

interface ContinueWatchingItem {
  id: number | string;
  title: string;
  price: number;
  imageUrl: string;
}

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
}

const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({ item }) => {
  return (
    <div className="flex-shrink-0 w-60 sm:w-72 space-y-2 group">
        <div className="relative aspect-video rounded-lg overflow-hidden">
             {/* You might want a progress bar overlay here */}
            <Image
                src={item.imageUrl}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                 className="transition-transform duration-300 group-hover:scale-105"
            />
             {/* Optional: Play icon overlay on hover */}
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 {/* <FaPlayCircle size={40} className="text-white/80" /> */}
             </div>
        </div>
        <div>
            <h3 className="text-sm font-semibold truncate">{item.title}</h3>
            <p className="text-xs text-blue-400">{(item.price).toLocaleString("vi-VN")} vnd</p>
        </div>
         {/* Optional: Progress Bar */}
         {/* <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
             <div className="bg-green-500 h-1 rounded-full" style={{ width: '70%' }}></div> // Example progress
         </div> */}
    </div>
  );
};

export default ContinueWatchingCard;