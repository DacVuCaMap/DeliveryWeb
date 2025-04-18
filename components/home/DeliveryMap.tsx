'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDownUp, ArrowRightLeft, X } from 'lucide-react';
import TypeFastShip from './delivery/TypeFastShip';
import axios from 'axios';
import polyline from '@mapbox/polyline'
type Opencard = {
  bottomCard: boolean;
  fastShip: boolean;
}
type Location = {
  lat: number | null;
  lng: number | null;
}
export default function DeliveryMap() {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0], [1, 0.8]);
  const [openCard, setOpenCard] = useState<Opencard>({ bottomCard: false, fastShip: true });
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const vietMapToken = process.env.NEXT_PUBLIC_VIETMAP_TOKEN
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [fastShip, setFastShip] = useState<Location[]>([]);
  const hasFlownToUserRef = useRef(false)
  const fastShipMarkerRef = useRef<any>([]);
  // Khởi tạo bản đồ NGAY từ đầu
  useEffect(() => {
    const vietmapgl = (window as any).vietmapgl
    if (!mapContainer.current || !vietmapgl || mapRef.current) return

    console.log('✅ Creating map...')
    const defaultCenter: [number, number] = [105.8544441, 21.028511] // Hà Nội

    mapRef.current = new vietmapgl.Map({
      container: mapContainer.current,
      style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${vietMapToken}`,
      center: defaultCenter,
      zoom: 15,
    })

    markerRef.current = new vietmapgl.Marker().setLngLat(defaultCenter).addTo(mapRef.current)
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
    if (!userLocation || !mapRef.current || !markerRef.current) return

    // Cập nhật marker vị trí người dùng
    markerRef.current.setLngLat(userLocation)

    // Chỉ flyTo khi chưa từng thực hiện
    if (!hasFlownToUserRef.current) {
      mapRef.current.flyTo({ center: userLocation })
      hasFlownToUserRef.current = true
    }
  }, [userLocation])

  // useEffect(() => {
  //   if (!mapRef.current || fastShip.length === 0) return

  //   const vietmapgl = (window as any).vietmapgl

  //   // Xoá các marker cũ (nếu có)
  //   fastShipMarkerRef.current.forEach((marker: any) => marker.remove())
  //   fastShipMarkerRef.current = []

  //   // Tạo lại các marker mới từ fastShip
  //   fastShip.forEach((location) => {
  //     if (location.lat !== null && location.lng !== null) {
  //       const newMarker = new vietmapgl.Marker({ color: '#f97316' }) // màu cam
  //         .setLngLat([location.lng, location.lat])
  //         .addTo(mapRef.current)

  //       fastShipMarkerRef.current.push(newMarker)
  //     }
  //   })
  // }, [fastShip])
  useEffect(() => {
    if (!mapRef.current || fastShip.length === 0) return

    const vietmapgl = (window as any).vietmapgl

    // Xoá các marker cũ
    fastShipMarkerRef.current.forEach((marker: any) => marker.remove())
    fastShipMarkerRef.current = []

    fastShip.forEach((location, index) => {
      if (location.lat != null && location.lng != null) {
        // Tạo custom DOM element cho marker
        const el = document.createElement('div')
        el.className = 'custom-marker'
        el.style.width = '32px'
        el.style.height = '32px'
        el.style.backgroundSize = 'cover'

        if (location !=userLocation) {
          if (index === 0) {
            // Marker bắt đầu
            el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/684/684908.png)' // icon đơn hàng bắt đầu (xe máy)
          } else if (index === 1) {
            // Marker kết thúc
            el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/953/953803.png)' // icon đích đến (cờ đích)
          }
        }
        const marker = new vietmapgl.Marker({ element: el })
          .setLngLat([location.lng, location.lat])
          .addTo(mapRef.current)

        fastShipMarkerRef.current.push(marker)
      }
    })

    if (!mapRef.current || !fastShip[0] || !fastShip[1]) return

    const start = `${fastShip[0].lat},${fastShip[0].lng}`
    const end = `${fastShip[1].lat},${fastShip[1].lng}`
    const url = `https://maps.vietmap.vn/api/route?api-version=1.1&apikey=${vietMapToken}&point=${start}&point=${end}&vehicle=bike`
    console.log(url);

    const fetchRouteAndDraw = async () => {
      try {
        const res = await axios(url)
        const encoded = res.data.paths[0].points
        const decoded = polyline.decode(encoded) // Trả về mảng [lat, lng]

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
            'line-color': '#7602fa',
            'line-width': 4,
          },
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
  return (
    <div className="relative w-screen h-screen">
      {/* Header Tìm kiếm */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white shadow-md px-4 py-2 flex items-center">
          <span className="font-bold text-xl dark:text-white text-orange-600 border-r pr-4">snapgo.vn</span>
          <input
            type="text"
            placeholder="Tìm kiếm ở đây"
            className=" flex-1 bg-transparent outline-none px-4"
          />
          <button onClick={e => setOpenCard({ ...openCard, fastShip: true })} className="px-4 bg-orange-500 rounded-xl text-white py-1 text-xs">
            Tìm shipper ngay
          </button>
          <div className="ml-2 w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Bản đồ */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Thẻ hỏi nhập nhận đơn hàng nhanh */}
      {openCard.fastShip &&
        (<TypeFastShip setFastShip={setFastShip} setOpenCard={setOpenCard} openCard={openCard} userLocation={userLocation} />)
      }

      {/* Thẻ trắng bên dưới */}

      {openCard.bottomCard &&
        (<motion.div
          drag="y"
          dragConstraints={{ top: -300, bottom: 0 }}
          style={{ y, opacity }}
          className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-lg p-4 pb-64"
        >
          <div className="w-12 h-1.5 bg-gray-400 mx-auto rounded-full mb-4" />
          <h2 className="text-lg font-semibold">Mỹ Đình 2</h2>
          <p className="text-gray-500">Địa điểm mang tính biểu tượng</p>
          <div className="mt-2 flex space-x-2 overflow-x-auto">
            {/* Ảnh ví dụ */}
            <div className="w-32 h-20 bg-gray-200 rounded-xl shrink-0" />
            <div className="w-32 h-20 bg-gray-200 rounded-xl shrink-0" />
            <div className="w-32 h-20 bg-gray-200 rounded-xl shrink-0" />
          </div>
        </motion.div>)
      }
    </div>
  )
}
