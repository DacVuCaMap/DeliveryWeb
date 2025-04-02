import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/temp/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/temp/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/temp/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/temp/ecommerce/StatisticsChart";
import RecentOrders from "@/components/temp/ecommerce/RecentOrders";
import DemographicCard from "@/components/temp/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
