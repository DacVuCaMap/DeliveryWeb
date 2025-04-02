import ComponentCard from '@/components/temp/common/ComponentCard'
import PageBreadcrumb from '@/components/temp/common/PageBreadCrumb'
import TableListUser from '@/components/usercomponent/TableListUser'
import UserTableCard from '@/components/usercomponent/UserTableCard';
import { dataUserListTitle } from '@/lib/dataAdmin';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "List Users",
    description: "This is Next.js",
};

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const title =  dataUserListTitle.find((item) => item.key ===slug)?.title;

    return (
        <div>
            <PageBreadcrumb pageTitle="Danh sách tài khoản" />
            <div className="space-y-6">
                <UserTableCard title={title || "Không có"}>
                    <TableListUser />
                </UserTableCard>
            </div>
        </div>
    );
}
