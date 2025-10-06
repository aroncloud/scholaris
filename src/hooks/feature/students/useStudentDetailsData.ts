import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEnrollmentHistory } from './useEnrollmentHistory';
import { createNewAnnualEnrollment, getStudentDetails } from '@/actions/studentAction';
import { showToast } from '@/components/ui/showToast';
import { IGetStudentDetail } from '@/types/userType';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';

export type OperationResult<T = void> = {
  success: boolean;
  data?: T;
};

export const useStudentDetails = (studentId: string) => {
    const [student, setStudent] = useState<IGetStudentDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const { history, isLoadingHistory: isHistoryLoading, fetchHistory } = useEnrollmentHistory();
    const {  selectedAcademicYear } = useAcademicYearStore();

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
                router.push('/dashboard/admin/students');
            }
        } catch (error) {
            console.error('Error loading student:', error);
            showToast({ variant: 'error-solid', message: 'Erreur', description: 'Une erreur est survenue.' });
            router.push('/dashboard/admin/students');
        } finally {
            setIsLoading(false);
        }
    }, [router, fetchHistory]);

    const handleFinalizeInscription = async () => {
        if(student && selectedAcademicYear) {
            setIsProcessing(true);
            const result = await createNewAnnualEnrollment(student.user_code, selectedAcademicYear, student.curriculum_code)
            setIsProcessing(false);
            if(result.code ==  "success") {
                return { success: true, data: 'Utilisateur désactivé avec succès' };
            } else {
                return { 
                    success: false, 
                    data: result.error ?? "Erreur lors de la désactivation de l'utilisateur" 
                };
            }
        }

        return
    }

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
        handleFinalizeInscription,
        isProcessing,
    };
};