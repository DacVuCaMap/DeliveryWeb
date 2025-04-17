import { BottomNav } from '@/components/home/BottomNav'
import HeadHomeNav from '@/components/home/HeadHomeNav'
import { ThemeProvider } from '@/context/ThemeContext'
import React from 'react'
import Script from 'next/script'
export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col h-screen w-screen'>
            {/* Load VietMap scripts + styles ở đây */}
            <Script
                src="https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.js"
                strategy="beforeInteractive"
            />
            <link
                href="https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.css"
                rel="stylesheet"
            />
            <HeadHomeNav />
            <div className='flex-1 overflow-hidden lg:py-1'>
                {children}
            </div>
        </div>
    )
}
