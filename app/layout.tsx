import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { UserProvider } from "@/context/userContext"; // Import UserProvider
import { Toaster } from "sonner";

const beVietnam = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["400", "500", "700"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <UserProvider>
              {children}
              <Toaster position="top-right" richColors />
            </UserProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}