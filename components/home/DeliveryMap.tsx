'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function DeliveryMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const vietMapToken = process.env.NEXT_PUBLIC_VIETMAP_TOKEN
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

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

  // Khởi tạo map lần đầu
  useEffect(() => {
    if (!mapContainer.current || !userLocation) return

    const vietmapgl = (window as any).vietmapgl
    if (!vietmapgl) return

    // ✅ Nếu đã có map thì chỉ update center và marker, KHÔNG tạo lại
    if (mapRef.current) return

    console.log('✅ Creating map...')

    mapRef.current = new vietmapgl.Map({
      container: mapContainer.current,
      style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${vietMapToken}`,
      center: userLocation,
      zoom: 15,
    })

    markerRef.current = new vietmapgl.Marker()
      .setLngLat(userLocation)
      .addTo(mapRef.current)

    // ❗ KHÔNG remove map ở đây nữa, vì ta chỉ muốn khởi tạo 1 lần duy nhất
  }, [userLocation])

  useEffect(() => {
    if (!userLocation || !markerRef.current || !mapRef.current) return

    markerRef.current.setLngLat(userLocation)
    mapRef.current.setCenter(userLocation)
  }, [userLocation])
  return (
    <div className="w-full h-full bg-gray-100 lg:ml-72">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
