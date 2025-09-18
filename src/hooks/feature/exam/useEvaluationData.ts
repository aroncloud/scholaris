import { useCallback, useState } from "react";
import { ICreateEvaluation } from "@/types/examTypes";
import { getEvaluationListForCurriculum, getEvaluationListForTeacher } from "@/actions/examAction";

export function useEvaluationData() {
  const [data, setData] = useState<ICreateEvaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchEvaluationForCurriculum = useCallback(async (curriculum_code: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEvaluationListForCurriculum(curriculum_code);
      console.log("-->useEvaluations.result", result);
      if (result.code === "success") {
        setData(result.data.body as ICreateEvaluation[]);
      } else {
        setError(result.error || "Erreur lors de la récupération des évaluations");
      }
    } catch (err) {
      console.error("-->useEvaluations.error", err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchEvaluationForTeacher = useCallback(async (teacher_code: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEvaluationListForTeacher(teacher_code);
      console.log("-->fetchEvaluationForTeacher.result", result);
      if (result.code === "success") {
        setData(result.data.body as ICreateEvaluation[]);
      } else {
        setError(result.error || "Erreur lors de la récupération des évaluations");
      }
    } catch (err) {
      console.error("-->fetchEvaluationForTeacher.error", err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }, []);



  return {
    data,
    loading,
    error,
    fetchEvaluationForCurriculum: fetchEvaluationForCurriculum,
    fetchEvaluationForTeacher: fetchEvaluationForTeacher,
  };
}
