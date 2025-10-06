/* eslint-disable @typescript-eslint/no-unused-vars */
import {  getTeacherCoures } from "@/actions/programsAction";
import { showToast } from "@/components/ui/showToast";
import { useUserStore } from "@/store/useAuthStore";
import { IGetTeacherCourseUnit } from "@/types/programTypes";
import { useState, useEffect, useCallback } from "react";


export function useCoursData() {
  const [teacherCoures, setTeacherCoures] = useState<IGetTeacherCourseUnit[]>([]);
  const [isTeacherCoursesLoading, setisTeacherCoursesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useUserStore()

  const fetchData = useCallback(async () => {
    if (user) {
      setisTeacherCoursesLoading(true);
      try {
        const result = await getTeacherCoures(user.user.user_code);
        console.log("-->result", result)
        if (result.code === "success") {
          setTeacherCoures(result.data.body || []);
        } else {
          showToast({
            variant: "error-solid",
            message: "Erreur lors de la récupération des données",
            description: result.error ?? "Une erreur est survenue lors de la récupération des Course. Veuillez réessayer ultérieurement.",
            position: "top-center",
          });
        }
      } catch (error) {
        showToast({
          variant: "error-solid",
          message: "Erreur inattendue",
          description:
            "Impossible de charger vos séances pour le moment. Veuillez réessayer.",
          position: "top-center",
        });
      } finally {
        setisTeacherCoursesLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData])

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    isTeacherCoursesLoading,
    error,
    refresh,
    fetchData,
    teacherCoures
  };
}
