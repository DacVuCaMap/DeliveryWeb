import ComponentCard from '@/components/temp/common/ComponentCard'
import PageBreadcrumb from '@/components/temp/common/PageBreadCrumb'
import TableListUser from '@/components/usercomponent/TableListUser'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "List Users",
    description: "This is Next.js",
  };
  
export default function page({params}:{params : {slug:string}}) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách tài khoản" />
            <div className="space-y-6">
                <ComponentCard title={params.slug}>
                    <TableListUser />
                </ComponentCard>
            </div>
        </div>
    )
}
