'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function DeliveryTest() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const vietMapToken = process.env.NEXT_PUBLIC_VIETMAP_TOKEN;
  const [searchText, setSearchText] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const vietmapgl = (window as any).vietmapgl;
    if (!mapContainer.current || !vietmapgl || mapRef.current) return;

    const defaultCenter: [number, number] = [105.8544441, 21.028511]; // Hà Nội

    mapRef.current = new vietmapgl.Map({
      container: mapContainer.current,
      style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${vietMapToken}`,
      center: defaultCenter,
      zoom: 15,
    });

    markerRef.current = new vietmapgl.Marker().setLngLat(defaultCenter).addTo(mapRef.current);
  }, []);

  // Theo dõi vị trí người dùng
  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error('❌ Error watching user location:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000,
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Cập nhật marker khi userLocation thay đổi
  useEffect(() => {
    if (!userLocation || !mapRef.current || !markerRef.current) return;
    markerRef.current.setLngLat(userLocation);
    mapRef.current.flyTo({ center: userLocation });
  }, [userLocation]);

  const handleSearch = async () => {
    if (!searchText || !vietMapToken) return;

    try {
      const res = await fetch(
        `https://maps.vietmap.vn/api/search?apikey=${vietMapToken}&text=${encodeURIComponent(searchText)}`
      );
      const data = await res.json();

      if (data.features && data.features.length > 0) {
        const { coordinates } = data.features[0].geometry;
        const [lng, lat] = coordinates;

        markerRef.current.setLngLat([lng, lat]);
        mapRef.current.flyTo({ center: [lng, lat], zoom: 16 });
      } else {
        alert('Không tìm thấy địa chỉ!');
      }
    } catch (err) {
      console.error('Lỗi tìm địa chỉ:', err);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Ô tìm kiếm */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-full shadow-md px-4 py-2 flex items-center space-x-2">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Tìm địa chỉ..."
            className="w-full bg-transparent outline-none"
          />
          <button
            onClick={handleSearch}
            className="text-blue-500 font-semibold hover:underline"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Bản đồ */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
