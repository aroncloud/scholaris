/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurriculumFinancialSummary, getPlanList, recordDeposite as recordDepositeAction } from "@/actions/financialAction";
import { showToast } from "@/components/ui/showToast";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { IGetPlan, IRecordDeposit, IStudentGetFinancialInfo } from "@/types/financialTypes";
import { useCallback, useEffect, useState } from "react";


export function useFinancialData() {
  const [finData, setFinData] = useState<IStudentGetFinancialInfo[]>([]);
  const [planData, setPlanData] = useState<IGetPlan[]>([]);
  const [loadingFinData, setFinloadingFinData] = useState<boolean>(false);
  const [processingFinData, setProcessingFinData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedAcademicYear } = useAcademicYearStore();

  const fetchData = useCallback(async (curriculum_code: string) => {
    setFinloadingFinData(true);
    setError(null);
    try {
      if(selectedAcademicYear) {
        const result = await getCurriculumFinancialSummary(curriculum_code, selectedAcademicYear);
        console.log('-->useFinancialData.result', result)
        if (result.code === "success") {
          setFinData(result.data.body as IStudentGetFinancialInfo[]);
        } else {
          setError(result.error || "Erreur lors de la récupération des infos financières");
        }
      }
    } catch (err) {
      console.error("-->useClassrooms.error", err);
      setError("Erreur inattendue");
    } finally {
      setFinloadingFinData(false);
    }
  }, [selectedAcademicYear]);

  const listAllPlan = async () => {
    setFinloadingFinData(true);
    setError(null);
    const result = await getPlanList();
    console.log('-->result', result);
    if (result.code === "success") {
      setPlanData(result.data.body as IGetPlan[]);
    } else {
      setError(result.error || "Erreur lors de la récupération de la grille tarrifaire");
    }
    setFinloadingFinData(false);
  }

  const recordDeposite = async (payload: IRecordDeposit) => {
    setProcessingFinData(true);
    const result = await recordDepositeAction(payload);

    if(result.code != "success") {
      setError(result.error || "Erreur lors l'enregistrement de la transaction");
    }
    setProcessingFinData(false);
    return result
  }


  return {
    finData,
    loadingFinData,
    processingFinData,
    error,
    refresh: fetchData,
    getCurriculumFinancialsInfo: fetchData,
    setFinData,
    recordDeposite,
    listAllPlan,
    planData
  };
}