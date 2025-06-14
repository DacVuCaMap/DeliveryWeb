"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import ArrowUpIcon from "@/icons/arrow-up.svg";
import ArrowDownIcon from "@/icons/arrow-down.svg";
import GroupIcon from "@/icons/group.svg";
import BoxIconLine from "@/icons/box-line.svg";
import { ArrowDown, ArrowUp, Box, UsersRound } from "lucide-react";

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* <img
            src={GroupIcon.src || GroupIcon}
            alt="Group Icon"
            className="text-gray-800 size-6 dark:text-white/90"
          /> */}
          <UsersRound className="text-gray-800 size-6 dark:text-white/90"  />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              12
            </h4>
          </div>
          <Badge color="success">
            {/* <img 
              src={ArrowUpIcon.src || ArrowUpIcon} 
              alt="Arrow Up" 
              className="h-4 w-4" 
            /> */}
            <ArrowUp className="h-4 w-4" />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* <img
            src={BoxIconLine.src || BoxIconLine}
            alt="Box Icon"
            className="text-gray-800 dark:text-white/90 h-6 w-6"
          /> */}
          <Box className="text-gray-800 dark:text-white/90 h-6 w-6"/>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Đơn hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              10
            </h4>
          </div>

          <Badge color="error">
            {/* <img 
              src={ArrowDownIcon.src || ArrowDownIcon} 
              alt="Arrow Down" 
              className="h-4 w-4 text-error-500" 
            /> */}
            <ArrowDown className="h-4 w-4" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};