import { Space_Grotesk } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner"
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ToastProvider from '@/components/custom-ui/alert/ToastProvider';
import BarProvider from "@/context/BarContext";

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${SpaceGrotesk.className} dark:bg-gray-900 bg-gray-50`}>
      <BarProvider>
        <ThemeProvider>
          <ToastProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ToastProvider>
        </ThemeProvider>
        <Toaster />
      </BarProvider>
      </body>
    </html>
  );
}
