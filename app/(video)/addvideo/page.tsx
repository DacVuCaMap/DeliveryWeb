import AddVideoHome from '@/components/home/AddVideoHome'
import CameraRecordButton from '@/components/home/CameraRecordButton'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddVideoHome />
    </Suspense>
  )
}
