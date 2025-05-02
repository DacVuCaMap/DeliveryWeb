import React, { useState, useEffect, ChangeEvent } from 'react';
import { UploadCloud, MapPin, Tag, AtSign, Users, Settings, Send, Image as ImageIcon, Video, X, List, DollarSign, Type, ChevronDown, ChevronUp } from 'lucide-react'; // Added ChevronDown, ChevronUp

// Define Props interface if needed, otherwise remove or adjust
interface Props {
    videoUrl?: string; // Optional initial video URL from props
    // Add other props if necessary
}

// Reusable Collapsible Section Component
interface CollapsibleSectionProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    initialOpen?: boolean; // Optional: Set if the section should be open initially
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon: Icon, children, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-3 text-left text-gray-800 hover:bg-gray-50 rounded-lg px-2 transition-colors focus:outline-none"
                aria-expanded={isOpen}
            >
                <span className="flex items-center text-sm font-medium">
                    <Icon size={20} className="mr-3 text-gray-500" /> {title}
                </span>
                {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
            </button>
            {/* Collapsible content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 pb-4 px-2' : 'max-h-0 opacity-0'}`} // Adjust max-h as needed
                style={{ transitionProperty: 'max-height, opacity, padding' }} // Ensure smooth transition
            >
                {isOpen && <div className="mt-2">{children}</div>} {/* Render children only when open or during transition */}
            </div>
        </div>
    );
};


