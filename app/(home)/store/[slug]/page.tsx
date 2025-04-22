import StoreView from '@/components/home/store/StoreView'
import React from 'react'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return(<StoreView slug={slug}/>)
}
