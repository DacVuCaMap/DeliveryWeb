
import ThemeTogglerTwo from "@/components/temp/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-black z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              {/* <GridShape /> */}

              {/* <div className="absolute -z-10 w-full h-screen">
                <Image
                  src="/snapgoimg/snapgo-authbg.png"
                  alt="grid"
                  fill
                  className="object-cover"
                />
              </div> */}
              <div className="absolute -z-10 w-full h-screen overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/video/autorun/snapgoauth.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* <div className="flex flex-col items-center max-w-xs">
                <p className="text-center text-orange-600 font-bold text-5xl dark:text-white/60">
                  snapgo.vn
                </p>
              </div> */}
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