// Main component for adding a product
export default function AddProduct(props: Props) {
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

    // --- Video Handling Logic ---
    const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 100 * 1024 * 1024) {
                alert("Video quá lớn, tối đa 100 MB!");
                return;
            }
            if (!["video/mp4", "video/quicktime", "video/x-msvideo", "video/avi"].includes(file.type)) {
                alert("Định dạng không hợp lệ! Vui lòng chọn MP4, MOV hoặc AVI.");
                return;
            }
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
            setVideoFile(file);
            const objectUrl = URL.createObjectURL(file);
            setVideoUrl(objectUrl);
        }
    };

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
            if (currentImageCount + newFiles.length > 3) {
                alert("Bạn chỉ có thể tải lên tối đa 3 ảnh.");
                return;
            }
            const validFiles = newFiles.filter(file => {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`Ảnh "${file.name}" quá lớn, tối đa 5 MB.`);
                    return false;
                }
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                    alert(`Định dạng ảnh "${file.name}" không hợp lệ. Chỉ chấp nhận JPG, PNG.`);
                    return false;
                }
                return true;
            });
            setImages(prevImages => [...prevImages, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => {
            const previewToRemove = prevPreviews[index];
            URL.revokeObjectURL(previewToRemove);
            return prevPreviews.filter((_, i) => i !== index);
        });
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [imagePreviews, videoUrl]);

    // --- Handlers for button clicks ---
    const handleDraft = () => {
        console.log("Saving draft:", { productName, productPrice, description, images, videoFile });
        alert("Đã lưu nháp!");
    };

    const handlePost = () => {
        if (!productName || !productPrice) {
            alert("Vui lòng nhập tên và giá sản phẩm.");
            return;
        }
        console.log("Posting product:", { productName, productPrice, description, images, videoFile });
        alert("Đã đăng sản phẩm!");
    };


    return (
        <div className="flex flex-col h-screen bg-white font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                <button onClick={() => window.history.back()} className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="text-lg font-semibold">Thêm sản phẩm</h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4"> {/* Reduced space-y slightly */}

                {/* Description */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Thêm mô tả ..."
                    className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />

                {/* Hashtags and Mentions */}
                <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                        <Tag size={16} className="mr-1" /> #Hashtag
                    </button>
                    <button className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                        <AtSign size={16} className="mr-1" /> @Nhắc đến
                    </button>
                </div>

                {/* --- Video Section (Not collapsible by default, adjust if needed) --- */}
                <div className="border-t border-b border-gray-200 py-4">
                    <h2 className="text-md font-semibold mb-3 px-2">Video sản phẩm</h2> {/* Added px-2 */}
                    <div className="flex items-start space-x-4 px-2"> {/* Added px-2 */}
                        {videoUrl ? (
                            <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-sm">
                                <video src={videoUrl} className="w-full h-full object-cover" controls={false} preload="metadata" />
                                <button
                                    onClick={() => {
                                        if (videoUrl && videoUrl.startsWith('blob:')) { URL.revokeObjectURL(videoUrl); }
                                        setVideoUrl(null); setVideoFile(null);
                                    }}
                                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-75"
                                    aria-label="Xóa video"
                                > <X size={14} /> </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs text-center py-1"> Xem </div>
                            </div>
                        ) : (
                            <label htmlFor="video-upload" className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors">
                                <Video size={32} className="mb-1" /> <span className="text-xs text-center px-1">Tải video lên</span>
                                <input id="video-upload" type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/avi" onChange={handleVideoChange} className="hidden" />
                            </label>
                        )}
                        <p className="text-xs text-gray-600 flex-1 mt-1"> Video sẽ hiển thị trên trang sản phẩm. Kích thước tối đa 100 MB, định dạng: MP4, MOV, AVI. </p>
                    </div>
                </div>

                {/* --- Image Section (Not collapsible by default, adjust if needed) --- */}
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-md font-semibold mb-2 px-2">Hình ảnh</h2> {/* Added px-2 */}
                    <p className="text-xs text-gray-600 mb-3 px-2"> Ảnh bìa sẽ hiển thị trên trang sản phẩm. Kích thước tối đa 5 MB, định dạng: JPG, JPEG, PNG. Tối đa 3 ảnh. </p>
                    <div className="flex flex-wrap gap-2 px-2"> {/* Added px-2 */}
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img src={preview} alt={`Xem trước ảnh ${index + 1}`} className="w-full h-full object-cover" />
                                <button onClick={() => removeImage(index)} className="absolute top-0.5 right-0.5 bg-black bg-opacity-60 text-white rounded-full p-0.5 hover:bg-opacity-75" aria-label={`Xóa ảnh ${index + 1}`} > <X size={12} /> </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] text-center py-0.5"> Ảnh {index + 1} </div>
                            </div>
                        ))}
                        {images.length < 3 && (
                            <label htmlFor="image-upload" className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors">
                                <UploadCloud size={24} className="mb-1" /> <span className="text-xs mt-1 text-center px-1">Tải ảnh lên</span>
                                <input id="image-upload" type="file" accept="image/jpeg,image/png" multiple onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                        {Array.from({ length: Math.max(0, 3 - images.length - (images.length < 3 ? 1 : 0)) }).map((_, index) => (
                            <div key={`placeholder-${index}`} className="w-20 h-20 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                                <span className="text-xs">Ảnh {images.length + (images.length < 3 ? 1 : 0) + index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Collapsible Product Details Section --- */}
                <CollapsibleSection title="Chi tiết sản phẩm" icon={List} initialOpen={true}> {/* Open by default */}
                    <div className="space-y-3">
                        {/* Product Name Input */}
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <div className="relative shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Type className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Nhập tên sản phẩm"
                                    className="block w-full border-gray-300 pl-10 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        {/* Product Price Input */}
                        <div>
                            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                Giá sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <div className="relative shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)}
                                    placeholder="Nhập giá sản phẩm"
                                    className="block w-full border-gray-300 pl-10 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    required min="0"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pr-3">
                                    <span className="text-gray-500 sm:text-sm" id="price-currency"> VND </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- Collapsible Other Options List --- */}
                <div className="space-y-0"> {/* Removed space-y-1 here */}
                    <CollapsibleSection title="Vị trí" icon={MapPin}>
                        {/* Content for Location - Add inputs or components here */}
                        <p className="text-sm text-gray-600">Thêm vị trí của bạn...</p>
                    </CollapsibleSection>

                    <CollapsibleSection title="Ai cũng có thể xem bài đăng này" icon={Users}>
                        {/* Content for Visibility - Add radio buttons or dropdown here */}
                        <p className="text-sm text-gray-600">Chọn quyền riêng tư...</p>
                    </CollapsibleSection>

                    <CollapsibleSection title="Tùy chọn khác" icon={Settings}>
                        {/* Content for Other Options */}
                        <p className="text-sm text-gray-600">Cài đặt nâng cao...</p>
                    </CollapsibleSection>

                    <CollapsibleSection title="Chia sẻ với" icon={Send}>
                        {/* Content for Sharing - Add social icons/buttons here */}
                        <p className="text-sm text-gray-600">Chọn nền tảng chia sẻ...</p>
                    </CollapsibleSection>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white sticky bottom-0 z-10">
                <button onClick={handleDraft} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium">
                    Nháp
                </button>
                <button onClick={handlePost} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm shadow-sm">
                    Đăng
                </button>
            </div>
        </div>
    );
}

// Make sure to export App as default if this is the main component
// export default AddProduct; // Already done above
