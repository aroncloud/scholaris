/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, Calendar, CheckCircle, Save, Download } from 'lucide-react';
import { Combobox } from '@/components/ui/Combobox';
import { useFactorizedProgramStore } from '@/store/programStore';
import { useEvaluationData } from '@/hooks/feature/exam/useEvaluationData';
import { getEvaluationSheet, submitGrades } from '@/actions/examAction';
import { EvaluationSheet, IStudentEvaluationInfo } from '@/types/examTypes';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveTable, TableColumn } from '@/components/tables/ResponsiveTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { showToast } from '@/components/ui/showToast';
import { getStatusColor } from '@/lib/utils';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';
import { getListAcademicYearsSchedulesForCurriculum } from '@/actions/programsAction';
import { IGetAcademicYearsSchedulesForCurriculum } from '@/types/planificationType';

const ScoreInput: React.FC<{
  student: IStudentEvaluationInfo;
  maxScore: number;
  onScoreChange: (studentCode: string, score: number) => void;
  isModified: boolean;
  locale: "fr" | "en";
}> = ({ student, maxScore, onScoreChange, isModified, locale }) => {
  const [localScore, setLocalScore] = useState(student.score?.toString() || '');
  const [isValid, setIsValid] = useState(true);

  const handleChange = (value: string) => {
    setLocalScore(value);
    
    if (value === '') {
      setIsValid(true);
      onScoreChange(student.enrollment_code, 0);
      return;
    }
    
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue) || numericValue < 0 || numericValue > maxScore) {
      setIsValid(false);
      return;
    }
    
    setIsValid(true);
    onScoreChange(student.enrollment_code, numericValue);
  };

  const getInputClassName = () => {
    let baseClass = "w-20 text-center";
    if (!isValid) {
      baseClass += " border-red-500 focus:border-red-500";
    } else if (isModified) {
      baseClass += " border-yellow-500 bg-yellow-50";
    } else if (student.graded) {
      baseClass += " border-green-500 bg-green-50";
    }
    return baseClass;
  };

  return (
    <div className="relative">
      <Input
        type="number"
        value={localScore}
        onChange={(e) => handleChange(e.target.value)}
        min={0}
        max={maxScore}
        step={0.5}
        className={getInputClassName()}
        placeholder="--"
      />
      {!isValid && (
        <div className="absolute -bottom-5 left-0 text-xs text-red-600">
          {locale === "fr" ? "Note invalide" : "Invalid score"}
        </div>
      )}
    </div>
  );
};

