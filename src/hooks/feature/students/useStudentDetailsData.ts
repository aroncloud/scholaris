import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEnrollmentHistory } from './useEnrollmentHistory';
import { getStudentDetails } from '@/actions/studentAction';
import { showToast } from '@/components/ui/showToast';
import { IGetStudentDetail } from '@/types/userType';

export const useStudentDetails = (studentId: string) => {
    const [student, setStudent] = useState<IGetStudentDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const { history, isLoadingHistory: isHistoryLoading, fetchHistory } = useEnrollmentHistory();

    const router = useRouter();

    const fetchStudent = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            const result = await getStudentDetails(id);
            console.log('-->useStudentDetails.result', result)
            if (result.code === 'success' && result.data?.body) {
                const studentData = result.data.body;
                setStudent(studentData);
                if (studentData.user_code) {
                    await Promise.all([
                        fetchHistory(studentData.user_code),
                    ]);
                }
            } else {
                showToast({
                    variant: 'error-solid',
                    message: 'Erreur',
                    description: "Impossible de charger les détails de l'étudiant.",
                });
                router.push('/admin/students');
            }
        } catch (error) {
            console.error('Error loading student:', error);
            showToast({ variant: 'error-solid', message: 'Erreur', description: 'Une erreur est survenue.' });
            router.push('/admin/students');
        } finally {
            setIsLoading(false);
        }
    }, [router, fetchHistory]);

    useEffect(() => {
        if (studentId) {
            fetchStudent(studentId);
        } else {
            setIsLoading(false);
        }
    }, [studentId, fetchStudent]);

    return {
        student,
        isLoading,
        history,
        isHistoryLoading,
    };
};