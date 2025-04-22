'use client'

import { useEffect, useRef } from 'react'
import axios from 'axios'
import { useUser } from '@/context/userContext'
import { updateShipperLocation } from '@/utils/api'

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180
  const R = 6371e3 // Earth radius in meters
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in meters
}

export default function LocationTracker() {
  const { user } = useUser()
  const lastSentPosition = useRef<{ lat: number; lon: number } | null>(null)
  const lastSentTime = useRef<number>(0)

  useEffect(() => {
    if (!user || user.role !== 'SHIPPER') {
      return
    }

    if (!('geolocation' in navigator)) return

    const watcher = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const now = Date.now()
        const lastPos = lastSentPosition.current
        const lastTime = lastSentTime.current

        const dist = lastPos
          ? haversineDistance(lastPos.lat, lastPos.lon, latitude, longitude)
          : Infinity
        const timeElapsed = (now - lastTime) / 1000

        const shouldSend = dist > 150 || timeElapsed > 180

        if (shouldSend) {
          try {
            await updateShipperLocation({
              latitude,
              longitude,
              online: true,
              status: 0,
            })
            lastSentPosition.current = { lat: latitude, lon: longitude }
            lastSentTime.current = now
            console.log('[LocationTracker] Gửi vị trí:', latitude, longitude)
          } catch (err) {
            console.error('[LocationTracker] Lỗi gửi vị trí:', err)
          }
        }
      },
      (error) => {
        console.error('[LocationTracker] Lỗi định vị:', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      }
    )

    return () => navigator.geolocation.clearWatch(watcher)
  }, [user])

  return null
}