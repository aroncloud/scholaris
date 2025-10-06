"use client";

import { getAcademicYear } from "@/actions/planificationAction";
import { IGetAcademicYears } from "@/types/planificationType";
import { useState, useCallback, useEffect } from "react";


export function useAcademicYears() {
  const [academicYearList, setAcademicYearList] = useState<IGetAcademicYears[]>([]);
  const [loadingAccademicyears, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAcademicYear();
      if (result.code === "success") {
        setAcademicYearList(result.data.body.reverse() as IGetAcademicYears[]);
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
    academicYearList,
    loadingAccademicyears,
    error,
    fetchAcademicYear: fetchData,
  };
}