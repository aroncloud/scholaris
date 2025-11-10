/* eslint-disable @typescript-eslint/no-unused-vars */
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner"
import localFont from 'next/font/local'
// import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import BarProvider from "@/context/BarContext";
import ToastProvider from '@/components/ui/ToastProvider';
import AcademicYearChangeOverlay from '@/components/layout/AcademicYearChangeOverlay';

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

// export const satoshi = localFont({
//   src: [
//     {
//       path: "./Satoshi-Regular.otf",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "./Satoshi-Italic.otf",
//       weight: "400",
//       style: "italic",
//     },
//     {
//       path: "./Satoshi-Light.otf",
//       weight: "300",
//       style: "normal",
//     },
//     {
//       path: "./Satoshi-LightItalic.otf",
//       weight: "300",
//       style: "italic",
//     },
//     {
//       path: "./Satoshi-Medium.otf",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "./Satoshi-MediumItalic.otf",
//       weight: "500",
//       style: "italic",
//     },
//     {
//       path: "./Satoshi-Bold.otf",
//       weight: "700",
//       style: "normal",
//     },
//     {
//       path: "./Satoshi-BoldItalic.otf",
//       weight: "700",
//       style: "italic",
//     },
//     {
//       path: "./Satoshi-Black.otf",
//       weight: "900",
//       style: "normal",
//     },
//     {
//       path: "./Satoshi-BlackItalic.otf",
//       weight: "900",
//       style: "italic",
//     },
//   ],
//   variable: "--font-satoshi",
//   display: "swap",
// });

// const myFont = localFont({
//   src: './fonts/Satoshi-Variable.woff2',
// })

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
      {/* <AcademicYearChangeOverlay /> */}
      </body>
    </html>
  );
}