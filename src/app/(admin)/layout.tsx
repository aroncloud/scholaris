"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { useUserStore } from "@/store/useAuthStore";
import { useClassroomStore } from "@/store/useClassroomStore";
import { useTeacherStore } from "@/store/useTeacherStore";
import React, { useEffect } from "react";

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
  const { user } = useUserStore();

  // On calcule la marge du contenu en fonction de la sidebar
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  useEffect(() => {
    if(user?.roles && !user.roles.includes("STUDENT")&& !user.roles.includes("TEACHER")) {
      fetchTeacher();
      fetchClassrooms();
      fetchAcademicYears();
    }
    fetchPrograms();
  }, [fetchPrograms, fetchTeacher, fetchClassrooms, fetchAcademicYears, user?.roles]);

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
            <div className="mx-auto pt-2">
              {children}
            </div>
          </main>
        </div>
    </div>
  );
}
