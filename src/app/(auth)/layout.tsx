import GridShape from "@/components/common/GridShape";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <div className="bg-white rounded-2xl p-3 mr-4 shadow-lg mb-5">
                  <Image 
                    src='/images/logo/logoEPFPS.png'
                    alt="Logo EPFPS"
                    className="h-40 w-auto"
                    height={1000}
                    width={1000}
                  />
                </div>
                <p className="text-center text-gray-300 dark:text-white/60">
                  École Privée de Formation des Professionnels de Santé de Meiganga
                </p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            {/* <ThemeTogglerTwo /> */}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
