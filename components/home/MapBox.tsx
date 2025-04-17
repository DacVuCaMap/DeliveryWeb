"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapBox() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [distance, setDistance] = useState<number | null>(null); // Lưu khoảng cách

  // Tọa độ điểm đích
  const destination : any= [105.7737259, 21.0292478]; // Hoàn Kiếm, Hà Nội

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
      alert("Lỗi: Thiếu token Mapbox.");
      return;
    }

    mapboxgl.accessToken = token;

    if (!mapContainer.current) return;

    // Khởi tạo bản đồ
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/namvu1/cm9kv2zgt00vy01r37iuu4fzl?optimize=true",
      center: [106.6297, 10.8231], // TP.HCM mặc định
      zoom: 10,
      antialias: false, // Tăng hiệu suất
      renderWorldCopies: false, // Giảm render dư thừa
    });

    // Thêm controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Khi bản đồ load
    map.current.on("load", () => {
      setIsMapLoaded(true);
      console.log("Bản đồ đã load xong");

      // Thêm nút zoom tới điểm đích
      const zoomToDestination = () => {
        map.current?.flyTo({ center: destination, zoom: 12 });
      };
      const destButton = document.createElement("button");
      destButton.textContent = "Xem Điểm Đến";
      destButton.className = "absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-none z-10";
      destButton.onclick = zoomToDestination;
      mapContainer.current?.appendChild(destButton);
    });

    // Lấy vị trí người dùng và tính tuyến đường
    if (navigator.geolocation && isMapLoaded) {
      console.log("Đang yêu cầu vị trí người dùng...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          console.log("Vị trí nhận được:", longitude, latitude);

          // Marker cho vị trí người dùng
          const userMarkerElement = document.createElement("div");
          userMarkerElement.className = "marker";
          new mapboxgl.Marker({ element: userMarkerElement })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, className: "rounded-none" }).setHTML(
                `<h3>Vị trí của bạn</h3><p>Kinh độ: ${longitude}<br>Vĩ độ: ${latitude}</p>`
              )
            )
            .addTo(map.current!);

          // Marker cho điểm đích
          const destMarkerElement = document.createElement("div");
          destMarkerElement.className = "marker destination";
          new mapboxgl.Marker({ element: destMarkerElement })
            .setLngLat(destination)
            .setPopup(
              new mapboxgl.Popup({ offset: 25, className: "rounded-none" }).setHTML(
                `<h3>Điểm đến</h3><p>Kinh độ: ${destination[0]}<br>Vĩ độ: ${destination[1]}</p>`
              )
            )
            .addTo(map.current!);

          // Gọi Mapbox Directions API
          try {
            const response = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${destination[0]},${destination[1]}?access_token=${token}&geometries=geojson`
            );
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              setDistance(route.distance / 1000); // Chuyển sang km

              // Thêm layer tuyến đường
              map.current!.addSource("route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: route.geometry,
                },
              });
              map.current!.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#FF6200",
                  "line-width": 2, // Giảm để nhẹ hơn
                },
              });

              // Điều chỉnh khung nhìn để hiển thị toàn bộ tuyến đường
              const coordinates = route.geometry.coordinates;
              const bounds = coordinates.reduce(
                (bounds: mapboxgl.LngLatBounds, coord: [number, number]) =>
                  bounds.extend(coord),
                new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
              );
              map.current?.fitBounds(bounds, { padding: 50 });
            } else {
              alert("Không tìm thấy tuyến đường.");
            }
          } catch (error) {
            console.error("Lỗi Directions API:", error);
            alert("Lỗi khi tính tuyến đường.");
          }
        },
        (error) => {
          console.error("Lỗi Geolocation:", error);
          if (error.code === error.PERMISSION_DENIED) {
            alert("Quyền truy cập vị trí bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.");
          } else {
            alert("Không thể lấy vị trí: " + error.message);
          }
          // Fallback: Marker tại TP.HCM
          new mapboxgl.Marker({ color: "#FF0000" })
            .setLngLat([106.6297, 10.8231])
            .addTo(map.current!);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị.");
      new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat([106.6297, 10.8231])
        .addTo(map.current!);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [isMapLoaded]);

  return (
    <div className="w-full h-full bg-gray-200 lg:ml-72 flex items-center justify-center relative">
      <div ref={mapContainer} className="w-full h-[100vh]" />
      {distance && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded-none shadow-md z-10">
          Khoảng cách: {distance.toFixed(2)} km
        </div>
      )}
      <style jsx global>{`
        .marker {
          width: 40px;
          height: 40px;
          background-image: url("https://img.icons8.com/color/48/000000/marker.png");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          cursor: pointer;
          animation: pulse 2s infinite;
        }
        .marker.destination {
          background-image: url("https://img.icons8.com/fluency/48/000000/marker.png");
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7);
          }
          70% {
            box-shadow: 0 0 0 5px rgba(255, 165, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 165, 0, 0);
          }
        }
        .mapboxgl-popup-content {
          border-radius: 0 !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}