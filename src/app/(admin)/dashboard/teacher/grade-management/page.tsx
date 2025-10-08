/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { Save, Download, Loader2 } from 'lucide-react';
import { useEvaluationData } from '@/hooks/feature/exam/useEvaluationData';
import { getEvaluationSheet, submitGrades } from '@/actions/examAction';
import { EvaluationSheet } from '@/types/examTypes';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/showToast';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';
import { useUserStore } from '@/store/useAuthStore';
import PageHeader from '@/layout/PageHeader';
import { EvaluationSelector } from '@/components/features/grades/EvaluationSelector';
import { GradeTable, GradeTableLoading } from '@/components/features/grades/GradeTable';

const Page = () => {
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [examSheet, setExamSheet] = useState<EvaluationSheet | undefined>(undefined);
    const [isLoadingExamDetail, setIsLoadingExamDetail] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [modifiedStudents, setModifiedStudents] = useState<Set<string>>(new Set());
    const [studentGrades, setStudentGrades] = useState<Map<string, number>>(new Map());

    const { user } = useUserStore();
    const { examList, fetchEvaluationForTeacher, isLoadingExam } = useEvaluationData();
    const { selectedAcademicYear } = useAcademicYearStore();

    const updateStudentScore = useCallback((userCode: string, score: number) => {
        setStudentGrades(prev => new Map(prev.set(userCode, score)));
        setModifiedStudents(prev => new Set(prev).add(userCode));
    }, []);

    const handleSaveGrades = async () => {
        if (!examSheet || modifiedStudents.size === 0) return;

        setIsSaving(true);
        try {
            const gradesData = Array.from(modifiedStudents).map(enrollmentCode => ({
                enrollment_code: enrollmentCode,
                score: studentGrades.get(enrollmentCode) || 0,
                status_code: "SUBMITTED",
                "comments": "RAS"
            }));

            console.log('Submitting grades:', gradesData);

            const result = await submitGrades(selectedExam, gradesData);
            console.log('Submit grades result:', result);
            if(result.code == "success") {
                const updatedStudents = examSheet.students.map(student => {
                    const newScore = studentGrades.get(student.enrollment_code);
                    return newScore !== undefined 
                        ? { ...student, score: newScore, graded: true }
                        : student;
                });            setExamSheet({
                ...examSheet,
                    students: updatedStudents,
                });

                setModifiedStudents(new Set());

                showToast({
                    variant: "success-solid",
                    message: 'Notes enregistré avec succès',
                    description: `Les notes ont été sauvegardées.`,
                    position: 'top-center',
                });
            } else {
                showToast({
                    variant: "error-solid",
                    message: "Erreur lors de la sauvegarde",
                    description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Error saving grades:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const getEvaluationInfo = useCallback(async () => {
        if (!selectedExam) return;

        setIsLoadingExamDetail(true);
        try {
            const result = await getEvaluationSheet(selectedExam);
            console.log('Fetched evaluation sheet:', result);
            if (result.code === "success") {
                setExamSheet(result.data.body);
                const existingGrades = new Map();
                if(result.data.body.students) {
                    result.data.body.students.forEach((student: any) => {
                        if (student.score !== undefined && student.score !== null) {
                            existingGrades.set(student.enrollment_code, student.score);
                        }
                    });
                }
                
                setStudentGrades(existingGrades);
                setModifiedStudents(new Set()); 
            }
        } catch (error) {
            console.error('Error fetching evaluation:', error);
        } finally {
            setIsLoadingExamDetail(false);
        }
    }, [selectedExam]);


    useEffect(() => {
        if(user && selectedAcademicYear) {
            fetchEvaluationForTeacher(user.user.user_code, selectedAcademicYear);
        }
    }, [fetchEvaluationForTeacher, user, selectedAcademicYear]);

    useEffect(() => {
        getEvaluationInfo();
    }, [getEvaluationInfo, selectedExam]);

    return (
        <div className="space-y-6">
            <PageHeader
                title='Saisie des Notes'
                description='Interface de gestion des évaluations'
            >
                <div className="flex items-center gap-3">
                    <Button variant="outline" disabled={!examSheet}>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                    </Button>
                    <Button
                        onClick={handleSaveGrades}
                        disabled={modifiedStudents.size === 0 || isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Sauvegarder {modifiedStudents.size > 0 && `(${modifiedStudents.size})`}
                            </>
                        )}
                    </Button>
                </div>
            </PageHeader>

            <div className='p-6 space-y-6'>
                <EvaluationSelector
                    examList={examList.map(exam => ({
                        value: exam.evaluation_code,
                        label: exam.title
                    }))}
                    selectedExam={selectedExam}
                    onExamChange={setSelectedExam}
                    isLoadingExam={isLoadingExam}
                    examSheet={examSheet}
                />

                {selectedExam && (
                    isLoadingExamDetail ? (
                        <GradeTableLoading />
                    ) : examSheet ? (
                        <GradeTable
                            examSheet={examSheet}
                            studentGrades={studentGrades}
                            modifiedStudents={modifiedStudents}
                            onScoreChange={updateStudentScore}
                            isLoading={isSaving}
                        />
                    ) : null
                )}
            </div>
        </div>
    );
};

export default Page;