// src/components/header/AcademicYearSelector.tsx

"use client";

import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDays, Check, ChevronsUpDown } from "lucide-react";
import { useMemo } from "react";

const AcademicYearSelector: React.FC = () => {
  const { academicYears, selectedAcademicYear, setSelectedAcademicYear, isChangingYear, setIsChangingYear } = useAcademicYearStore();

  const handleSelectAcademicYear = (academicYearCode: string) => {
    if (academicYearCode === selectedAcademicYear) return;

    const newYear = academicYears.find((ay) => ay.academic_year_code === academicYearCode);
    if (!newYear) return;

    const yearLabel = `${newYear.start_date.split('-')[0]} - ${newYear.end_date.split('-')[0]}`;

    setIsChangingYear(true, yearLabel);
    setSelectedAcademicYear(academicYearCode);

    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
  };

  const selectedYearLabel = useMemo(() => {
    if (!selectedAcademicYear) return "Sélectionner...";
    
    const currentYear = academicYears.find(
      (ay) => ay.academic_year_code === selectedAcademicYear
    );
    
    if (!currentYear) return "Année invalide";
    
    return `${currentYear.start_date.split('-')[0]} - ${currentYear.end_date.split('-')[0]}`;
  }, [selectedAcademicYear, academicYears]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 font-semibold text-white transition-colors h-auto bg-blue-500 hover:bg-blue-700 hover:text-white focus:ring-2 focus:ring-white/50"
          disabled={isChangingYear}
        >
          <CalendarDays className="h-5 w-5 text-white/80" />
          <span className="hidden sm:inline">Année :</span>
          {selectedYearLabel}
          <ChevronsUpDown className="h-4 w-4 text-white/80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Changer d&apos;année académique</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {academicYears.map((ay) => (
          <DropdownMenuItem
            key={ay.academic_year_code}
            onSelect={() => handleSelectAcademicYear(ay.academic_year_code)}
            className="flex items-center justify-between"
          >
            <span>
              {`${ay.start_date.split('-')[0]} - ${ay.end_date.split('-')[0]}`}
            </span>
            {selectedAcademicYear === ay.academic_year_code && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
        {academicYears.length === 0 && (
            <DropdownMenuItem disabled>
                Aucune année disponible
            </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AcademicYearSelector;