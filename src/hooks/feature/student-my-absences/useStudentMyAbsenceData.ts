/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMyAbsencesList } from '@/actions/studentMyAbsencesAction';
import { Absence, AbsenceHistoryResponse } from '@/types/studentmyabsencesTypes';
import { useUserStore } from '@/store/useAuthStore'



export function useStudentAbsenceData() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Get the current user_code from the auth store
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("🧠 User data from store:", user);
    console.log("🧩 User code:", user?.user?.user_code);
  }, [user]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('useStudentAbsenceData - Fetching absences...');

      const result = await getMyAbsencesList();
      console.log('✅ API response:', result);

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
