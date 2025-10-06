"use client"; // <-- Mark the layout as a Client Component

import { Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ToastProvider from "@/components/custom-ui/alert/ToastProvider";
import { AppProgressProvider } from "@bprogress/next";
import { AuthProvider } from "@/components/auth/AuthContext";

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

// If you want, you can uncomment and use your Satoshi font
// const myFont = localFont({ src: './fonts/Satoshi-Variable.woff2' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${SpaceGrotesk.className} dark:bg-gray-900`}>
        <AppProgressProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
          <Toaster />
        </AppProgressProvider>
      </body>
    </html>
  );
}
