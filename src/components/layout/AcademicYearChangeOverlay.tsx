"use client";

import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { CalendarDays } from "lucide-react";

const AcademicYearChangeOverlay: React.FC = () => {
  const { isChangingYear, newYearLabel } = useAcademicYearStore();

  if (!isChangingYear) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <CalendarDays className="h-16 w-16 text-blue-500" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Changement d&apos;année académique
            </h3>
            <p className="text-gray-600">
              Passage à l&apos;année <span className="font-bold text-blue-600">{newYearLabel}</span>
            </p>
            <p className="text-sm text-gray-500">
              Rechargement des données en cours...
            </p>
          </div>

          {/* Barre de progression animée */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full animate-pulse bg-[length:200%_100%]"
                 style={{ width: '75%', animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearChangeOverlay;
