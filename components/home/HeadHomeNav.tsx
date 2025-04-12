"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Home, MessageCircle, PlusSquare, Search } from 'lucide-react'

export default function HeadHomeNav() {
    return (
        <div className="fixed lg:hidden top-0 w-screen text-gray-300 flex flex-row justify-around items-center z-50 py-4">
            <button className="flex flex-col items-center ">
                <span>Shipper</span>
            </button>
            <button className="flex flex-col items-center ">
                <span>Đã follow</span>
            </button>
            <button className="flex flex-col items-center border-b-2 border-white text-white">
                <span>Đề xuất</span>
            </button>
            <button className='text-white'>
                <Search />
            </button>
        </div>
    )
}
