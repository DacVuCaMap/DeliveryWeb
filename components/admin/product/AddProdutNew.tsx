import React, { useState, useEffect, ChangeEvent } from 'react';
import { UploadCloud, MapPin, Tag, AtSign, Users, Settings, Send, Image as ImageIcon, Video, X } from 'lucide-react'; // Using lucide-react for icons

// Define Props interface if needed, otherwise remove or adjust
type Props = {
    header?: boolean;
    videoUrl?: string;
}


// Main component for adding a product
export default function AddProductNew(props: Props) {
    // State variables for form fields
    const [productName, setProductName] = useState<string>('');
    const [productPrice, setProductPrice] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [hashtags, setHashtags] = useState<string>('');
    const [mentions, setMentions] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    // --- Video Handling Logic (from user) ---
    const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check file type and size
            if (file.size > 100 * 1024 * 1024) { // 100 MB limit
                alert("Video quá lớn, tối đa 100 MB!"); // Video too large, max 100 MB!
                return;
            }
            if (!["video/mp4", "video/quicktime", "video/x-msvideo", "video/avi"].includes(file.type)) {
                // Added quicktime (mov) and avi
                alert("Định dạng không hợp lệ! Vui lòng chọn MP4, MOV hoặc AVI."); // Invalid format! Please select MP4, MOV, or AVI.
                return;
            }

            setVideoFile(file);
            const objectUrl = URL.createObjectURL(file);
            setVideoUrl(objectUrl); // Save video URL for display

            // Clean up the previous object URL if it exists
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    // Effect to handle initial video URL from props
    useEffect(() => {
        if (props.videoUrl) {
            setVideoUrl(props.videoUrl);
        }
    }, [props.videoUrl]);

    // --- Image Handling Logic ---
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const currentImageCount = images.length;

            // Limit to 3 images total for this example
            if (currentImageCount + newFiles.length > 3) {
                alert("Bạn chỉ có thể tải lên tối đa 3 ảnh."); // You can only upload a maximum of 3 images.
                // Optionally slice the newFiles array to fit the limit
                // newFiles = newFiles.slice(0, 3 - currentImageCount);
                return; // Or prevent adding any if limit exceeded
            }

            // Validate file types and sizes (example: max 5MB, JPG/JPEG/PNG)
            const validFiles = newFiles.filter(file => {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`Ảnh "${file.name}" quá lớn, tối đa 5 MB.`); // Image too large
                    return false;
                }
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                    alert(`Định dạng ảnh "${file.name}" không hợp lệ. Chỉ chấp nhận JPG, PNG.`); // Invalid format
                    return false;
                }
                return true;
            });

            setImages(prevImages => [...prevImages, ...validFiles]);

            // Create previews
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };

    // Function to remove an image
    const removeImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => {
            const previewToRemove = prevPreviews[index];
            URL.revokeObjectURL(previewToRemove); // Clean up object URL
            return prevPreviews.filter((_, i) => i !== index);
        });
    };

    // Clean up image object URLs on component unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl); // Clean up video URL if it's a blob
            }
        };
    }, [imagePreviews, videoUrl]);


    // --- Handlers for button clicks (implement actual logic) ---
    const handleDraft = () => {
        console.log("Saving draft:", { productName, productPrice, description, /* ... other state */ });
        alert("Đã lưu nháp!"); // Draft saved!
    };

    const handlePost = () => {
        console.log("Posting product:", { productName, productPrice, description, images, videoFile, /* ... other state */ });
        // Here you would typically send data to a server
        alert("Đã đăng sản phẩm!"); // Product posted!
    };


    return (
        <div className="flex flex-col h-screen bg-white font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <button onClick={() => window.history.back()} className="text-gray-600"> {/* Simple back button */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="text-lg font-semibold">Thêm sản phẩm</h1> {/* Add Product Title */}
                <div className="w-6"></div> {/* Spacer */}
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {/* Product Name Input */}
                <div className="mb-4">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Nhập tên sản phẩm" // Enter product name
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Product Price Input */}
                <div className="mb-4">
                    <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Giá sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number" // Use number type for price, or text with validation
                        id="productPrice"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="Nhập giá sản phẩm" // Enter product price
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0" // Optional: prevent negative prices
                    />
                </div>


                {/* Description */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Thêm mô tả ..." // Add description...
                    className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Hashtags and Mentions */}
                <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                        <Tag size={16} className="mr-1" /> #Hashtag
                    </button>
                    <button className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                        <AtSign size={16} className="mr-1" /> @Nhắc đến {/* @Mention */}
                    </button>
                    {/* Add input fields or modals for these if needed */}
                </div>

                {/* Video Section */}
                <div className="border-t border-b border-gray-200 py-4">
                    <h2 className="text-md font-semibold mb-2">Video sản phẩm</h2>
                    <div className="flex items-center space-x-4">
                        {videoUrl ? (
                            <div className="relative w-24 h-32 rounded-md overflow-hidden">
                                <video src={videoUrl} className="w-full h-full object-cover" controls={false} />
                                <button
                                    onClick={() => {
                                        if (videoUrl && videoUrl.startsWith('blob:')) {
                                            URL.revokeObjectURL(videoUrl); // Clean up blob URL
                                        }
                                        setVideoUrl(null);
                                        setVideoFile(null);
                                    }}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5"
                                >
                                    <X size={14} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-0.5">
                                    Xem {/* View */}
                                </div>
                            </div>
                        ) : (
                            <label htmlFor="video-upload" className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
                                <Video size={32} />
                                <span className="text-xs mt-1 text-center">Tải video lên</span> {/* Upload video */}
                                <input
                                    id="video-upload"
                                    type="file"
                                    accept="video/mp4,video/quicktime,video/x-msvideo,video/avi" // Accept mp4, mov, avi
                                    onChange={handleVideoChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <p className="text-xs text-gray-500 flex-1">
                            Video sẽ hiển thị trên trang sản phẩm. Kích thước tối đa 100 MB, định dạng: MP4, MOV, AVI.
                        </p>
                    </div>
                </div>


                {/* Image Section */}
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-md font-semibold mb-2">Hình ảnh</h2> {/* Images */}
                    <p className="text-xs text-gray-500 mb-3">
                        Ảnh bìa sẽ hiển thị trên trang sản phẩm. Kích thước tối đa 5 MB, định dạng: JPG, JPEG, PNG. Tối đa 3 ảnh.
                        {/* Cover image will be displayed on the product page. Max size 5 MB, format: JPG, JPEG, PNG. Max 3 images. */}
                    </p>
                    <div className="flex space-x-2">
                        {/* Image Previews */}
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                                <img src={preview} alt={`Xem trước ảnh ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0.5 right-0.5 bg-black bg-opacity-50 text-white rounded-full p-0.5"
                                    aria-label={`Xóa ảnh ${index + 1}`} // Remove image
                                >
                                    <X size={12} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[10px] text-center py-0.5">
                                    Ảnh {index + 1} {/* Image {index + 1} */}
                                </div>
                            </div>
                        ))}

                        {/* Upload Button Placeholder (if less than 3 images) */}
                        {images.length < 3 && (
                            <label htmlFor="image-upload" className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
                                <UploadCloud size={24} />
                                <span className="text-xs mt-1 text-center">Tải ảnh lên</span> {/* Upload image */}
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    multiple // Allow multiple file selection
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {/* Fill remaining slots with placeholders if needed, matching the screenshot */}
                        {Array.from({ length: Math.max(0, 3 - images.length - (images.length < 3 ? 1 : 0)) }).map((_, index) => (
                            <div key={`placeholder-${index}`} className="w-20 h-20 border border-gray-200 rounded-md flex items-center justify-center bg-gray-50 text-gray-400">
                                <span className="text-xs">Ảnh {images.length + (images.length < 3 ? 1 : 0) + index + 1}</span> {/* Placeholder text */}
                            </div>
                        ))}
                    </div>
                </div>


                {/* Other Options List */}
                <div className="space-y-1">
                    <button className="w-full flex justify-between items-center py-3 text-left text-gray-800 hover:bg-gray-50 rounded-md px-2">
                        <span className="flex items-center"><MapPin size={20} className="mr-3 text-gray-500" /> Vị trí</span> {/* Location */}
                        <ChevronRight />
                    </button>
                    <button className="w-full flex justify-between items-center py-3 text-left text-gray-800 hover:bg-gray-50 rounded-md px-2">
                        <span className="flex items-center"><ImageIcon size={20} className="mr-3 text-gray-500" /> Thêm thuộc tính của sản phẩm</span> {/* Add product attributes */}
                        <ChevronRight />
                    </button>
                    <button className="w-full flex justify-between items-center py-3 text-left text-gray-800 hover:bg-gray-50 rounded-md px-2">
                        <span className="flex items-center"><Users size={20} className="mr-3 text-gray-500" /> Ai cũng có thể xem bài đăng này</span> {/* Everyone can see this post */}
                        <ChevronRight />
                    </button>
                    <button className="w-full flex justify-between items-center py-3 text-left text-gray-800 hover:bg-gray-50 rounded-md px-2">
                        <span className="flex items-center"><Settings size={20} className="mr-3 text-gray-500" /> Tùy chọn khác</span> {/* Other options */}
                        <ChevronRight />
                    </button>
                    <button className="w-full flex justify-between items-center py-3 text-left text-gray-800 hover:bg-gray-50 rounded-md px-2">
                        <span className="flex items-center"><Send size={20} className="mr-3 text-gray-500" /> Chia sẻ với</span> {/* Share with */}
                        {/* Add social icons or similar here */}
                        <ChevronRight />
                    </button>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white">
                <button
                    onClick={handleDraft}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                    Nháp {/* Draft */}
                </button>
                <button
                    onClick={handlePost}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-red-600 font-semibold"
                >
                    Đăng {/* Post */}
                </button>
            </div>
        </div>
    );
}

// Simple ChevronRight component for list items
const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

// Make sure to export App as default if this is the main component
// export default AddProduct; // Already done above
