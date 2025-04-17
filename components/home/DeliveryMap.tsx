'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function DeliveryMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const vietMapToken = process.env.NEXT_PUBLIC_VIETMAP_TOKEN
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return
    const vietmapgl = (window as any).vietmapgl
    if (!vietmapgl) return

    // Clear old map if any
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    console.log('✅ Creating map...')

    mapRef.current = new vietmapgl.Map({
      container: mapContainer.current,
      style: `https://maps.vietmap.vn/mt/tm/style.json?apikey=${vietMapToken}`,
      center: userLocation,
      zoom: 12,
    })

    new vietmapgl.Marker()
      .setLngLat(userLocation)
      .addTo(mapRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [userLocation])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([longitude, latitude])
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  return (
    <div className="w-full h-full bg-gray-100 lg:ml-72">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
