'use client'

import React, { useEffect, useRef, useState } from 'react'
import TypeFastShip from './delivery/TypeFastShip';
import axios from 'axios';
import polyline from '@mapbox/polyline'
import { apiFetchStyleVietMap, apiNearStore, fetchRouteVietMap, getNearShipper } from '@/utils/api';
import { useRouter } from 'next/navigation';
type Opencard = {
  bottomCard: boolean;
  fastShip: boolean;
}
type Location = {
  lat: number | null;
  lng: number | null;
}
type Shipper = {
  lat: number,
  lng: number,
  firstName: string,
  lastName: string,
  email: string
}
export default function DeliveryMap() {

  const router = useRouter();

  //animation ship route
  const animationFrameShipId = useRef<number | null>(null);
  const routeCoordinatesShip = useRef<[number, number][]>([]); // Lưu trữ tọa độ [lng, lat]
  const animationStartTimeShip = useRef<number | null>(null);

  //animation route
  const animationFrameId = useRef<number | null>(null);
  const routeCoordinates = useRef<[number, number][]>([]); // Lưu trữ tọa độ [lng, lat]
  const animationStartTime = useRef<number | null>(null);

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
  const [nearListShipper, setNearListShipper] = useState<Shipper[]>([]);
  const shipperMarkersRef = useRef<any[]>([]);
  const storeMarkerRef = useRef<any[]>([]);
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
    // const fetchStyle = async () =>{
    //   const response = await apiFetchStyleVietMap();
    //   console.log(response);
    // }
  }, [])

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
    markerElement.style.backgroundImage = 'url(/images/map/vitringuoidung.png)'; // Icon ghim bản đồ
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

    // FlyTo lần đầu nếu chưa thực hiện ham nay chi thuc hien lan dau tien load khi da co userlocation
    if (!hasFlownToUserRef.current) {
      mapRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15,
      });
      hasFlownToUserRef.current = true;

      const fetchStoreNear = async () => {
        if (!userLocation || !userLocation.lat || !userLocation.lng) return;
        try {
          const response = await apiNearStore(userLocation?.lat, userLocation?.lng, 0);
          if (response && response.success) {
            console.log(response)
            const listStore: any[] = response.value.map((item: any) => {
              return { ...item }
            })
            markStoreInMap(listStore);
          }
        } catch (error) {
          console.log(error)
        }
      }
      fetchStoreNear();

    }
  }, [userLocation]);
  useEffect(() => {
    if (!userLocation || !mapRef.current || nearShipper) return;
    /// check userlocation ton tai de hien shipper xung quanh luon
    // console.log("fetch near list")
    const fetchNearListShipper = async () => {
      if (userLocation.lat && userLocation.lng) {
        const response = await getNearShipper(userLocation.lat, userLocation.lng, 0);
        if (response && response.value && response.success && Array.isArray(response.value)) {
          const newList: Shipper[] = response.value.map((item: any) => {
            return {
              lat: item.latitude,
              lng: item.longitude,
              firstName: item.firstName,
              lastName: item.lastName,
              email: item.email
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
      if (!location || location.lat == null || location.lng == null || location.lat === userLocation?.lat || location.lng === userLocation?.lng) return;

      // Tạo phần tử HTML tùy chỉnh cho marker
      const el = document.createElement('div');
      el.style.width = '65px'; // Kích thước marker
      el.style.height = '65px';

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
      imageElement.style.width = '40px'; // Kích thước avatar
      imageElement.style.height = '40px';
      imageElement.style.borderRadius = '50%'; // Hình tròn cho avatar
      imageElement.style.objectFit = 'cover'; // Đảm bảo ảnh không méo
      imageElement.style.position = 'absolute';
      imageElement.style.top = '5px'; // Đẩy avatar lên trên để nằm trong phần hình tròn của ghim
      imageElement.style.left = '50%';
      imageElement.style.transform = 'translateX(-50%)'; // Căn giữa theo chiều ngang
      if (location != userLocation) {
        if (index === 0) {
          // Marker bắt đầu
          el.style.backgroundImage = 'url(/images/map/batdaudonhang.png)'; // Icon ghim bản đồ
          imageElement.src = '/images/start-ship1.png';
        } else if (index === 1) {
          // Marker kết thúc
          el.style.backgroundImage = 'url(/images/map/cuoidonhang.png)'; // Icon ghim bản đồ
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

    // const start = `${fastShip[0].lat},${fastShip[0].lng}`
    // const end = `${fastShip[1].lat},${fastShip[1].lng}`

    // const fetchRouteAndDraw = async () => {
    //   try {
    //     const res = await fetchRouteVietMap(start, end);
    //     const encoded = res.data.paths[0].points
    //     const decoded = polyline.decode(encoded) // Trả về mảng [lat, lng]
    //     setDistance(res.data.paths[0].distance);
    //     // Convert thành GeoJSON LineString
    //     const geoJson = {
    //       type: 'Feature',
    //       geometry: {
    //         type: 'LineString',
    //         coordinates: decoded.map(([lat, lng]) => [lng, lat]), // Đảo ngược lat/lng
    //       },
    //     }

    //     // Xoá source/line cũ nếu có
    //     if (mapRef.current.getLayer('routeLine')) {
    //       mapRef.current.removeLayer('routeLine')
    //     }
    //     if (mapRef.current.getSource('route')) {
    //       mapRef.current.removeSource('route')
    //     }

    //     mapRef.current.addSource('route', {
    //       type: 'geojson',
    //       data: geoJson,
    //     })

    //     mapRef.current.addLayer({
    //       id: 'routeLine',
    //       type: 'line',
    //       source: 'route',
    //       layout: {
    //         'line-cap': 'round',
    //         'line-join': 'round',
    //       },
    //       paint: {
    //         'line-color': '#02fa1b',
    //         'line-width': 7,
    //       },
    //     })
    //     // 🔍 Fit bounds
    //     const bounds = new (window as any).vietmapgl.LngLatBounds()
    //     decoded.forEach(([lat, lng]) => {
    //       bounds.extend([lng, lat])
    //     })
    //     mapRef.current.fitBounds(bounds, {
    //       padding: 50,
    //       maxZoom: 17,
    //       duration: 1000,
    //     })
    //     console.log('🛣️ Vẽ route thành công!')
    //   } catch (err) {
    //     console.error('❌ Lỗi khi fetch hoặc vẽ route:', err)
    //   }
    // }

    // fetchRouteAndDraw()

    const start = `${fastShip[0].lat},${fastShip[0].lng}`;
    const end = `${fastShip[1].lat},${fastShip[1].lng}`;
    const animationDuration = 4000; // Thời gian animation (ms), ví dụ 4 giây

    const fetchRouteAndDraw = async () => {
      try {
        const res = await fetchRouteVietMap(start, end);
        if (!res.data.paths || res.data.paths.length === 0) {
          console.error('❌ No route found');
          return;
        }
        const encoded = res.data.paths[0].points;
        const decodedLatLng = polyline.decode(encoded); // Mảng [lat, lng]
        routeCoordinates.current = decodedLatLng.map(([lat, lng]) => [lng, lat]); // Đảo ngược thành [lng, lat] cho GeoJSON

        setDistance(res.data.paths[0].distance);

        // Convert thành GeoJSON LineString cho route chính
        const mainRouteGeoJson = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates.current,
          },
        };

        // --- Vẽ Route Chính (Màu xanh lá cây) ---
        // Xoá source/layer cũ nếu có
        if (mapRef.current.getLayer('routeLine')) {
          mapRef.current.removeLayer('routeLine');
        }
        if (mapRef.current.getLayer('animatedRouteLine')) { // Xóa cả layer animation cũ
          mapRef.current.removeLayer('animatedRouteLine');
        }
        if (mapRef.current.getSource('route')) {
          mapRef.current.removeSource('route');
        }
        if (mapRef.current.getSource('animatedRoute')) { // Xóa cả source animation cũ
          mapRef.current.removeSource('animatedRoute');
        }
        // Hủy animation cũ nếu đang chạy
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }


        // Thêm source và layer cho route chính
        mapRef.current.addSource('route', {
          type: 'geojson',
          data: mainRouteGeoJson,
        });
        mapRef.current.addLayer({
          id: 'routeLine',
          type: 'line',
          source: 'route',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#b0ecf5',
            'line-width': 7,
            'line-opacity': 1 // Có thể giảm độ mờ để thấy rõ animation hơn
          },
        });

        // --- Chuẩn bị cho Animation ---
        const animatedRouteGeoJson = { // Source cho animation, bắt đầu rỗng
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates.current.length > 0 ? [routeCoordinates.current[0]] : [] // Bắt đầu từ điểm đầu tiên
          }
        };

        mapRef.current.addSource('animatedRoute', {
          type: 'geojson',
          data: animatedRouteGeoJson
        });

        mapRef.current.addLayer({
          id: 'animatedRouteLine',
          type: 'line',
          source: 'animatedRoute',
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            // 'line-color': '#00de21',
            'line-color': '#1e7e8c',
            'line-width': 10,
            'line-opacity': 1
          }
        }, 'routeLine'); // Vẽ layer animation *trước* layer route chính (hoặc sau tùy ý)

        // --- Bắt đầu Animation ---
        animationStartTime.current = performance.now(); // Sử dụng performance.now() cho độ chính xác cao hơn Date.now()
        animateLine();

        // --- Fit Bounds ---
        const bounds = new (window as any).vietmapgl.LngLatBounds();
        routeCoordinates.current.forEach((coord) => {
          bounds.extend(coord);
        });
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 17,
          duration: 1000,
        });

      } catch (err) {
        console.error('❌ Lỗi khi fetch hoặc vẽ route:', err);
      }
    };

    const animateLine = (timestamp?: number) => {
      // --- Phần kiểm tra ban đầu giữ nguyên ---
      if (!mapRef.current || !routeCoordinates.current || routeCoordinates.current.length < 2) {
        console.warn("Animation stopped: Map or route data not ready.");
        animationFrameId.current = null; // Đảm bảo dừng hẳn nếu có lỗi dữ liệu
        animationStartTime.current = null;
        return;
      }

      // Khởi tạo thời gian bắt đầu nếu chưa có (cho lần chạy đầu tiên)
      if (!animationStartTime.current) {
        animationStartTime.current = timestamp || performance.now();
      }

      const currentTimestamp = timestamp || performance.now();
      let elapsed = currentTimestamp - animationStartTime.current;
      let progress = elapsed / animationDuration;

      // --- Logic Lặp lại ---
      if (progress >= 1) {
        // Đã đi hết 1 vòng, reset để bắt đầu vòng mới
        //   console.log('✅ Animation loop completed, restarting...'); // Có thể bỏ log này nếu không muốn thấy liên tục
        const remainder = elapsed % animationDuration; // Tính phần dư thời gian để vòng lặp mượt hơn
        animationStartTime.current = currentTimestamp - remainder; // Reset startTime dựa trên phần dư
        progress = remainder / animationDuration; // Tính lại progress cho frame hiện tại dựa trên phần dư
        elapsed = remainder; // Cập nhật elapsed cho đúng

        // Nếu muốn nhảy ngay về 0 thay vì tính phần dư:
        // animationStartTime.current = currentTimestamp;
        // progress = 0;
      }
      // Đảm bảo progress không bao giờ lớn hơn 1 (quan trọng khi tính toán index)
      progress = Math.min(progress, 1);


      // --- Phần tính toán và cập nhật setData giữ nguyên ---
      const targetIndex = Math.floor(progress * (routeCoordinates.current.length - 1));
      const currentPathSegment = routeCoordinates.current.slice(0, targetIndex + 1);

      // Log (tùy chọn, có thể xóa bớt để tránh spam console)
      // console.log(`Animating Frame - Progress: ${progress.toFixed(2)}, Points: ${currentPathSegment.length}`);


      // Cập nhật source của layer animation
      const animatedSource = mapRef.current.getSource('animatedRoute');
      if (animatedSource && typeof animatedSource.setData === 'function') {
        animatedSource.setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: currentPathSegment.length < 2 ? (currentPathSegment.length === 1 ? [currentPathSegment[0], currentPathSegment[0]] : []) : currentPathSegment
          }
        });
      } else {
        // Chỉ log cảnh báo một lần thôi để tránh spam
        if (!(window as any).animatedSourceWarned) {
          console.warn("Animated source/setData not available.");
          (window as any).animatedSourceWarned = true; // Đánh dấu đã cảnh báo
        }
      }

      animationFrameId.current = requestAnimationFrame(animateLine);
    };

    fetchRouteAndDraw();

    // Cleanup function khi component unmount hoặc dependency thay đổi
    return () => {
      console.log("Cleaning up animation frame (Looping)");
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      animationStartTime.current = null; // Reset cả startTime
      (window as any).animatedSourceWarned = false; // Reset cờ cảnh báo

      // Cũng nên xóa các layer/source đã thêm khi cleanup
      if (mapRef.current) {
        if (mapRef.current.getLayer('routeLine')) mapRef.current.removeLayer('routeLine');
        if (mapRef.current.getLayer('animatedRouteLine')) mapRef.current.removeLayer('animatedRouteLine');
        if (mapRef.current.getSource('route')) mapRef.current.removeSource('route');
        if (mapRef.current.getSource('animatedRoute')) mapRef.current.removeSource('animatedRoute');
      }
    };
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


  // tim list near shipper


  useEffect(() => {
    if (!mapRef.current || !nearShipper?.lat || !nearShipper?.lng) {
      return;
    }

    const vietmapgl = (window as any).vietmapgl;

    // Nếu đã có marker cũ thì remove
    if (markerRef.current?.nearShipperMarker) {
      markerRef.current.nearShipperMarker.remove();
      markerRef.current.nearShipperMarker = null; // Đặt lại tham chiếu
    }

    setNearListShipper([]);

    const markerElement = document.createElement('div');
    markerElement.style.width = '65px'; // Kích thước marker
    markerElement.style.height = '65px';
    markerElement.style.backgroundImage = 'url(/images/map/vitrishipper.png)'; // Icon ghim bản đồ
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
    avatarElement.src = '/images/shipper2.png';
    avatarElement.style.width = '40px'; // Kích thước avatar
    avatarElement.style.height = '40px';
    avatarElement.style.borderRadius = '50%'; // Hình tròn cho avatar
    avatarElement.style.objectFit = 'cover'; // Đảm bảo ảnh không méo
    avatarElement.style.position = 'absolute';
    avatarElement.style.top = '5px'; // Đẩy avatar lên trên để nằm trong phần hình tròn của ghim
    avatarElement.style.left = '50%';
    avatarElement.style.transform = 'translateX(-50%)'; // Căn giữa theo chiều ngang
    markerElement.appendChild(avatarElement);
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

    // Bắt đầu logic vẽ route nếu có fastShip[0]
    if (fastShip[0]?.lat && fastShip[0]?.lng) {
      // const start = `${nearShipper.lat},${nearShipper.lng}`;
      // const end = `${fastShip[0].lat},${fastShip[0].lng}`;

      // const fetchRouteAndDraw = async () => {
      //   try {
      //     const res = await fetchRouteVietMap(start, end);
      //     if (!res?.data?.paths || res.data.paths.length === 0) {
      //       console.warn('⚠️ Không tìm thấy đường đi.');
      //       return;
      //     }
      //     const encoded = res.data.paths[0].points;
      //     const decoded = polyline.decode(encoded); // Trả về mảng [lat, lng]
      //     setDistance(res.data.paths[0].distance);

      //     // Convert thành GeoJSON LineString
      //     const geoJson = {
      //       type: 'Feature',
      //       geometry: {
      //         type: 'LineString',
      //         coordinates: decoded.map(([lat, lng]) => [lng, lat]), // Đảo ngược lat/lng
      //       },
      //     };
      //     const routeSourceId = `route-1`;
      //     const routeLayerId = `routeLine-1`;
      //     // Xoá source/line cũ nếu có
      //     if (mapRef.current.getLayer(routeLayerId)) {
      //       mapRef.current.removeLayer(routeLayerId);
      //     }
      //     if (mapRef.current.getSource(routeSourceId)) {
      //       mapRef.current.removeSource(routeSourceId);
      //     }

      //     mapRef.current.addSource(routeSourceId, {
      //       type: 'geojson',
      //       data: geoJson,
      //     });

      //     mapRef.current.addLayer({
      //       id: routeLayerId,
      //       type: 'line',
      //       source: routeSourceId,
      //       layout: {
      //         'line-cap': 'round',
      //         'line-join': 'round',
      //       },
      //       paint: {
      //         'line-color': '#ff7f20',
      //         'line-width': 5,
      //       },
      //     });
      //     // di chuyen routeLine len routeLayerId
      //     if (mapRef.current.getLayer('routeLine') && mapRef.current.getLayer(routeLayerId)) {
      //       mapRef.current.moveLayer('routeLine', routeLayerId);
      //     }
      //     console.log('Thứ tự layer sau khi thêm và di chuyển:', mapRef.current.getStyle().layers.map((layer:any) => layer.id));
      //     // 🔍 Fit bounds để hiển thị cả điểm đầu và cuối của route
      //     const bounds = new (window as any).vietmapgl.LngLatBounds();
      //     bounds.extend([nearShipper.lng, nearShipper.lat]);
      //     bounds.extend([fastShip[0].lng, fastShip[0].lat]);
      //     decoded.forEach(([lat, lng]) => {
      //       bounds.extend([lng, lat]);
      //     });
      //     mapRef.current.fitBounds(bounds, {
      //       padding: 50,
      //       maxZoom: 17,
      //       duration: 1000,
      //     });
      //     console.log('🛣️ Vẽ route thành công!');
      //   } catch (err) {
      //     console.error('❌ Lỗi khi fetch hoặc vẽ route:', err);
      //   }
      // };

      // fetchRouteAndDraw();
      const routeSourceId = `route-1`;
      const routeLayerId = `routeLine-1`;
      const start = `${nearShipper.lat},${nearShipper.lng}`;
      const end = `${fastShip[0].lat},${fastShip[0].lng}`;
      const animationDuration = 4000; // Thời gian animation (ms), ví dụ 4 giây

      const fetchRouteAndDraw = async () => {
        try {
          const res = await fetchRouteVietMap(start, end);
          if (!res.data.paths || res.data.paths.length === 0) {
            console.error('❌ No route found');
            return;
          }
          const encoded = res.data.paths[0].points;
          const decodedLatLng = polyline.decode(encoded); // Mảng [lat, lng]
          routeCoordinatesShip.current = decodedLatLng.map(([lat, lng]) => [lng, lat]); // Đảo ngược thành [lng, lat] cho GeoJSON

          setDistance(res.data.paths[0].distance);

          // Convert thành GeoJSON LineString cho route chính
          const mainRouteGeoJson = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinatesShip.current,
            },
          };

          // --- Vẽ Route Chính (Màu xanh lá cây) ---
          // Xoá source/layer cũ nếu có
          if (mapRef.current.getLayer(routeLayerId)) {
            mapRef.current.removeLayer(routeLayerId);
          }
          if (mapRef.current.getLayer('animatedRouteLine-1')) { // Xóa cả layer animation cũ
            mapRef.current.removeLayer('animatedRouteLine-1');
          }
          if (mapRef.current.getSource(routeSourceId)) {
            mapRef.current.removeSource(routeSourceId);
          }
          if (mapRef.current.getSource('animatedRoute-1')) { // Xóa cả source animation cũ
            mapRef.current.removeSource('animatedRoute-1');
          }
          // // Hủy animation cũ nếu đang chạy
          if (animationFrameShipId.current) {
            cancelAnimationFrame(animationFrameShipId.current);
            animationFrameShipId.current = null;
          }


          // Thêm source và layer cho route chính
          mapRef.current.addSource(routeSourceId, {
            type: 'geojson',
            data: mainRouteGeoJson,
          });
          mapRef.current.addLayer({
            id: routeLayerId,
            type: 'line',
            source: routeSourceId,
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#f5b17f',
              'line-width': 5,
              'line-opacity': 0.5 // Có thể giảm độ mờ để thấy rõ animation hơn
            },
          });

          // --- Chuẩn bị cho Animation ---
          const animatedRouteGeoJson = { // Source cho animation, bắt đầu rỗng
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinatesShip.current.length > 0 ? [routeCoordinatesShip.current[0]] : [] // Bắt đầu từ điểm đầu tiên
            }
          };

          mapRef.current.addSource('animatedRoute-1', {
            type: 'geojson',
            data: animatedRouteGeoJson
          });

          mapRef.current.addLayer({
            id: 'animatedRouteLine-1',
            type: 'line',
            source: 'animatedRoute-1',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              // 'line-color': '#00de21',
              'line-color': '#ff7f20',
              'line-width': 7,
              'line-opacity': 0.5
            }
          }, routeLayerId); // Vẽ layer animation *trước* layer route chính (hoặc sau tùy ý)

          // --- Bắt đầu Animation ---
          animationStartTimeShip.current = performance.now(); // Sử dụng performance.now() cho độ chính xác cao hơn Date.now()
          animateLine();

          // --- Fit Bounds ---
          const bounds = new (window as any).vietmapgl.LngLatBounds();
          routeCoordinatesShip.current.forEach((coord) => {
            bounds.extend(coord);
          });
          mapRef.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 17,
            duration: 1000,
          });

        } catch (err) {
          console.error('❌ Lỗi khi fetch hoặc vẽ route:', err);
        }
      };

      const animateLine = (timestamp?: number) => {
        // --- Phần kiểm tra ban đầu giữ nguyên ---
        if (!mapRef.current || !routeCoordinatesShip.current || routeCoordinatesShip.current.length < 2) {
          console.warn("Animation stopped: Map or route data not ready.");
          animationFrameShipId.current = null; // Đảm bảo dừng hẳn nếu có lỗi dữ liệu
          animationStartTimeShip.current = null;
          return;
        }

        // Khởi tạo thời gian bắt đầu nếu chưa có (cho lần chạy đầu tiên)
        if (!animationStartTimeShip.current) {
          animationStartTimeShip.current = timestamp || performance.now();
        }

        const currentTimestamp = timestamp || performance.now();
        let elapsed = currentTimestamp - animationStartTimeShip.current;
        let progress = elapsed / animationDuration;

        // --- Logic Lặp lại ---
        if (progress >= 1) {
          // Đã đi hết 1 vòng, reset để bắt đầu vòng mới
          //   console.log('✅ Animation loop completed, restarting...'); // Có thể bỏ log này nếu không muốn thấy liên tục
          const remainder = elapsed % animationDuration; // Tính phần dư thời gian để vòng lặp mượt hơn
          animationStartTime.current = currentTimestamp - remainder; // Reset startTime dựa trên phần dư
          progress = remainder / animationDuration; // Tính lại progress cho frame hiện tại dựa trên phần dư
          elapsed = remainder; // Cập nhật elapsed cho đúng

          // Nếu muốn nhảy ngay về 0 thay vì tính phần dư:
          // animationStartTime.current = currentTimestamp;
          // progress = 0;
        }
        // Đảm bảo progress không bao giờ lớn hơn 1 (quan trọng khi tính toán index)
        progress = Math.min(progress, 1);


        // --- Phần tính toán và cập nhật setData giữ nguyên ---
        const targetIndex = Math.floor(progress * (routeCoordinatesShip.current.length - 1));
        const currentPathSegment = routeCoordinatesShip.current.slice(0, targetIndex + 1);

        // Log (tùy chọn, có thể xóa bớt để tránh spam console)
        // console.log(`Animating Frame - Progress: ${progress.toFixed(2)}, Points: ${currentPathSegment.length}`);


        // Cập nhật source của layer animation
        const animatedSource = mapRef.current.getSource('animatedRoute-1');
        if (animatedSource && typeof animatedSource.setData === 'function') {
          animatedSource.setData({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: currentPathSegment.length < 2 ? (currentPathSegment.length === 1 ? [currentPathSegment[0], currentPathSegment[0]] : []) : currentPathSegment
            }
          });
        } else {
          // Chỉ log cảnh báo một lần thôi để tránh spam
          if (!(window as any).animatedSourceWarned) {
            console.warn("Animated source/setData not available.");
            (window as any).animatedSourceWarned = true; // Đánh dấu đã cảnh báo
          }
        }

        animationFrameShipId.current = requestAnimationFrame(animateLine);
      };

      fetchRouteAndDraw();

      // Cleanup function khi component unmount hoặc dependency thay đổi
      return () => {
        console.log("Cleaning up animation frame (Looping)");
        if (animationFrameShipId.current) {
          cancelAnimationFrame(animationFrameShipId.current);
          animationFrameShipId.current = null;
        }
        animationStartTimeShip.current = null; // Reset cả startTime
        (window as any).animatedSourceWarned = false; // Reset cờ cảnh báo

        // Cũng nên xóa các layer/source đã thêm khi cleanup
        if (mapRef.current) {
          if (mapRef.current.getLayer(routeLayerId)) mapRef.current.removeLayer(routeLayerId);
          if (mapRef.current.getLayer('animatedRouteLine-1')) mapRef.current.removeLayer('animatedRouteLine-1');
          if (mapRef.current.getSource(routeSourceId)) mapRef.current.removeSource(routeSourceId);
          if (mapRef.current.getSource('animatedRoute-1')) mapRef.current.removeSource('animatedRoute-1');
        }
      };


    } else {
      // Xoá route cũ nếu fastShip[0] không còn tồn tại
      if (mapRef.current.getLayer('routeLine')) {
        mapRef.current.removeLayer('routeLine');
      }
      if (mapRef.current.getSource('route')) {
        mapRef.current.removeSource('route');
      }
    }
  }, [nearShipper])

  useEffect(() => {
    const vietmapgl = (window as any).vietmapgl;
    // console.log("get near list ship", nearListShipper)
    // Xóa các marker shipper cũ
    shipperMarkersRef.current.forEach((marker) => marker.remove());
    shipperMarkersRef.current = []; // Reset mảng lưu trữ marker
    // Tạo marker cho từng shipper trong danh sách
    nearListShipper.forEach((shipperLocation) => {
      // Tạo phần tử HTML tùy chỉnh cho marker
      const shipperMarkerElement = document.createElement('div');
      shipperMarkerElement.style.width = '65px'; // Kích thước marker
      shipperMarkerElement.style.height = '65px';
      shipperMarkerElement.style.backgroundImage = 'url(/images/map/vitrishipper.png)'; // Icon ghim bản đồ
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
      avatarElement.style.width = '40px'; // Kích thước avatar
      avatarElement.style.height = '40px';
      avatarElement.style.borderRadius = '50%'; // Hình tròn cho avatar
      avatarElement.style.objectFit = 'cover'; // Đảm bảo ảnh không méo
      avatarElement.style.position = 'absolute';
      avatarElement.style.top = '5px'; // Đẩy avatar lên trên để nằm trong phần hình tròn của ghim
      avatarElement.style.left = '50%';
      avatarElement.style.transform = 'translateX(-50%)'; // Căn giữa theo chiều ngang
      shipperMarkerElement.appendChild(avatarElement);


      const shipperMarker = new vietmapgl.Marker({
        element: shipperMarkerElement,
        anchor: 'center',
      })
        .setLngLat([shipperLocation.lng, shipperLocation.lat])
        .addTo(mapRef.current);


      // Tạo popup
      const popup = new vietmapgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
      }).setHTML(
        `<div class="bg-black text-orange-500 font-bold text-center max-w-[200px]">${shipperLocation.email || 'Không có tên'
        }</div>`
      );
      // Sự kiện hover để hiển thị popup
      shipperMarkerElement.addEventListener('mouseenter', () => {
        // Gắn popup vào marker và hiển thị
        popup.setLngLat([shipperLocation.lng, shipperLocation.lat]).addTo(mapRef.current);
      });

      // Sự kiện rời chuột để ẩn popup
      shipperMarkerElement.addEventListener('mouseleave', () => {
        popup.remove();
      });

      shipperMarkersRef.current.push(shipperMarker); // Lưu trữ marker mới
    });
  }, [nearListShipper]);


  const markStoreInMap = (listStore: any[]) => {
    const vietmapgl = (window as any).vietmapgl;
    // console.log("get near list ship", nearListShipper)
    // Xóa các marker shipper cũ
    storeMarkerRef.current.forEach((marker) => marker.remove());
    storeMarkerRef.current = []; // Reset mảng lưu trữ marker
    // Tạo marker cho từng shipper trong danh sách
    listStore.forEach((storeLocation) => {
      // Tạo phần tử HTML tùy chỉnh cho marker
      const storeMarkerElement = document.createElement('div');
      storeMarkerElement.style.width = '65px'; // Kích thước marker
      storeMarkerElement.style.height = '65px';
      storeMarkerElement.style.backgroundImage = 'url(/images/map/vitricuahang.png)'; // Icon ghim bản đồ
      storeMarkerElement.style.backgroundSize = 'contain';
      storeMarkerElement.style.backgroundRepeat = 'no-repeat';
      storeMarkerElement.style.backgroundPosition = 'center';
      storeMarkerElement.style.cursor = 'pointer';
      storeMarkerElement.style.display = 'flex'; // Để căn giữa avatar
      storeMarkerElement.style.alignItems = 'center';
      storeMarkerElement.style.justifyContent = 'center';

      // Tạo phần tử ảnh avatar
      const avatarElement = document.createElement('img');
      avatarElement.src = '/images/map/store1.png';
      avatarElement.style.width = '40px'; // Kích thước avatar
      avatarElement.style.height = '40px';
      avatarElement.style.borderRadius = '50%'; // Hình tròn cho avatar
      avatarElement.style.objectFit = 'cover'; // Đảm bảo ảnh không méo
      avatarElement.style.position = 'absolute';
      avatarElement.style.top = '5px'; // Đẩy avatar lên trên để nằm trong phần hình tròn của ghim
      avatarElement.style.left = '50%';
      avatarElement.style.transform = 'translateX(-50%)'; // Căn giữa theo chiều ngang
      storeMarkerElement.appendChild(avatarElement);


      const storeMarker = new vietmapgl.Marker({
        element: storeMarkerElement,
        anchor: 'center',
      })
        .setLngLat([storeLocation.lng, storeLocation.lat])
        .addTo(mapRef.current);

      // Tạo popup
      const popup = new vietmapgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
      }).setHTML(
        `<div class=" text-orange-500 font-bold text-center max-w-[200px]">${storeLocation.storeName || 'Không có tên'
        }</div>`
      );
      // Sự kiện hover để hiển thị popup
      storeMarkerElement.addEventListener('mouseenter', () => {
        // Gắn popup vào marker và hiển thị
        popup.setLngLat([storeLocation.lng, storeLocation.lat]).addTo(mapRef.current);
      });

      // Sự kiện rời chuột để ẩn popup
      storeMarkerElement.addEventListener('mouseleave', () => {
        popup.remove();
      });

      // Sự kiện click để chuyển hướng đến URL
      storeMarkerElement.addEventListener('click', () => {
        const storeUrl = `/store/${storeLocation.id}`;
        window.open(storeUrl, '_blank');
      });
      storeMarkerRef.current.push(storeMarker); // Lưu trữ marker mới
    });
  }


  /// lay vi tri near shipper ban dau so voi userlocation
  return (
    <div className="relative w-full flex-1 text-white flex flex-col  overflow-hidden">
      {/* Header Tìm kiếm */}
      <div className="absolute top-4 left-4 right-4 z-10 ">
        <div className="bg-black/70 backdrop-blur-md shadow-md px-4 py-2 flex items-center">
          <span className="font-bold text-xl text-white  border-r pr-4">snapgo.vn</span>
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
      <div ref={mapContainer} className="w-full flex-1" />
      
      {/* Nút thay đổi kích thước */}
      <div  className="w-full bg-white h-[150px]" />
      {/* Thẻ hỏi nhập nhận đơn hàng nhanh */}
      {openCard.fastShip &&
        (<TypeFastShip setNearShipper={setNearShipper} fastShip={fastShip} mapRef={mapRef} setFastShip={setFastShip} setOpenCard={setOpenCard} openCard={openCard} userLocation={userLocation} distance={distance} />)
      }
    </div>
  )
}
