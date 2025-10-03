"use client";

import { Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ToastProvider from "@/components/custom-ui/alert/ToastProvider";
import { AppProgressProvider } from "@bprogress/next";
import { AuthProvider } from "@/components/auth/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${SpaceGrotesk.className} dark:bg-gray-900`}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
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
