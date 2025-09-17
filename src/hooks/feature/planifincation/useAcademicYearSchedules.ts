"use client";

import { getAcademicYearSchedulesList } from "@/actions/planificationAction";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { IGetAcademicYearSchedule } from "@/types/planificationType";
import { useState, useCallback, useEffect } from "react";


export function useAcademicYearSchedules() {
  const [academicYearSchedule, setAcademicYearSchedule] = useState<IGetAcademicYearSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { academicYears } = useAcademicYearStore();

  const fetchData = useCallback(async (academic_year_code: string | null) => {
    setLoading(true);
    setError(null);
    const result = await getAcademicYearSchedulesList(
      academic_year_code ?? academicYears.find(acy => acy.status_code === 'IN_PROGRESS')?.academic_year_code ?? ""
    );

    console.log('-->getAcademicYearSchedulesList.result', result)
    console.log('-->useAcademicYearSchedules.academic_year_code', academic_year_code)
    if (result.code === "success") {
      setAcademicYearSchedule(result.data.body as IGetAcademicYearSchedule[]);
    } else {
      setError(result.error || "Erreur lors de la récupération des schedules");
    }

    setLoading(false);
    return result;
  }, [academicYears]);

  useEffect(() => {
    fetchData(null);
  }, [fetchData]);

  return {
    academicYearSchedule,
    loading,
    error,
    refresh: fetchData,
  };
}