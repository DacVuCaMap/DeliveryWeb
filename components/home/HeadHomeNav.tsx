"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Home, MessageCircle, PlusSquare } from 'lucide-react'

export default function HeadHomeNav() {
    return (
        <div className="fixed top-0 w-screen text-white flex justify-around items-center z-50">
            <Button variant="ghost" className="flex flex-col items-center text-white">
                <Home className="w-6 h-6" />
                <span className="text-xs">Home</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center text-white">
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs">Chat</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center text-white">
                <PlusSquare className="w-8 h-8" />
                <span className="text-xs">Map</span>
            </Button>
        </div>
    )
}
