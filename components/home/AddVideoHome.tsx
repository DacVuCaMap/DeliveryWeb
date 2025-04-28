"use client";

import { useSearchParams } from 'next/navigation';
import React from 'react';
import AddProduct from '../admin/product/AddProduct';
import AppHeader from '@/layout/AppHeader';

export default function AddVideoHome() {
    const searchParams = useSearchParams();
    const videoUrl = searchParams.get('videoUrl') || "";
    return (
        <div>
            <div className='fixed top-0 left-0 h-20 bg-white  w-full flex items-center justify-center px-4 z-50'>
                <span className='text-orange-500 font-bold text-2xl'>snapgo.vn</span>
            </div>
            <AddProduct videoUrl={videoUrl} header={true}/>
        </div>
    );
}