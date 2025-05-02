"use client";

import { useSearchParams } from 'next/navigation';
import React from 'react';
import AddProduct from '../admin/product/AddProduct';
import AppHeader from '@/layout/AppHeader';
import AddProductNew from '../admin/product/AddProdutNew';

export default function AddVideoHome() {
    const searchParams = useSearchParams();
    const videoUrl = searchParams.get('videoUrl') || "";
    return (
        <div>
            <AddProductNew videoUrl={videoUrl}/>
        </div>
    );
}