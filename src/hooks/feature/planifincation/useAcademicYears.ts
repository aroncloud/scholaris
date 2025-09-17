"use client";

import { getAcademicYear } from "@/actions/planificationAction";
import { IGetAcademicYears } from "@/types/planificationType";
import { useState, useCallback, useEffect } from "react";


export function useAcademicYears() {
  const [academicYearSchedule, setAcademicYearSchedule] = useState<IGetAcademicYears[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAcademicYear();
      if (result.code === "success") {
        setAcademicYearSchedule(result.data.body as IGetAcademicYears[]);
      } else {
        setError(result.error || "Erreur lors de la récupération des schedules");
      }
    } catch (err) {
      console.error("-->useAcademicYears.error", err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    academicYearSchedule,
    loading,
    error,
    fetchAcademicYear: fetchData,
  };
}