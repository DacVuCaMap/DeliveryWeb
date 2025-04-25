"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, MessageSquare, Settings, Inbox, PackageOpen, Truck, Star, History, Heart, Store, ListRestart, Bike, LogOut, Zap, Package2, Rocket } from "lucide-react";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";
import { logoutUser } from "@/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
type SelectOption = {
    id: number;
    icon: React.ReactNode | null; // Giả định rằng <Inbox />, <PackageOpen />, v.v. là các React Node
    name: string;
    childTab: any[];
}

type TabItem = {
    id: string;
    selects: SelectOption[];
    label: string;
}
type Props = {
    data: TabItem
}
export default function SelectProfile(props: Props) {
    const [selectTab, setSelectTab] = useState<SelectOption>(props.data.selects[0])
    return (
        <div>

            {/* Đơn mua */}
            <Card className="rounded-none bg-black/10 border-none text-white p-2 pb-6 ">
                <CardContent>
                    <h3 className="font-medium mb-4">{props.data.label}</h3>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs ">
                        {props.data.selects.map(item => (
                            <button onClick={e => setSelectTab(item)} key={item.id} className={`${selectTab.id === item.id ? "text-orange-500" : ""} flex flex-col items-center justify-center gap-2 hover:text-orange-500`}>
                                {item.icon ? item.icon : <div className="font-bold text-sm">COD</div>}
                                <span>Chờ xác nhận</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-col mx-4 py-4 text-gray-400 border-t border-gray-500 gap-4">
                {selectTab.childTab.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 py-4 px-4"
                    >
                        {item}
                    </div>
                ))}
            </div>

        </div>
    )
}
