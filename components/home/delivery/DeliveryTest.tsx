'use client'

import React, { useEffect, useRef, useState } from 'react'
export default function DeliveryMap() {
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
            {/* Bản đồ */}
            <div ref={mapContainer} className="w-full h-full" />

        </div>
    )
}