const Page = () => {
    const [selectedCurriculum, setSelectedCurriculum] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
    const [selectedSchedule, setSelectedSchedule] = useState<string>('');
    const [examSheet, setExamSheet] = useState<EvaluationSheet | undefined>(undefined);
    const [isLoadingExamDetail, setIsLoadingExamDetail] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);

    const [modifiedStudents, setModifiedStudents] = useState<Set<string>>(new Set());
    const [studentGrades, setStudentGrades] = useState<Map<string, number>>(new Map());

    const { factorizedPrograms } = useFactorizedProgramStore();
    const { examList, fetchtEvaluationsForSchedule, isLoadingExam } = useEvaluationData();
    const { academicYears } = useAcademicYearStore();

    const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

    const fetchListAcademicYearsSchedulesForCurriculum = async (curriculum_code: string, academic_year_code: string) => {
        const result = await getListAcademicYearsSchedulesForCurriculum(curriculum_code, academic_year_code);
        setScheduleList(result.data.body)
    }
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
        if(selectedCurriculum && selectedAcademicYear) {
            fetchListAcademicYearsSchedulesForCurriculum(selectedCurriculum, selectedAcademicYear);
        }
    }, [selectedCurriculum, selectedAcademicYear]);

    useEffect(() => {
        if(selectedCurriculum && selectedSchedule) {
            fetchtEvaluationsForSchedule(selectedSchedule);
        }
    }, [selectedCurriculum, selectedSchedule, fetchtEvaluationsForSchedule]);

    useEffect(() => {
        getEvaluationInfo();
    }, [getEvaluationInfo, selectedExam]);

    const createColumns = (): TableColumn<IStudentEvaluationInfo>[] => {
        if (!examSheet) return [];

        return [
            {
                key: "student_number",
                label: "N° Étudiant",
                render: (studentNumber: string) => (
                    <div className="font-mono text-sm font-medium">
                        {studentNumber}
                    </div>
                ),
            },
            {
                key: "first_name",
                label: "Nom Complet",
                render: (_, student: IStudentEvaluationInfo) => (
                    <div>
                        <div className="font-medium">
                            {student.first_name} {student.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {student.enrollment_code}
                        </div>
                    </div>
                ),
            },
            {
                key: "graded",
                label: "Statut",
                render: (graded: boolean, student: IStudentEvaluationInfo) => {
                    return (
                        <Badge 
                            className={getStatusColor(student.graded ? "APPROVED" : "PENDING")}
                        >
                            {student.graded ? "NOTÉ" : "NON NOTÉ"}
                        </Badge>
                    );
                },
            },
            {
                key: "score",
                label: `Note (/${examSheet.evaluation.max_score})`,
                render: (score: number, student: IStudentEvaluationInfo) => (
                    <div className="flex items-center space-x-2">
                        <ScoreInput
                            student={{
                                ...student,
                                score: studentGrades.get(student.enrollment_code) ?? student.score
                            }}
                            maxScore={examSheet.evaluation.max_score}
                            onScoreChange={updateStudentScore}
                            isModified={modifiedStudents.has(student.enrollment_code)}
                            locale="fr"
                        />
                        <span className="text-sm text-muted-foreground">
                            / {examSheet.evaluation.max_score}
                        </span>
                    </div>
                ),
            },
        ];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Saisie des Notes</h1>
                            <p className="text-sm text-gray-600 mt-1">Interface de gestion des évaluations</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Exporter
                            </Button>
                            <Button 
                                onClick={handleSaveGrades}
                                disabled={modifiedStudents.size === 0 || isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Sauvegarder
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto p-6">
                {/* Selection Panel */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <BookOpen className="w-4 h-4 inline mr-2" />
                                Année académique
                            </label>
                            <Combobox
                                options={academicYears.map(ay => ({ 
                                    value: ay.academic_year_code, 
                                    label: `${ay.start_date.split('-')[0]} - ${ay.end_date.split('-')[0]}`
                                }))}
                                value={selectedAcademicYear}
                                onChange={setSelectedAcademicYear}
                                placeholder="Sélectionner une année académique"
                                className='py-5'
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <BookOpen className="w-4 h-4 inline mr-2" />
                                Curriculum
                            </label>
                            <Combobox
                                options={curriculumList.map(curriculum => ({ 
                                    value: curriculum.curriculum_code, 
                                    label: curriculum.curriculum_name
                                }))}
                                value={selectedCurriculum}
                                onChange={setSelectedCurriculum}
                                placeholder="Sélectionner un cours"
                                className='py-5'
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <BookOpen className="w-4 h-4 inline mr-2" />
                                Trimestre/Semestre
                            </label>
                            <Combobox
                                options={scheduleList.map(sch => ({ 
                                    value: sch.schedule_code, 
                                    label: sch.sequence_name
                                }))}
                                value={selectedSchedule}
                                onChange={setSelectedSchedule}
                                placeholder="Sélectionner un cours"
                                className='py-5'
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Évaluation
                            </label>
                            <Combobox
                                options={examList.map(exam => ({ 
                                    value: exam.evaluation_code, 
                                    label: exam.title
                                }))}
                                value={selectedExam}
                                onChange={setSelectedExam}
                                placeholder={isLoadingExam ? "Chargement des données ..." : "Sélectionner une évaluation"}
                                className='py-5'
                            />
                        </div>
                    </div>

                    {selectedCurriculum && selectedExam && examSheet?.evaluation&& examSheet?.students  && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            {examSheet.evaluation.title}
                                        </p>
                                        <p className="text-sm text-blue-700">
                                            Coefficient: {examSheet.evaluation.coefficient} | Note max: {examSheet.evaluation.max_score} | {examSheet.students.length} étudiants
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Students Table */}
                {examSheet && (
                    <Card className="w-full shadow-md rounded-2xl border">
                        {/* Header */}
                        <CardHeader className="rounded-t-2xl border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex flex-nowrap gap-2">
                                        {examSheet.evaluation.title}
                                        <Badge>{examSheet.evaluation.status}</Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                                            <span>
                                            Date d&apos;évaluation:{" "}
                                            {examSheet.evaluation.evaluation_date
                                                ? new Date(examSheet.evaluation.evaluation_date).toLocaleDateString()
                                                : "Non programmée"}
                                            </span>
                                            <Separator orientation="vertical" className="h-4" />
                                            <span>Note maximale: {examSheet.evaluation.max_score}</span>
                                            <Separator orientation="vertical" className="h-4" />
                                            <span>Coefficient: {examSheet.evaluation.coefficient}</span>
                                        </div>
                                    </CardDescription>
                                </div>

                                {modifiedStudents.size > 0 && (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                                        {modifiedStudents.size} modification(s)
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        {/* Table */}
                        <CardContent className="px-6">
                            <ResponsiveTable
                                columns={createColumns()}
                                data={examSheet.students}
                                searchKey={["first_name", "last_name", "student_number"]}
                                paginate={20}
                                locale="fr"
                                isLoading={isLoadingExamDetail || isSaving}
                            />
                        </CardContent>
                        </Card>

                )}
            </div>
        </div>
    );
};

export default Page;