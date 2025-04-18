'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDownUp, ArrowRightLeft, X } from 'lucide-react';
type Opencard = {
  bottomCard: boolean;
  fastShip: boolean;
}
export default function DeliveryMap() {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0], [1, 0.8]);
  const [openCard, setOpenCard] = useState<Opencard>({ bottomCard: false, fastShip: true });
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const vietMapToken = process.env.NEXT_PUBLIC_VIETMAP_TOKEN
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

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
          setUserLocation([longitude, latitude])
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

  // Cập nhật marker và center khi có userLocation
  useEffect(() => {
    if (!userLocation || !mapRef.current || !markerRef.current) return

    markerRef.current.setLngLat(userLocation)
    mapRef.current.flyTo({ center: userLocation })
  }, [userLocation])

  return (
    <div className="relative w-screen h-screen">
      {/* Header Tìm kiếm */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white shadow-md px-4 py-2 flex items-center">
          <span className="font-bold text-xl dark:text-white text-orange-600 border-r pr-4">snapgo.vn</span>
          <input
            type="text"
            placeholder="Tìm kiếm ở đây"
            className="w-full bg-transparent outline-none px-4"
          />
          <div className="ml-2 w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Bản đồ */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Thẻ hỏi nhập nhận đơn hàng nhanh */}
      {openCard.fastShip &&
        (<div className="absolute bottom-20 left-4 right-4 z-10">
          <div className="relative bg-white/60 backdrop-blur-md shadow-md px-6 py-4 flex flex-col gap-4">
            <button onClick={e=>setOpenCard({...openCard,fastShip:false})} className='absolute top-2 right-4'><X /></button>
            <span className="inline-block w-fit self-start bg-gray-600 text-white text-sm px-3 py-1 rounded-full">
              Đặt chuyến ship siêu tốc cho bạn
            </span>
            <div className='flex lg:flex-row flex-col items-center '>
              <div className='flex flex-col w-full'>
                <span className='text-gray-500'>Bạn hãy nhập địa chỉ đơn hàng bắt đầu</span>
                <input
                  type="text"
                  placeholder="Chọn địa chỉ nhận hàng"
                  className="bg-gray-200 rounded-sm px-6 py-2 outline-none w-full"
                />
              </div>
              <div className='px-20 lg:mt-6 lg:block hidden py-4'>
                <ArrowRightLeft />
              </div>
              <div className='px-20 lg:hidden py-4'>
                <ArrowDownUp />
              </div>
              <div className='flex flex-col w-full'>
                <span className='text-gray-500'>Bạn hãy nhập địa chỉ đơn hàng kết thúc</span>
                <input
                  type="text"
                  placeholder="Chọn địa chỉ nhận hàng"
                  className="bg-gray-200 rounded-sm px-6 py-2 outline-none w-full"
                />
              </div>
            </div>
            <button className='w-full bg-orange-500 rounded-xl text-white py-2'>
              Tìm ship ngay
            </button>
          </div>
        </div>)
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
