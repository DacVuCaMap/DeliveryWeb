'use client'; // Đánh dấu là Client Component

import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';

// --- Dữ liệu mẫu (Thay thế bằng nguồn dữ liệu thực tế của bạn) ---
const ALL_SEARCHABLE_ITEMS: string[] = [
  'The White and Gray Evil Killers',
  'Clouds Over the Oasis',
  'Waiting For...',
  'Maleficent Heart Hunter',
  'Believe in Eternal Darkness',
  'The Secret About Us',
  'Stranger Things',
  'The Mandalorian',
  'Squid Game',
  'Bridgerton',
  'Inception',
  'Interstellar',
  'The Dark Knight',
  'Parasite',
  'Breaking Bad',
  'Game of Thrones',
];
// -------------------------------------------------------------------

const SearchStoreBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref cho container

  // Lọc gợi ý khi searchTerm thay đổi
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return; // Không hiển thị gì nếu input rỗng
    }

    // Lọc không phân biệt chữ hoa/thường và giới hạn số lượng gợi ý
    const filteredSuggestions = ALL_SEARCHABLE_ITEMS.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6); // Giới hạn 6 gợi ý

    setSuggestions(filteredSuggestions);
  }, [searchTerm]);

  // Xử lý khi người dùng nhập
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Xử lý khi chọn một gợi ý
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion); // Đặt giá trị input thành gợi ý được chọn
    setSuggestions([]); // Ẩn danh sách gợi ý
    setIsFocused(false); // Bỏ focus khỏi input (tuỳ chọn)
  };

  // Xử lý khi input được focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Xử lý khi click ra ngoài ô tìm kiếm và danh sách gợi ý
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false); // Nếu click ra ngoài thì ẩn gợi ý
        setSuggestions([]);
      }
    };
    // Thêm event listener khi component mount
    document.addEventListener('mousedown', handleClickOutside);
    // Dọn dẹp event listener khi component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Chạy một lần khi mount

  return (
    // Ref được thêm vào đây để bắt sự kiện click outside
    <div className="relative w-full" ref={searchContainerRef}>
      <div className={`flex items-center bg-gray-800 rounded-full px-4 py-2 border border-transparent transition-colors ${isFocused ? 'border-gray-600' : ''}`}>
        <span className='text-orange-500 font-bold text-lg pr-4'>snapgo.vn</span>
        <FiSearch className="text-gray-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search for everything..."
          className="bg-transparent focus:outline-none text-white w-full placeholder-gray-500"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
        // Không cần onBlur phức tạp nữa nếu dùng click outside
        />
        {/* Nút xóa nhỏ (tùy chọn) */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-gray-500 hover:text-white ml-2 focus:outline-none"
            aria-label="Clear search"
          >
            &#x2715; {/* Dấu X */}
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <ul
          className="absolute top-full left-0 right-0 mt-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-30 max-h-60 overflow-y-auto"
          role="listbox" // Thêm role cho accessibility
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm text-white hover:bg-gray-600 cursor-pointer"
              // Sử dụng onMouseDown để nó thực thi trước khi input mất focus (nếu không dùng click outside)
              // hoặc onClick nếu đã xử lý click outside
              onClick={() => handleSuggestionClick(suggestion)}
              role="option" // Thêm role cho accessibility
              aria-selected={false} // Chưa chọn
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchStoreBar;