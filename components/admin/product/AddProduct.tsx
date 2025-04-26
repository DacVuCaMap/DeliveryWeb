// src/app/add-product/page.tsx (hoặc vị trí tương ứng trong cấu trúc `app` router)
import React from 'react';
import { ArrowLeft, UploadCloud, Save, Send, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react'; // Ví dụ sử dụng lucide-react cho icons

// Bạn cần cài đặt: npm install lucide-react

export default function AddProduct() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-md p-4 mb-4 flex items-center justify-between sticky top-[78px] z-10">
        <div className="flex items-center gap-3">
          <button className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Thêm sản phẩm mới</h1>
            <p className="text-sm text-gray-500">Thêm thông tin sản phẩm chi tiết để có thể giúp người mua hiểu rõ hơn</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Save size={16} className="inline mr-1" /> Lưu làm nháp
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            <Send size={16} className="inline mr-1" /> Gửi để xét duyệt
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar Navigation */}
        <nav className="w-full lg:w-1/5 bg-white p-4 rounded-md shadow-sm h-fit sticky top-[150px]"> {/* Adjust top offset based on header height */}
          <ul className="space-y-2">
            <li><a href="#basic-info" className="block px-3 py-2 rounded-md text-blue-600 bg-blue-50 font-medium">Thông tin cơ bản</a></li>
            <li><a href="#product-details" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Chi tiết sản phẩm</a></li>
            <li><a href="#sales-info" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Thông tin bán hàng</a></li>
            <li><a href="#shipping" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Vận chuyển</a></li>
          </ul>
        </nav>

        {/* Main Content Form */}
        <main className="w-full lg:flex-grow bg-white p-6 rounded-md shadow-sm">
          {/* Section: Thông tin cơ bản */}
          <section id="basic-info" className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Thông tin cơ bản</h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Ảnh bìa sẽ hiển thị trên trang sản phẩm. Kích thước tối đa 5 MB, định dạng: JPG, JPEG, PNG.</p>
              <div className="flex gap-2">
                {/* Main Image Upload */}
                <div className="w-28 h-28 border-2 border-dashed border-blue-400 rounded-md flex flex-col items-center justify-center text-center text-blue-600 cursor-pointer hover:bg-blue-50">
                  <UploadCloud size={24} />
                  <span className="text-xs mt-1">Tải ảnh lên</span>
                  {/* <input type="file" className="hidden" /> */}
                </div>
                {/* Other Image Placeholders */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-28 h-28 border border-gray-300 rounded-md flex items-center justify-center bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200">
                     {/* Placeholder Icon or Text */}
                     <span className="text-xs">Ảnh {i + 1}</span>
                     {/* <input type="file" className="hidden" /> */}
                  </div>
                ))}
              </div>
            </div>

            {/* Product Name */}
            <div className="mb-6">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="productName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Ngành hàng <span className="text-red-500">*</span>
              </label>
              {/* Replace with a proper category selection component */}
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-500 sm:text-sm cursor-pointer hover:border-blue-500">
                Chọn ngành hàng (ví dụ: Thời trang nam &gt; Áo &gt; Áo thun)
              </div>
            </div>
          </section>

          {/* Section: Chi tiết sản phẩm */}
          <section id="product-details" className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Chi tiết sản phẩm</h2>

            {/* Product Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả sản phẩm <span className="text-red-500">*</span>
              </label>
               {/* Placeholder for Rich Text Editor */}
              <div className="border border-gray-300 rounded-md">
                {/* Toolbar Placeholder */}
                <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                   <button title="AI Generate" className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Nội dung mô tả sản phẩm do AI tạo?</button>
                   <div className="flex gap-1">
                     <button className="p-1 hover:bg-gray-200 rounded"><Bold size={16}/></button>
                     <button className="p-1 hover:bg-gray-200 rounded"><Italic size={16}/></button>
                     <button className="p-1 hover:bg-gray-200 rounded"><Underline size={16}/></button>
                     <button className="p-1 hover:bg-gray-200 rounded"><List size={16}/></button>
                     <button className="p-1 hover:bg-gray-200 rounded"><ListOrdered size={16}/></button>
                   </div>
                </div>
                 {/* Text Area */}
                <textarea
                  id="description"
                  rows={8}
                  className="w-full p-3 border-0 focus:ring-0 sm:text-sm"
                  placeholder="Mô tả chi tiết sản phẩm của bạn..."
                ></textarea>
              </div>
               {/* Helper text */}
               <p className="text-xs text-gray-500 mt-1">Mô tả sản phẩm cần chi tiết, rõ ràng, cung cấp đầy đủ thông tin về sản phẩm.</p>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video
              </label>
               <p className="text-xs text-gray-500 mb-2">Thêm video để mô tả sản phẩm rõ hơn. Kích thước tối đa 100 MB, thời lượng tối đa 60s, định dạng: MP4, MOV, AVI.</p>
              <div className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50">
                 <UploadCloud size={24} />
                 <span className="text-xs mt-1">Tải video</span>
                 {/* <input type="file" className="hidden" accept="video/*" /> */}
              </div>
            </div>
          </section>

          {/* Section: Thông tin bán hàng (Placeholder) */}
          <section id="sales-info" className="mb-8">
             <h2 className="text-xl font-semibold mb-4 border-b pb-2">Thông tin bán hàng</h2>
             {/* Add Price, Stock, Variations etc. here */}
             <p className="text-gray-500">...</p>
          </section>

          {/* Section: Vận chuyển (Placeholder) */}
          <section id="shipping">
             <h2 className="text-xl font-semibold mb-4 border-b pb-2">Vận chuyển</h2>
             {/* Add Weight, Dimensions, Shipping Options etc. here */}
             <p className="text-gray-500">...</p>
          </section>

        </main>

        {/* Right Sidebar Preview */}
        <aside className="w-full lg:w-1/4 bg-white p-4 rounded-md shadow-sm h-fit sticky top-[150px]"> {/* Adjust top offset */}
           <h3 className="text-lg font-semibold mb-3">Xem trước</h3>
           {/* Add Preview components/placeholders here */}
           <div className="border rounded-md p-4 text-center text-gray-400">
               <p>Khu vực xem trước sản phẩm</p>
               {/* Desktop/Mobile Toggle Placeholder */}
               <div className="mt-4 flex justify-center gap-2">
                    <button className="text-xs px-3 py-1 border rounded bg-gray-200">Desktop</button>
                    <button className="text-xs px-3 py-1 border rounded">Mobile</button>
               </div>
           </div>
        </aside>
      </div>
    </div>
  );
}