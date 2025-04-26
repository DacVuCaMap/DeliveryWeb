import Link from 'next/link';
import React from 'react';

type Product = {

}
export default function ManagerProduct() {
  return (
    // <Layout> // Uncomment if you have a layout component
    <div className="container mx-auto p-4"> {/* Basic container, adjust styling as needed */}
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
      </div>

      <div className="flex justify-end mb-6">
        <Link href={"/admin/product/manager/add"} className="bg-brand-500 text-white px-4 py-2 rounded hover:bg-brand-600">
          Thêm sản phẩm mới
        </Link>
        {/* Add other bulk action buttons here if needed */}
        {/* <button className="ml-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Thao tác hàng loạt</button> */}
      </div>

        {/* Suggestion/Announcement Section */}
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
            <p className="font-bold">Thêm thương hiệu sản phẩm để khách hàng tin tưởng</p>
            <p>Chúng tôi đã tìm thấy thương hiệu phù hợp cho 2 sản phẩm. Bạn có thể chấp nhận hoặc từ chối đề xuất này.</p>
            <div className="mt-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Xem chi tiết</button>
            </div>
        </div>


      {/* Product List Management Section */}
      <div className="bg-white p-4 rounded shadow">
        {/* Tabs/Filters */}
        <div className="flex border-b mb-4">
          <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">Tất cả (99)</button>
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">Live (1)</button>
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">Đã vô hiệu hoá</button>
           <button className="px-4 py-2 text-gray-600 hover:text-blue-600">Đang xét duyệt</button>
           <button className="px-4 py-2 text-gray-600 hover:text-blue-600">Tạm ngưng</button>
           <button className="px-4 py-2 text-gray-600 hover:text-blue-600">Bản nháp</button>
           <button className="px-4 py-2 text-gray-600 hover:text-blue-600">Đã xóa</button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, ID hoặc SKU người bán"
            className="flex-grow border rounded px-3 py-2"
          />
          {/* Filter Dropdowns - Placeholder */}
          <select className="border rounded px-3 py-2">
            <option>Giá</option>
          </select>
           <select className="border rounded px-3 py-2">
            <option>Hạng mục</option>
          </select>
           <select className="border rounded px-3 py-2">
            <option>Kho hàng</option>
          </select>

          {/* Action Buttons */}
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Xem thêm bộ lọc</button>
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Đặt lại</button>
        </div>

         {/* Batch Actions */}
        <div className="flex items-center space-x-4 mb-4">
             <span>Đã chọn: 0</span>
             <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Kích hoạt</button>
             <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Vô hiệu hoá</button>
             <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Xóa</button>
             <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Đặt họa hồng liên kết</button>
             <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Đặt giảm giá</button>
             <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Đặt cảnh báo</button>
        </div>


        {/* Product Table */}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 border-b"></th> {/* Checkbox column */}
              <th className="text-left py-2 px-4 border-b">Sản phẩm</th>
              <th className="text-left py-2 px-4 border-b">Số lượng</th>
              <th className="text-left py-2 px-4 border-b">Giá bán lẻ</th>
              <th className="text-left py-2 px-4 border-b">Doanh số</th>
              <th className="text-left py-2 px-4 border-b">Đã cập nhật</th>
              <th className="text-left py-2 px-4 border-b">Trạng thái</th>
              <th className="text-left py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b"><input type="checkbox" /></td>
              <td className="py-2 px-4 border-b">
                {/* Product Info */}
                <div className="flex items-center">
                    {/* Assuming product image */}
                    <img src="/testImg/biketest.png" alt="Product" className="w-10 h-10 mr-2 object-cover rounded" />
                    <div>
                        <p className="font-semibold">MÁT XA ks</p>
                         <p className="text-sm text-gray-500">Cốt Xoa Bóp - Hoàn Toàn...</p>
                         <p className="text-sm text-gray-500">ID: 23</p> {/* Example ID */}
                         <a href="#" className="text-blue-600 text-sm hover:underline">Đã đặt mức hoa hồng</a>
                    </div>
                </div>
              </td>
              <td className="py-2 px-4 border-b">24</td>
              <td className="py-2 px-4 border-b">129.000đ</td>
               <td className="py-2 px-4 border-b">
                   <p>0</p>
                   <p className="text-green-600">Tăng tốc</p> {/* Example trend */}
                </td>
              <td className="py-2 px-4 border-b">10/04/2025 15:05</td>
              <td className="py-2 px-4 border-b text-green-600">Đang hoạt động</td>
              <td className="py-2 px-4 border-b">
                {/* Action Links */}
                <a href="#" className="text-blue-600 hover:underline mr-2">Chỉnh sửa</a>
                <a href="#" className="text-blue-600 hover:underline mr-2">Sao chép</a>
                <a href="#" className="text-blue-600 hover:underline mr-2">Tạo quảng cáo</a>
                <a href="#" className="text-blue-600 hover:underline">Xem thêm</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    // </Layout>
  );
}