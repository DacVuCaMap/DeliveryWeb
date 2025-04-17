// test/TestSocket.ts
import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export default function useShipperSocket(shipperId: string, lat: number, lng: number) {
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws-location') // đổi sang server của bạn
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    })

    client.onConnect = () => {
      console.log('✅ Connected WebSocket')
    }

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [])

  useEffect(() => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/location',
        body: JSON.stringify({ shipperId, lat, lng }),
      })
    }
  }, [lat, lng])
}
