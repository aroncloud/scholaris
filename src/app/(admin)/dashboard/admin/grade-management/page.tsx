/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { BookOpen, Calendar, CheckCircle, Save, Download, Award, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Combobox } from '@/components/ui/Combobox';
import { useFactorizedProgramStore } from '@/store/programStore';
import { useEvaluationData } from '@/hooks/feature/exam/useEvaluationData';
import { getEvaluationSheet, submitGrades } from '@/actions/examAction';
import { EvaluationSheet, IStudentEvaluationInfo } from '@/types/examTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { showToast } from '@/components/ui/showToast';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';
import { getListAcademicYearsSchedulesForCurriculum } from '@/actions/programsAction';
import { IGetAcademicYearsSchedulesForCurriculum } from '@/types/planificationType';
import PageHeader from '@/layout/PageHeader';
import ContentLayout from '@/layout/ContentLayout';
import Badge from '@/components/custom-ui/Badge';

// Composant mémorisé pour éviter les re-renders
const ScoreInput = React.memo<{
  enrollmentCode: string;
  initialScore: number | null | undefined;
  maxScore: number;
  onScoreChange: (studentCode: string, score: number) => void;
  isModified: boolean;
  isGraded: boolean;
  locale: "fr" | "en";
}>(({ enrollmentCode, initialScore, maxScore, onScoreChange, isModified, isGraded, locale }) => {
  const [localScore, setLocalScore] = useState(initialScore?.toString() || '');
  const [isValid, setIsValid] = useState(true);

  // Synchroniser avec le score initial
  useEffect(() => {
    setLocalScore(initialScore?.toString() || '');
  }, [initialScore]);

  const handleChange = (value: string) => {
    setLocalScore(value);

    if (value === '') {
      setIsValid(true);
      onScoreChange(enrollmentCode, 0);
      return;
    }

    const numericValue = parseFloat(value);

    if (isNaN(numericValue) || numericValue < 0 || numericValue > maxScore) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
    onScoreChange(enrollmentCode, numericValue);
  };

  const getInputClassName = () => {
    let baseClass = "w-20 text-center";
    if (!isValid) {
      baseClass += " border-red-500 focus:border-red-500";
    } else if (isModified) {
      baseClass += " border-yellow-500 bg-yellow-50";
    } else if (isGraded) {
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
}, (prevProps, nextProps) => {
  // Ne re-render que si ces propriétés changent
  return (
    prevProps.enrollmentCode === nextProps.enrollmentCode &&
    prevProps.initialScore === nextProps.initialScore &&
    prevProps.maxScore === nextProps.maxScore &&
    prevProps.isModified === nextProps.isModified &&
    prevProps.isGraded === nextProps.isGraded &&
    prevProps.onScoreChange === nextProps.onScoreChange
  );
});

ScoreInput.displayName = 'ScoreInput';

// Composant ligne du tableau mémorisé
const StudentRow = React.memo<{
  student: IStudentEvaluationInfo;
  maxScore: number;
  currentScore: number | null | undefined;
  isModified: boolean;
  onScoreChange: (studentCode: string, score: number) => void;
}>(({ student, maxScore, currentScore, isModified, onScoreChange }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="font-mono text-sm font-medium">
          {student.student_number}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">
          {student.first_name} {student.last_name}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge
          value={student.graded ? "APPROVED" : "PENDING"}
          label={student.graded ? "APPROVED" : "PENDING"}
          size='sm'
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <ScoreInput
            enrollmentCode={student.enrollment_code}
            initialScore={currentScore}
            maxScore={maxScore}
            onScoreChange={onScoreChange}
            isModified={isModified}
            isGraded={student.graded}
            locale="fr"
          />
          <span className="text-sm text-muted-foreground">
            / {maxScore}
          </span>
        </div>
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.student.enrollment_code === nextProps.student.enrollment_code &&
    prevProps.currentScore === nextProps.currentScore &&
    prevProps.maxScore === nextProps.maxScore &&
    prevProps.isModified === nextProps.isModified &&
    prevProps.student.graded === nextProps.student.graded &&
    prevProps.onScoreChange === nextProps.onScoreChange
  );
});

StudentRow.displayName = 'StudentRow';

const Page = () => {
    const [selectedCurriculum, setSelectedCurriculum] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [selectedSchedule, setSelectedSchedule] = useState<string>('');
    const [examSheet, setExamSheet] = useState<EvaluationSheet | undefined>(undefined);
    const [isLoadingExamDetail, setIsLoadingExamDetail] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);

    const [modifiedStudents, setModifiedStudents] = useState<Set<string>>(new Set());
    const [studentGrades, setStudentGrades] = useState<Map<string, number>>(new Map());

    // États pour la recherche et la pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const { factorizedPrograms } = useFactorizedProgramStore();
    const { examList, fetchtEvaluationsForSchedule } = useEvaluationData();
    const { selectedAcademicYear } = useAcademicYearStore();

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
                });

                setExamSheet({
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

    // Filtrage et pagination
    const filteredStudents = useMemo(() => {
        if (!examSheet?.students) return [];

        if (!searchQuery) return examSheet.students;

        const query = searchQuery.toLowerCase();
        return examSheet.students.filter(student =>
            student.first_name.toLowerCase().includes(query) ||
            student.last_name.toLowerCase().includes(query) ||
            student.student_number.toLowerCase().includes(query)
        );
    }, [examSheet?.students, searchQuery]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredStudents.slice(startIndex, endIndex);
    }, [filteredStudents, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    // Réinitialiser à la page 1 quand la recherche change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <>
            {/* Header */}
            <PageHeader
                title='Saisie des Notes'
                description='Module de gestion des évaluations'
                Icon={Award}
            >
                <div className="flex items-center space-x-3 w-full">
                    <Button variant="outline" className='flex-1'>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                    </Button>
                    <Button
                        onClick={handleSaveGrades}
                        disabled={modifiedStudents.size === 0 || isSaving}
                        variant={'info'}
                        className='flex-1'
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
            </PageHeader>

            <div className="px-2 pb-2 mt-4 md:px-6 md:pb-6 md:pt-0 mx-auto">
                {/* Selection Panel */}
                <ContentLayout
                    title='Curriculum'
                >
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-0">

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
                                    placeholder="Sélectionner un curriculum"
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
                                    placeholder="Sélectionner un trimestre/semestre"
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
                                    placeholder={"Sélectionner une évaluation"}
                                    className='py-5'
                                />
                            </div>
                        </div>

                    {selectedCurriculum && selectedExam && examSheet?.evaluation&& examSheet?.students  && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200 px-2">
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
                    </>
                </ContentLayout>

                {/* Students Table */}
                {examSheet && (
                    <Card className="w-full pt-0 overflow-hidden my-6">
                        {/* Header */}
                        <CardHeader className="flex flex-col space-y-4 pt-4 border-b bg-gray-50 px-4 md:px-6">
                            {/* Ligne 1: Titre et Badge de statut */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                    <CardTitle className="text-xl lg:text-2xl font-bold tracking-tight">
                                        {examSheet.evaluation.title}
                                    </CardTitle>
                                    <Badge
                                        value={examSheet.evaluation.status}
                                        label={examSheet.evaluation.status}
                                        size='sm'
                                    />
                                </div>

                                {/* Badge de modifications - visible sur tous les écrans */}
                                {modifiedStudents.size > 0 && (
                                    <Badge
                                        value='modification'
                                        label={`${modifiedStudents.size} modification(s)`}
                                        variant='neutral'
                                        size='sm'
                                        className="shrink-0"
                                    />
                                )}
                            </div>

                            {/* Ligne 2: Informations de l'évaluation */}
                            <CardDescription>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        Date d&apos;évaluation:{" "}
                                        {examSheet.evaluation.evaluation_date
                                            ? new Date(examSheet.evaluation.evaluation_date).toLocaleDateString()
                                            : "Non programmée"}
                                    </span>

                                    <Separator orientation="vertical" className="hidden sm:block h-4" />

                                    <span className="flex items-center gap-2">
                                        Note maximale: {examSheet.evaluation.max_score}
                                    </span>

                                    <Separator orientation="vertical" className="hidden sm:block h-4" />

                                    <span className="flex items-center gap-2">
                                        Coefficient: {examSheet.evaluation.coefficient}
                                    </span>
                                </div>
                            </CardDescription>
                        </CardHeader>

                        {/* Table */}
                        <CardContent className="px-2 md:px-6 pt-6">
                            {/* Barre de recherche */}
                            <div className="mb-4 flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher par nom ou numéro d'étudiant..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="text-sm text-gray-500">
                                    {filteredStudents.length} étudiant{filteredStudents.length > 1 ? 's' : ''}
                                </div>
                            </div>

                            {/* Tableau */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">N° Étudiant</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nom Complet</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                                Note (/{examSheet.evaluation.max_score})
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoadingExamDetail || isSaving ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedStudents.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                    {searchQuery ? 'Aucun étudiant trouvé' : 'Aucun étudiant'}
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedStudents.map((student) => (
                                                <StudentRow
                                                    key={student.enrollment_code}
                                                    student={student}
                                                    maxScore={examSheet.evaluation.max_score}
                                                    currentScore={studentGrades.get(student.enrollment_code) ?? student.score}
                                                    isModified={modifiedStudents.has(student.enrollment_code)}
                                                    onScoreChange={updateStudentScore}
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="text-sm text-gray-500">
                                        Page {currentPage} sur {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Précédent
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Suivant
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
};

export default Page;
