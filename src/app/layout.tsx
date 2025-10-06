/* eslint-disable @typescript-eslint/no-unused-vars */
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner"
import localFont from 'next/font/local'
// import './globals.css';

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ToastProvider from "@/components/custom-ui/alert/ToastProvider";
import { AppProgressProvider } from "@bprogress/next";
import { AuthProvider } from "@/components/auth/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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



// import { Space_Grotesk } from 'next/font/google';
// import { Toaster } from "@/components/ui/sonner"
// import './globals.css';

// import { SidebarProvider } from '@/context/SidebarContext';
// import { ThemeProvider } from '@/context/ThemeContext';
// import ToastProvider from '@/components/custom-ui/alert/ToastProvider';

// const SpaceGrotesk = Space_Grotesk({
//   subsets: ["latin"],
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${SpaceGrotesk.className} dark:bg-gray-900`}>
//         <ThemeProvider>
//           <ToastProvider>
//             <SidebarProvider>{children}</SidebarProvider>
//           </ToastProvider>
//         </ThemeProvider>
//         <Toaster />
//       </body>
//     </html>
//   );
// }
