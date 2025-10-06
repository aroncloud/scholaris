'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMyAbsencesList } from '@/actions/studentMyAbsencesAction';
import { Absence, AbsenceHistoryResponse } from '@/types/studentmyabsencesTypes';

export function useStudentAbsenceData() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('useStudentAbsenceData - Fetching absences...');

      const result = await getMyAbsencesList();

      console.log('✅ API response:', result);

      // Check if result has 'body' and 'code'
      if (
        result &&
        'code' in result &&
        result.code === 'success' &&
        Array.isArray((result as AbsenceHistoryResponse).body)
      ) {
        setAbsences((result as AbsenceHistoryResponse).body);
        setError(null);
      } else {
        console.error('❌ API returned failure:', result);
        setAbsences([]);
        // Try to get error message safely
        setError(
          (result && 'message' in result && result.message) ||
          (result && 'error' in result && result.error) ||
          'Erreur inconnue'
        );
      }
    } catch (err: any) {
      console.error('💥 Fetch failed:', err);
      setAbsences([]);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    absences,
    loading,
    error,
    refetch: fetchData
  };
}
