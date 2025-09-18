"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { useClassroomStore } from "@/store/useClassroomStore";
import { useTeacherStore } from "@/store/useTeacherStore";
import { useFactorizedProgramStore } from "@/store/programStore";
import React, { useEffect }, { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const {fetchPrograms} = useFactorizedProgramStore();
  const {fetchTeacher} = useTeacherStore();
  const {fetchClassrooms} = useClassroomStore();
  const {fetchAcademicYears} = useAcademicYearStore();

  // On calcule la marge du contenu en fonction de la sidebar
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  useEffect(() => {
    fetchPrograms();
    fetchTeacher();
    fetchClassrooms();
    fetchAcademicYears();
  }, [fetchPrograms, fetchTeacher, fetchClassrooms, fetchAcademicYears]);

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar */}
      <AppSidebar />
      <Backdrop />

      <div className="flex-1">
        {/* Header fixe qui prend toute la largeur */}
        <AppHeader />

        {/* Contenu avec marge dynamique */}
        <main className={`transition-all duration-300 ease-in-out pt-20 ${mainContentMargin}`}>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
