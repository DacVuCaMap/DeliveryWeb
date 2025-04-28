"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CameraRecordButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      console.log("Video file URL:", videoUrl);

      // Chuyển tới trang preview và truyền videoUrl
      router.push(`/addvideo?videoUrl=${encodeURIComponent(videoUrl)}`);
    }
  };

  return (
    <>
      <button
        className="relative w-[60px] h-[40px] cursor-pointer mx-1"
        onClick={handleButtonClick}
      >
        <div className="absolute inset-0 bg-orange-500 text-white rounded-xl flex items-center justify-center z-10 hover:bg-orange-600">
          <Plus size={20} strokeWidth={3} />
        </div>
      </button>

      {/* input hidden để trigger mở camera */}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
