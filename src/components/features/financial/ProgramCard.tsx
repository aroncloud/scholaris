"use client";

import { GraduationCap } from "lucide-react";

interface ProgramCardProps {
  programCode: string;
  programName: string;
  curriculumCount: number;
  onSelect: (programCode: string) => void;
}

export default function ProgramCard({
  programCode,
  programName,
  curriculumCount,
  onSelect,
}: ProgramCardProps) {
  return (
    <button
      onClick={() => onSelect(programCode)}
      className="group relative p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-left hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Cercle décoratif */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />

      <div className="relative z-10">
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {programName}
        </h3>

        <div className="flex items-center gap-2 text-blue-100">
          <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            {curriculumCount} niveau{curriculumCount > 1 ? 'x' : ''}
          </div>
        </div>
      </div>
    </button>
  );
}
