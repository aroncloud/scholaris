import { useCallback, useEffect, useState } from "react";
import { IGetClassroom } from "@/types/classroomType";
import { getClassroomList } from "@/actions/classroomAction";


export function useClassroomData() {
  const [data, setData] = useState<IGetClassroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getClassroomList();
      console.log('-->useClassrooms.result', result)
      if (result.code === "success") {
        setData(result.data.body as IGetClassroom[]);
      } else {
        setError(result.error || "Erreur lors de la récupération des salles");
      }
    } catch (err) {
      console.error("-->useClassrooms.error", err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}