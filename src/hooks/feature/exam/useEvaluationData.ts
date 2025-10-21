import { useCallback, useState } from "react";
import { IGetEvaluationsForCurriculum } from "@/types/examTypes";
import { getEvaluationListForCurriculum, getEvaluationsForSchedule, getEvaluationsForTeacher } from "@/actions/examAction";

export function useEvaluationData() {
  const [examList, setExamList] = useState<IGetEvaluationsForCurriculum[]>([]);
  const [isLoadingExam, setIsLoadingExam] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchEvaluationForCurriculum = useCallback(async (curriculum_code: string) => {
    setIsLoadingExam(true);
    setError(null);
    try {
      if(!curriculum_code)  return
      const result = await getEvaluationListForCurriculum(curriculum_code);
      console.log("-->useEvaluations.result", result);
      if (result.code === "success") {
        setExamList(result.data.body as IGetEvaluationsForCurriculum[]);
      } else {
        setError(result.error || "Erreur lors de la récupération des évaluations");
      }
    } catch (err) {
      console.error("-->useEvaluations.error", err);
      setError("Erreur inattendue");
    } finally {
      setIsLoadingExam(false);
    }
  }, []);
  const fetchEvaluationForTeacher = useCallback(async (teacher_code: string, academic_year_code: string) => {
    setIsLoadingExam(true);
    setError(null);
    try {
      const result = await getEvaluationsForTeacher(teacher_code, academic_year_code);
      console.log("-->fetchEvaluationForTeacher.result", result);
      if (result.code === "success") {
        setExamList(result.data.body as IGetEvaluationsForCurriculum[]);
      } else {
        setError(result.error || "Erreur lors de la récupération des évaluations");
      }
    } catch (err) {
      console.error("-->fetchEvaluationForTeacher.error", err);
      setError("Erreur inattendue");
    } finally {
      setIsLoadingExam(false);
    }
  }, []);
  const fetchtEvaluationsForSchedule = useCallback(async (schedule_code: string) => {
    setIsLoadingExam(true);
    setError(null);
    try {
      const result = await getEvaluationsForSchedule(schedule_code);
      console.log("-->fetchEvaluationPerModule.result", result);
      if (result.code === "success") {
        setExamList(result.data.body as IGetEvaluationsForCurriculum[]);
      } else {
        setError(result.error || "Erreur lors de la récupération des évaluations");
      }
    } catch (err) {
      console.error("-->fetchEvaluationPerModule.error", err);
      setError("Erreur inattendue");
    } finally {
      setIsLoadingExam(false);
    }
  }, []);



  return {
    examList,
    isLoadingExam,
    error,
    fetchEvaluationForCurriculum: fetchEvaluationForCurriculum,
    fetchEvaluationForTeacher: fetchEvaluationForTeacher,
    fetchtEvaluationsForSchedule: fetchtEvaluationsForSchedule,
  };
}
