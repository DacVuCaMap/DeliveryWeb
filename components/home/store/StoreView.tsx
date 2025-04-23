// app/store/[slug]/page.tsx
import React from "react";
import ProfileHeader from "./ProfileHeader";
import LiveStreamSection from "./LiveStreamSection";

type Props = {
    slug: string // Lấy slug từ URL trong App Router
};

// Dữ liệu mẫu - Thay thế bằng dữ liệu thực tế từ API hoặc nguồn khác
const storeData = {
    slug: "rosemad999",
    coverImageUrl: "/testImg/headstore.png", // Thay thế bằng URL ảnh bìa thật
    profileImageUrl: "/snapgoimg", // Thay thế bằng URL ảnh đại diện thật
    name: "Rose Madison",
    handle: "@rosemad999",
    bio: "Gamers who are very active in the world of war with extraordinary intelligence are unmatched.",
    stats: {
        posts: 736,
        followers: "92K",
        following: "34K",
    },
    liveStreams: [
        { id: 1, title: "War Against Fore...", viewers: "5.8K", thumbnailUrl: "/placeholder-stream1.jpg" },
        { id: 2, title: "Overwatch Leag...", viewers: "2.8K", thumbnailUrl: "/placeholder-stream2.jpg" },
        { id: 3, title: "Dies B...", viewers: "2.1K", thumbnailUrl: "/placeholder-stream3.jpg" },
        // Thêm các stream khác nếu cần
    ],
};


export default function StoreViewPage(props: Props) {

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Component Header và Profile */}
            <ProfileHeader data={storeData} />

            {/* Component Phần Live Stream */}
            <LiveStreamSection streams={storeData.liveStreams} />

            {/* Các phần khác của trang (nếu có) */}
            {/* Ví dụ: Phần bài đăng */}
            {/* <PostsSection posts={storeData.postsData} /> */}
        </div>
    );
}

// Hàm fetch dữ liệu mẫu (thay thế bằng logic fetch thực tế)
// async function fetchDataForStore(slug: string) {
//     // const response = await fetch(`/api/store/${slug}`);
//     // const data = await response.json();
//     // return data;
//     return storeData; // Trả về dữ liệu mẫu
// }