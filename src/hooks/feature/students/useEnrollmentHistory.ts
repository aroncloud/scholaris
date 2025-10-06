import { getStudentEnrollmentHistory } from '@/actions/programsAction';
import { showToast } from '@/components/ui/showToast';
import { IGetEnrollmentHistory } from '@/types/programTypes';
import { useState, useCallback } from 'react';

export const useEnrollmentHistory = () => {
    const [history, setHistory] = useState<IGetEnrollmentHistory[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const fetchHistory = useCallback(async (studentCode: string) => {
        if (!studentCode) return;

        try {
            setIsLoadingHistory(true);
            const result = await getStudentEnrollmentHistory(studentCode);
            console.log('-->useEnrollmentHistory.result', result)
            if (result?.code === 'success') {
                setHistory(Array.isArray(result.data) ? result.data : []);
            } else {
                showToast({
                    variant: 'error-solid',
                    message: 'Erreur',
                    description: result?.error || "Impossible de charger l'historique.",
                });
                setHistory([]);
            }
        } catch (error) {
            console.error('Error loading enrollment history:', error);
            showToast({
                variant: 'error-solid',
                message: 'Erreur',
                description: "Une erreur est survenue lors du chargement de l'historique.",
            });
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    return { history, isLoadingHistory, fetchHistory };
};