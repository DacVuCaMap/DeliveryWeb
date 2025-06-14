import { BottomNav } from '@/components/home/BottomNav'
import HeadHomeNav from '@/components/home/HeadHomeNav'
import { ThemeProvider } from '@/context/ThemeContext'
import Script from 'next/script'
import React from 'react'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col '>
            <div className='min-h-screen flex flex-col'>
                {children}
                <div className='h-10 w-full '>
                    
                </div>
            </div>
            <BottomNav />
        </div>
    )
}
