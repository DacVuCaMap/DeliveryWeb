import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { UserProvider } from "@/context/userContext"; // Import UserProvider
import { Toaster } from "sonner";
import 'mapbox-gl/dist/mapbox-gl.css';
import LocationTracker from "@/components/LocationTracker";
import Script from "next/script";
const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["400", "500", "700"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">

      <body className={`${beVietnam.className} dark:bg-gray-900`}>
        {/* Load VietMap scripts + styles ở đây */}
        <Script
          src="https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.js"
          strategy="beforeInteractive"
        />
        <link
          href="https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.css"
          rel="stylesheet"
        />
        <ThemeProvider>
          <SidebarProvider>
            <UserProvider>
              <LocationTracker />
              {children}
              <Toaster position="top-right" richColors />
            </UserProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}