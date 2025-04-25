import Link from 'next/link';

interface ContentRowProps {
  title: string;
  showSeeAll?: boolean;
  children: React.ReactNode; // To accept cards as children
}

const ContentRow: React.FC<ContentRowProps> = ({ title, showSeeAll = false, children }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showSeeAll && (
          <Link href="#" className="text-sm text-gray-400 hover:text-gray-200">
            See all &gt;
          </Link>
        )}
      </div>
      {/* Horizontal Scroll */}
      <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
        {/* scrollbar-hide is a custom utility you might need to add in tailwind.config.js if you want to hide the scrollbar */}
        {children}
      </div>
    </section>
  );
};

export default ContentRow;

/* Optional: Add scrollbar-hide utility in tailwind.config.js
   plugins: [
     require('tailwind-scrollbar-hide') // First: npm install -D tailwind-scrollbar-hide
   ],
*/