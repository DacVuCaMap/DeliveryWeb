"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Home, MessageCircle, PlusSquare, Search } from 'lucide-react'
import Image from 'next/image'

export default function HeadHomeNav() {
    return (
        <div>
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
            <div className="lg:fixed hidden top-4 left-2 lg:flex flex-col z-50 py-4 px-4 items-start gap-4 ">

                <div className="flex flex-row items-center justify-center gap-2">
                    <Image
                        className=""
                        src="/images/snapgo-logo1.png"
                        width={70}
                        height={70} alt={''} />
                    {/* <Image
                        className="hidden dark:block"
                        src="/images/logo/logo-icon.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                    /> */}
                    <span className="font-bold text-3xl dark:text-white text-orange-600">snapgo.vn</span>
                </div>
                <form className="max-w-md mx-auto">
                    <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Tìm kiếm</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 top-[3px] flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>

                        </div>
                        <input type="search" id="default-search" className="block w-full px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm" required />
                    </div>
                </form>
                <button className="border-b-2 border-black text-black dark:border-white dark:text-white font-bold">
                    <span>Đề xuất</span>
                </button>
                <button className="text-gray-500">
                    <span>Đã follow</span>
                </button>
                <button className="text-gray-500">
                    <span>Shipper</span>
                </button>

            </div>
        </div>
    )
}
