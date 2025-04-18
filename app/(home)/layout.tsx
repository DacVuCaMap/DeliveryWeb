import { BottomNav } from '@/components/home/BottomNav'
import HeadHomeNav from '@/components/home/HeadHomeNav'
import { ThemeProvider } from '@/context/ThemeContext'
import Script from 'next/script'
import React from 'react'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col '>
            {/* Load VietMap scripts + styles ở đây */}
            <Script
                src="https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.js"
                strategy="beforeInteractive"
            />
            <link
                href="https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.css"
                rel="stylesheet"
            />
            <div className='flex-1 overflow-hidden'>
                {children}
            </div>

            <BottomNav />
        </div>
    )
}
