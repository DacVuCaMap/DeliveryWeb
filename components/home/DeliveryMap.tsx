"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function DeliveryMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
      return;
    }

    mapboxgl.accessToken = token;

    if (!mapContainer.current) return;

    // Khởi tạo bản đồ
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/namvu1/cm9kv2zgt00vy01r37iuu4fzl",
      center: [106.6297, 10.8231], // Tọa độ mặc định
      zoom: 10,
    });

    // Thêm controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Lấy vị trí người dùng
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          console.log("Vị trí người dùng:", longitude, latitude); // Debug tọa độ

          // Cập nhật trung tâm bản đồ
          map.current?.setCenter([longitude, latitude]);
          map.current?.setZoom(14);

          // Tạo phần tử HTML cho marker
          const markerElement = document.createElement("div");
          markerElement.style.width = "40px";
          markerElement.style.height = "40px";
          markerElement.style.backgroundImage = "url('https://img.icons8.com/color/48/000000/marker.png')"; // Hình ảnh từ Icons8
          markerElement.style.backgroundSize = "contain";
          markerElement.style.backgroundRepeat = "no-repeat";
          markerElement.style.backgroundPosition = "center";
          markerElement.style.cursor = "pointer";
          markerElement.style.animation = "pulse 2s infinite";

          // Thêm CSS pulse effect
          const style = document.createElement("style");
          style.innerHTML = `
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(255, 68, 68, 0); }
              100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
            }
          `;
          document.head.appendChild(style);

          // Thêm marker
          new mapboxgl.Marker({ element: markerElement })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>Vị trí của bạn</h3><p>Kinh độ: ${longitude}<br>Vĩ độ: ${latitude}</p>`
              )
            )
            .addTo(map.current!);
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí:", error.message);
          alert("Không thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị.");
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-200 ml-72 flex items-center justify-center">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}