import { getCurriculumList } from "@/actions/programsAction";
import { showToast } from "@/components/ui/showToast";
import { ICurriculumDetail, IFactorizedProgram } from "@/types/programTypes";
import { useState, useEffect, useCallback } from "react";


export function useProgramData() {
  const [programs, setPrograms] = useState<IFactorizedProgram[]>([]);
  const [curriculumList, setCurriculumList] = useState<ICurriculumDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const factorizeByProgram = useCallback((data: ICurriculumDetail[]): IFactorizedProgram[] => {
    const grouped: { [key: string]: IFactorizedProgram } = {};

    data.forEach(item => {
      const { program, training_sequences, ...curriculumInfo } = item;
      if (!grouped[item.program_code]) {
        grouped[item.program_code] = {
          program: program,
          curriculums: []
        };
      }

      grouped[item.program_code].curriculums.push({
        ...curriculumInfo,
        program,
        training_sequences
      });
    });

    return Object.values(grouped);
  }, []);

  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getCurriculumList();
    console.log("API Response:", result);

    if (result.code === "success") {
        setCurriculumList(result.data.body);
        console.log("Curriculum List:", factorizeByProgram(result.data.body));
        setPrograms(factorizeByProgram(result.data.body));
    } else {
        showToast({
            variant: "error-solid",
            message: "Erreur lors de la récupération des programmes",
            description: result.code,
            position: 'top-center',
        })
        setError(result.error || "Une erreur est survenue");
    }

    setLoading(false);
  }, [factorizeByProgram]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    programs,
    setPrograms,
    curriculumList,
    setCurriculumList,
    loading,
    error,
    refresh
  };
}
