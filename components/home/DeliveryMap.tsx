'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDownUp, ArrowRightLeft, X } from 'lucide-react';
import TypeFastShip from './delivery/TypeFastShip';
import axios from 'axios';
import polyline from '@mapbox/polyline'
import { fetchRouteVietMap, getNearShipper } from '@/utils/api';
type Opencard = {
  bottomCard: boolean;
  fastShip: boolean;
}
type Location = {
  lat: number | null;
  lng: number | null;
}
export default function DeliveryMap() {
  const [openCard, setOpenCard] = useState<Opencard>({ bottomCard: false, fastShip: true });
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [fastShip, setFastShip] = useState<Location[]>([]);
  const hasFlownToUserRef = useRef(false)
  const fastShipMarkerRef = useRef<any>([]);
  const [distance, setDistance] = useState<number>(0);
  const [nearShipper, setNearShipper] = useState<Location | null>(null);
  const [nearListShipper, setNearListShipper] = useState<Location[]>([]);
  const shipperMarkersRef = useRef<any[]>([]);
  // Khởi tạo bản đồ NGAY từ đầu
  useEffect(() => {
    const vietmapgl = (window as any).vietmapgl
    if (!mapContainer.current || !vietmapgl || mapRef.current) return

    const defaultCenter: [number, number] = [105.8544441, 21.028511]

    mapRef.current = new vietmapgl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_API_URL + `/api/vietmap/style`,
      center: defaultCenter,
      zoom: 15,
    })


    markerRef.current = new vietmapgl.Marker().setLngLat(defaultCenter).addTo(mapRef.current)
  }, [])
  useEffect(() => {
    const checkStyleResponse = async () => {
      const res = await axios(process.env.NEXT_PUBLIC_API_URL + `/api/vietmap/style`);
      console.log(res);
    };

    checkStyleResponse();
  }, []);

  // Theo dõi vị trí liên tục
  useEffect(() => {
    let watchId: number

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error('❌ Error watching user location:', error)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000,
        }
      )
    } else {
      console.error('❌ Geolocation is not supported by this browser.')
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  // Cập nhật marker và center khi có userLocation (chỉ flyTo 1 lần)
  // useEffect(() => {
  //   if (!userLocation || !mapRef.current || !markerRef.current) return

  //   // // Cập nhật marker vị trí người dùng
  //   // markerRef.current.setLngLat(userLocation)

  //   const vietmapgl = (window as any).vietmapgl;

  //   if (!markerRef.current) {
  //     const el = document.createElement('div');
  //     el.style.width = '40px';
  //     el.style.height = '40px';
  //     el.style.backgroundImage = 'url("/images/mark1.png")';
  //     el.style.backgroundSize = 'contain';
  //     el.style.backgroundRepeat = 'no-repeat';
  //     el.style.backgroundPosition = 'center';
  //     el.style.border = '2px solid transparent'; // thêm để dễ thấy, có thể xoá

  //     markerRef.current = new vietmapgl.Marker({ element: el })
  //       .setLngLat(userLocation)
  //       .addTo(mapRef.current);

  //     console.log("✅ Custom marker created");
  //   } else {
  //     markerRef.current.setLngLat(userLocation);
  //   }

  //   // Chỉ flyTo khi chưa từng thực hiện
  //   if (!hasFlownToUserRef.current) {
  //     mapRef.current.flyTo({ center: userLocation })
  //     hasFlownToUserRef.current = true
  //   }
  // }, [userLocation])
  useEffect(() => {

    if (!userLocation || !mapRef.current) return;
    const vietmapgl = (window as any).vietmapgl;

    // Xóa marker cũ nếu tồn tại
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null; // Đặt lại tham chiếu
    }

    // Tạo phần tử HTML tùy chỉnh cho marker
    const markerElement = document.createElement('div');
    markerElement.style.width = '65px'; // Kích thước marker
    markerElement.style.height = '65px';
    markerElement.style.backgroundImage = 'url(/images/map-marker1.png)'; // Icon ghim bản đồ
    markerElement.style.backgroundSize = 'contain';
    markerElement.style.backgroundRepeat = 'no-repeat';
    markerElement.style.backgroundPosition = 'center';
    markerElement.style.cursor = 'pointer';
    markerElement.style.display = 'flex'; // Để căn giữa avatar
    markerElement.style.alignItems = 'center';
    markerElement.style.justifyContent = 'center';

    // Tạo phần tử ảnh avatar người dùng
    // Tạo phần tử ảnh avatar người dùng
    const avatarElement = document.createElement('img');
    avatarElement.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'; // Placeholder avatar
    avatarElement.style.width = '40px'; // Kích thước avatar
    avatarElement.style.height = '40px';
    avatarElement.style.borderRadius = '50%'; // Hình tròn cho avatar
    avatarElement.style.objectFit = 'cover'; // Đảm bảo ảnh không méo
    avatarElement.style.position = 'absolute';
    avatarElement.style.top = '4px'; // Đẩy avatar lên trên để nằm trong phần hình tròn của ghim
    avatarElement.style.left = '50%';
    avatarElement.style.transform = 'translateX(-50%)'; // Căn giữa theo chiều ngang
    markerElement.appendChild(avatarElement);
    // Tạo marker mới với phần tử tùy chỉnh
    markerRef.current = new vietmapgl.Marker({
      element: markerElement,
      anchor: 'center', // Đặt tâm của marker
    })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(mapRef.current);

    // FlyTo lần đầu nếu chưa thực hiện
    if (!hasFlownToUserRef.current) {
      mapRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15,
      });
      hasFlownToUserRef.current = true;
    }
  }, [userLocation]);
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;
    /// check userlocation ton tai de hien shipper xung quanh luon
    const fetchNearListShipper = async () => {
      if (userLocation.lat && userLocation.lng) {
        const response = await getNearShipper(userLocation.lat, userLocation.lng, 0);
        if (response && response.value && response.success && Array.isArray(response.value)) {
          const newList: Location[] = response.value.map((item: any) => {
            return {
              lat: item.latitude,
              lng: item.longitude,
            };
          })
          setNearListShipper(newList);
        }
      }
    }
    fetchNearListShipper();
  }, [userLocation])



  useEffect(() => {
    if (!mapRef.current || fastShip.length === 0) return

    const vietmapgl = (window as any).vietmapgl

    // Xoá các marker cũ
    fastShipMarkerRef.current.forEach((marker: any) => marker.remove())
    fastShipMarkerRef.current = []

    fastShip.forEach((location, index) => {
      if (location.lat == null || location.lng == null || location.lat === userLocation?.lat || location.lng === userLocation?.lng) return;
      // Tạo custom DOM element cho marker
      // const el = document.createElement('div')
      // el.style.width = '60px'; // Tăng kích thước để chứa ảnh
      // el.style.height = '60px';
      // el.style.backgroundColor = 'transparent'; // Trong suốt
      // el.style.border = '3px solid #ff8000'; // Viền xanh lá cây
      // el.style.borderRadius = '50%'; // Hình tròn
      // el.style.cursor = 'pointer'; // Con trỏ chuột
      // el.style.display = 'flex'; // Để căn giữa ảnh
      // el.style.alignItems = 'center';
      // el.style.justifyContent = 'center';
      // el.style.overflow = 'hidden';
      // const imageElement = document.createElement('img');

      // imageElement.style.width = '60px'; // Kích thước ảnh nhỏ hơn vòng tròn
      // imageElement.style.height = '60px';
      // imageElement.style.objectFit = 'contain'; // Đảm bảo ảnh không bị méo
      // Tạo phần tử HTML tùy chỉnh cho marker
      const el = document.createElement('div');
      el.style.width = '65px'; // Kích thước marker
      el.style.height = '65px';
      el.style.backgroundImage = 'url(/images/start-ship1-mark.png)'; // Icon ghim bản đồ
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
      el.style.cursor = 'pointer';
      el.style.display = 'flex'; // Để căn giữa avatar
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Tạo phần tử ảnh avatar người dùng
      // Tạo phần tử ảnh avatar người dùng
      const imageElement = document.createElement('img');
      imageElement.style.width = '30px'; // Kích thước avatar
      imageElement.style.height = '30px';
      imageElement.style.borderRadius = '50%'; // Hình tròn cho avatar
      imageElement.style.objectFit = 'cover'; // Đảm bảo ảnh không méo
      imageElement.style.position = 'absolute';
      imageElement.style.top = '10px'; // Đẩy avatar lên trên để nằm trong phần hình tròn của ghim
      imageElement.style.left = '50%';
      imageElement.style.transform = 'translateX(-50%)'; // Căn giữa theo chiều ngang
      if (location != userLocation) {
        if (index === 0) {
          // Marker bắt đầu
          imageElement.src = '/images/start-ship1.png';
        } else if (index === 1) {
          // Marker kết thúc
          imageElement.src = '/images/start-ship2.png';
        }
      }
      el.appendChild(imageElement);
      const marker = new vietmapgl.Marker({ element: el })
        .setLngLat([location.lng, location.lat])
        .addTo(mapRef.current)

      fastShipMarkerRef.current.push(marker)
    })

    if (!mapRef.current || !fastShip[0] || !fastShip[1]) return

    const start = `${fastShip[0].lat},${fastShip[0].lng}`
    const end = `${fastShip[1].lat},${fastShip[1].lng}`

    const fetchRouteAndDraw = async () => {
      try {
        const res = await fetchRouteVietMap(start, end);
        const encoded = res.data.paths[0].points
        const decoded = polyline.decode(encoded) // Trả về mảng [lat, lng]
        console.log(res);
        setDistance(res.data.paths[0].distance);
        // Convert thành GeoJSON LineString
        const geoJson = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: decoded.map(([lat, lng]) => [lng, lat]), // Đảo ngược lat/lng
          },
        }

        // Xoá source/line cũ nếu có
        if (mapRef.current.getLayer('routeLine')) {
          mapRef.current.removeLayer('routeLine')
        }
        if (mapRef.current.getSource('route')) {
          mapRef.current.removeSource('route')
        }

        mapRef.current.addSource('route', {
          type: 'geojson',
          data: geoJson,
        })

        mapRef.current.addLayer({
          id: 'routeLine',
          type: 'line',
          source: 'route',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#02fa1b',
            'line-width': 7,
          },
        })
        // 🔍 Fit bounds
        const bounds = new (window as any).vietmapgl.LngLatBounds()
        decoded.forEach(([lat, lng]) => {
          bounds.extend([lng, lat])
        })
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 17,
          duration: 1000,
        })
        console.log('🛣️ Vẽ route thành công!')
      } catch (err) {
        console.error('❌ Lỗi khi fetch hoặc vẽ route:', err)
      }
    }

    fetchRouteAndDraw()


  }, [fastShip])
  useEffect(() => {
    if (!mapRef.current || !fastShip[0]) return

    const { lat, lng } = fastShip[0]
    if (lat !== null && lng !== null) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 16, // bạn có thể thay đổi mức zoom tùy ý
        speed: 1.2, // tốc độ di chuyển
        curve: 1.5, // độ cong
        essential: true,
      })
    }
  }, [fastShip[0]])
  useEffect(() => {
    if (!mapRef.current || !fastShip[1]) return

    const { lat, lng } = fastShip[1]
    if (lat !== null && lng !== null) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 16, // bạn có thể thay đổi mức zoom tùy ý
        speed: 1.2, // tốc độ di chuyển
        curve: 1.5, // độ cong
        essential: true,
      })
    }
  }, [fastShip[1]])
  useEffect(() => {
    if (!mapRef.current || !nearShipper) return;

    // Nếu đã có marker cũ thì remove
    if (markerRef.current?.nearShipperMarker) {
      markerRef.current.nearShipperMarker.remove();
      markerRef.current.nearShipperMarker = null; // Đặt lại tham chiếu
    }

    const vietmapgl = (window as any).vietmapgl;

    // Tạo phần tử HTML tùy chỉnh cho marker
    const markerElement = document.createElement('div');
    markerElement.style.width = '60px'; // Tăng kích thước để chứa ảnh
    markerElement.style.height = '60px';
    markerElement.style.backgroundColor = 'transparent'; // Trong suốt
    markerElement.style.border = '3px solid #0022ff'; // Viền xanh lá cây
    markerElement.style.borderRadius = '50%'; // Hình tròn
    markerElement.style.cursor = 'pointer'; // Con trỏ chuột
    markerElement.style.display = 'flex'; // Để căn giữa ảnh
    markerElement.style.alignItems = 'center';
    markerElement.style.justifyContent = 'center';
    markerElement.style.overflow = 'hidden';

    // Tạo phần tử ảnh bên trong
    const imageElement = document.createElement('img');
    imageElement.src = '/images/shipper1.png'; // Thay bằng URL ảnh của bạn
    imageElement.style.width = '60px'; // Kích thước ảnh nhỏ hơn vòng tròn
    imageElement.style.height = '60px';
    imageElement.style.objectFit = 'contain'; // Đảm bảo ảnh không bị méo

    // Thêm ảnh vào marker
    markerElement.appendChild(imageElement);

    // Tạo marker mới với phần tử tùy chỉnh
    const marker = new vietmapgl.Marker({
      element: markerElement,
      anchor: 'center', // Đặt tâm của marker
    })
      .setLngLat([nearShipper.lng, nearShipper.lat])
      .addTo(mapRef.current);

    // Lưu lại marker để sau này remove
    markerRef.current.nearShipperMarker = marker;

    // Zoom đến vị trí gần nhất
    mapRef.current.flyTo({
      center: [nearShipper.lng, nearShipper.lat],
      zoom: 14,
      speed: 1.2,
    });
  }, [nearShipper]);


  useEffect(() => {
    if (mapRef.current && nearListShipper.length > 0) {
      const vietmapgl = (window as any).vietmapgl;

      // Xóa các marker shipper cũ
      shipperMarkersRef.current.forEach((marker) => marker.remove());
      shipperMarkersRef.current = []; // Reset mảng lưu trữ marker
      console.log(nearListShipper);
      // Tạo marker cho từng shipper trong danh sách
      nearListShipper.forEach((shipperLocation) => {
        // Tạo phần tử HTML tùy chỉnh cho marker
        const shipperMarkerElement = document.createElement('div');
        shipperMarkerElement.style.width = '65px'; // Kích thước marker
        shipperMarkerElement.style.height = '65px';
        shipperMarkerElement.style.backgroundImage = 'url(/images/shipper-mark1.png)'; // Icon ghim bản đồ
        shipperMarkerElement.style.backgroundSize = 'contain';
        shipperMarkerElement.style.backgroundRepeat = 'no-repeat';
        shipperMarkerElement.style.backgroundPosition = 'center';
        shipperMarkerElement.style.cursor = 'pointer';
        shipperMarkerElement.style.display = 'flex'; // Để căn giữa avatar
        shipperMarkerElement.style.alignItems = 'center';
        shipperMarkerElement.style.justifyContent = 'center';

        // Tạo phần tử ảnh avatar người dùng
        // Tạo phần tử ảnh avatar người dùng
        const avatarElement = document.createElement('img');
        avatarElement.src = '/images/shipper2.png';
        avatarElement.style.width = '30px'; // Kích thước avatar
        avatarElement.style.height = '30px';
        avatarElement.style.borderRadius = '50%'; // Hình tròn cho avatar
        avatarElement.style.objectFit = 'cover'; // Đảm bảo ảnh không méo
        avatarElement.style.position = 'absolute';
        avatarElement.style.top = '10px'; // Đẩy avatar lên trên để nằm trong phần hình tròn của ghim
        avatarElement.style.left = '50%';
        avatarElement.style.transform = 'translateX(-50%)'; // Căn giữa theo chiều ngang
        shipperMarkerElement.appendChild(avatarElement);


        const shipperMarker = new vietmapgl.Marker({
          element: shipperMarkerElement,
          anchor: 'center',
        })
          .setLngLat([shipperLocation.lng, shipperLocation.lat])
          .addTo(mapRef.current);

        shipperMarkersRef.current.push(shipperMarker); // Lưu trữ marker mới
      });
    }
  }, [nearListShipper]);

  /// lay vi tri near shipper ban dau so voi userlocation
  return (
    <div className="relative w-screen h-screen">
      {/* Header Tìm kiếm */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white shadow-md px-4 py-2 flex items-center">
          <span className="font-bold text-xl dark:text-white text-orange-600 border-r pr-4">snapgo.vn</span>
          <input
            type="text"
            placeholder="Tìm kiếm cửa hàng"
            className=" flex-1 bg-transparent outline-none px-4"
          />
          {/* <button onClick={e => setOpenCard({ ...openCard, fastShip: true })} className="px-4 bg-orange-500 rounded-xl text-white py-1 text-xs">
            Tìm shipper ngay
          </button> */}
          <div className="ml-2 w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Bản đồ */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Thẻ hỏi nhập nhận đơn hàng nhanh */}
      {openCard.fastShip &&
        (<TypeFastShip setNearShipper={setNearShipper} fastShip={fastShip} mapRef={mapRef} setFastShip={setFastShip} setOpenCard={setOpenCard} openCard={openCard} userLocation={userLocation} distance={distance} />)
      }s
    </div>
  )
}
