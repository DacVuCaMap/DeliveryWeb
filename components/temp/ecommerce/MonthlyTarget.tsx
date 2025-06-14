"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

import MoreDotIcon from "@/icons/more-dot.svg";
import ArrowUpIcon from "@/icons/arrow-up.svg";
import ArrowDownIcon from "@/icons/arrow-down.svg";
import { EllipsisVertical } from "lucide-react";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const series = [75.55];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Mục tiêu trong tháng
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Mục tiêu bạn đã đặt ra
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              {/* <img src={MoreDotIcon.src} alt="More Options" className="w-6 h-6" /> */}
              <EllipsisVertical className="w-6 h-6 dark:text-white"/>
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem tag="a" onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                View More
              </DropdownItem>
              <DropdownItem tag="a" onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[330px] mt-16">
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            +10%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base pb-8">
          Đã đạt được hơn 75% mục tiêu trong tháng này. Vượt qua mục tiêu của bạn đã đặt ra
        </p>
      </div>
    </div>
  );  
}
