/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Calendar,
  FileText,
  Code,
  BookOpen,
  ListOrdered,
  CalendarDays,
  Power,
  Settings,
  AlertCircle,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getStatusColor, formatDateToText } from "@/lib/utils";
import { getCurriculumDetail, getListAcademicYearsSchedulesForCurriculum, getSemesterForCurriculum } from "@/actions/programsAction";
import { IAcademicYearsSchedulesForCurriculum, IGetCurriculumDetail, IGetTrainingSequenceForCurriculum } from "@/types/programTypes";
import { showToast } from "@/components/ui/showToast";
import { DialogCreateAcademicYearSchedule } from "@/components/features/planification/Modal/DialogCreateAcademicYearSchedule";
import { ICreateAcademicYearSchedules, ICreateValidationRule } from "@/types/planificationType";
import { createAcademicYearSchedule, createValidationRule } from "@/actions/planificationAction";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { DialogCreateValidationRule } from "@/components/features/planification/DialogCreateValidationRule";
import PageHeader from "@/layout/PageHeader";
import ContentLayout from "@/layout/ContentLayout";
import { getCurriculumnEnrollments } from "@/actions/studentAction";
import { IGetEnrolledStudent } from "@/types/userType";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";

// Composant de chargement
const LoadingCard = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </CardContent>
  </Card>
);

// Composant de chargement principal
const LoadingPage = () => (
  <div className="min-h-screen bg-background">
    <div className="space-y-4 sm:space-y-6">
      {/* Header Loading */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Loading */}
      <main className="container mx-auto px-4 sm:px-6 pb-8">
        <div className="space-y-6 sm:space-y-8">
          <LoadingCard />
          <LoadingCard />
        </div>
      </main>
    </div>
  </div>
);

// Composant pour l'état vide des horaires académiques
const EmptyAcademicSchedules = ({ onPlanClick }: { onPlanClick: () => void }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <CalendarDays className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Aucun horaire académique planifié
    </h3>
    <p className="text-gray-500 max-w-md mx-auto mb-6">
      Il n'y a pas encore d'horaires académiques associés à ce curriculum. 
      Commencez par planifier les séquences pour créer votre premier horaire.
    </p>
    <Button 
      onClick={onPlanClick}
      className="inline-flex items-center gap-2"
      variant='info'
    >
      <CalendarDays className="w-4 h-4" />
      Planifier les séquences
    </Button>
  </div>
);


export default function EnrollmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const programCode = params.programId as string;
    
    const [curriculum, setCurriculum] = useState<IGetCurriculumDetail | null>(null);
    const [sequenceList, setSequenceList] = useState<IGetTrainingSequenceForCurriculum []>([]);
    const [enrolledStudents, setEnrolledStudents] = useState<IGetEnrolledStudent[]>([]);
    const [isCreateAcademicYearScheduleDialogOpen, setIsCreateAcademicYearScheduleDialogOpen] = useState(false);
    const [isCreateValisationRuleDialogOpen, setIsCreateValisationRuleDialogOpen] = useState(false);
    const [currentAcademicYear, setCurrentAcademicYear] = useState('');
    const [academicYearsSchedulesForCurriculumList, setAcademicYearsSchedulesForCurriculumList] = useState<IAcademicYearsSchedulesForCurriculum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { academicYears, selectedAcademicYear } = useAcademicYearStore();

    // Table columns for enrolled students
    const enrolledStudentsColumns = useMemo<TableColumn<IGetEnrolledStudent>[]>(() => [
        {
            key: 'student_number',
            label: 'Matricule',
            priority: 'high',
        },
        {
            key: 'last_name',
            label: 'Nom',
            priority: 'high',
        },
        {
            key: 'first_name',
            label: 'Prénom',
            priority: 'high',
        },
        {
            key: 'gender',
            label: 'Genre',
            priority: 'medium',
        },
        {
            key: 'enrollment_date',
            label: 'Date d\'inscription',
            priority: 'medium',
            render: (value) => formatDateToText(value),
        },
        {
            key: 'status_code',
            label: 'Statut',
            priority: 'high',
            render: (value) => (
                <Badge className={getStatusColor(value)} variant="secondary">
                    {value}
                </Badge>
            ),
        },
        {
            key: 'inscription_paid',
            label: 'Frais payés',
            priority: 'medium',
            render: (value) => (
                <div className="flex items-center gap-2">
                    {value ? (
                        <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">Oui</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-red-600 font-medium">Non</span>
                        </>
                    )}
                </div>
            ),
        },
    ], []);

    const handlePlanSequences = async (aysList: ICreateAcademicYearSchedules[]) => {
        console.log('aysList', aysList);
        const results = await Promise.all(
            aysList.map((ays) => createAcademicYearSchedule(ays))
        );

        const allSuccess = results.every(r => r.code === "success");

        if (allSuccess) {
            setIsCreateAcademicYearScheduleDialogOpen(false);
            showToast({
                variant: "success-solid",
                message: `Semestre(s) planifié(s) avec succès`,
                description: `Les ${aysList.length} semestre(s) de l'année academique ${academicYears.find(ay => ay.academic_year_code === aysList[0].academic_year_code)?.year_code} ont été planifié(s).`,
                position: 'top-center',
            });
            loadApplicationDetails();
        } else {
            showToast({
                variant: "error-solid",
                message: "Impossible de créer le domaine",
                description: "Au moins un semestre n'a pas pu être créé",
                position: 'top-center',
            });
            await loadApplicationDetails();
            return true;
        }

        return false;
    };


    const handleCreateValidationRule = async (data: ICreateValidationRule) => {
        console.log('handleCreateValidationRule.payload', data);

        const results = await createValidationRule(data);


        if (results.code == 'success') {
            setIsCreateAcademicYearScheduleDialogOpen(false);
            showToast({
                variant: "success-solid",
                message: `Affectuée avec succès`,
                description: `Règle de calcul pour la filière ${curriculum?.curriculum_name} enregistré avec succès.`,
                position: 'top-center',
            });
            // Recharger les données après création
            loadApplicationDetails();
            setIsCreateValisationRuleDialogOpen(false)
        } else {
            showToast({
                variant: "error-solid",
                message: "Impossible de créer la règle de calcul",
                description: results.error ?? "Une erreur est survenue lors de la création de la règle de calcul, essayez encore ou veuillez contacter l'administrateur",
                position: 'top-center',
            });
            await loadApplicationDetails();
            return true;
        }

        return false;
    };

    const loadApplicationDetails = useCallback(async () => {
        try {
            if(selectedAcademicYear) {
                setIsLoading(true);
                const result = await getCurriculumDetail(programCode);
                const sequenceListResult = await getSemesterForCurriculum(programCode);
                const historic = await getListAcademicYearsSchedulesForCurriculum(programCode);
                const enrolledStudents = await getCurriculumnEnrollments(programCode, selectedAcademicYear);
                console.log('-->Payload', selectedAcademicYear, programCode)
                console.log('-->enrolledStudents', enrolledStudents)
                console.log('historic', historic);

                if (result.code === "success" && sequenceListResult.code === "success" && historic.code === "success" && enrolledStudents.code === "success") {
                    console.log("result", result);
                    console.log("sequenceListResult", sequenceListResult);
                    setCurriculum(result.data.body);
                    setSequenceList(sequenceListResult.data.body as IGetTrainingSequenceForCurriculum []);
                    setAcademicYearsSchedulesForCurriculumList(historic.data.body);
                    setEnrolledStudents(enrolledStudents.data.body);
                } else {
                    showToast({
                        variant: "error-solid",
                        message: "Erreur lors du chargement des détails",
                        description:result.error ?? "Une erreur est survenue lors du chargement des détails, essayez encore ou veuillez contacter l'administrateur",
                        position: 'top-center',
                    });
                    router.push("/dashboard/admin/programs");
                }
            }
        } catch (error) {
            showToast({
                variant: "error-solid",
                message: "Erreur lors du chargement",
                description: "Une erreur inattendue s'est produite",
                position: 'top-center',
            });
        } finally {
            setIsLoading(false);
        }
    }, [programCode, router, selectedAcademicYear]);

    const handleGoBack = () => {
        console.log('Navigation vers /dashboard/admin/programs');
        router.push("/dashboard/admin/programs");
    }

    const handleDeactivate = () => {
        console.log('Désactiver le curriculum');
    };

    const handlePlanRules = (academic_year_code: string) => {
        setCurrentAcademicYear(academic_year_code);
        setIsCreateValisationRuleDialogOpen(true)
    }

    useEffect(() => {
        loadApplicationDetails();
    }, [programCode, loadApplicationDetails]);

    function groupSchedulesByAcademicYear(
        schedules: IAcademicYearsSchedulesForCurriculum[]
        ): IAcademicYearsSchedulesForCurriculum[][] {
        const grouped = schedules.reduce((accumulator, currentSchedule) => {
            const { academic_year_code } = currentSchedule;
            
            if (!accumulator[academic_year_code]) {
            accumulator[academic_year_code] = [];
            }

            accumulator[academic_year_code].push(currentSchedule);

            return accumulator;
        }, {} as Record<string, IAcademicYearsSchedulesForCurriculum[]>);

        return Object.values(grouped);
    }

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!curriculum || !sequenceList) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto p-4 sm:p-6">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Données non disponibles
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Aucune donnée de curriculum disponible pour ce programme.
                            </p>
                            <Button onClick={handleGoBack} variant="outline">
                                Retour à la liste des programmes
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const groupedSchedules = groupSchedulesByAcademicYear(academicYearsSchedulesForCurriculumList);

    return (
        <>
            <PageHeader
                title={curriculum.curriculum_name}
                backLabel="Maquettes"
                backUrl="/dashboard/admin/programs"
                loading={isLoading}
                status={
                    <Badge className={getStatusColor(curriculum.status_code)} variant="secondary">
                        {curriculum.status_code}
                    </Badge>
                }
            >
                <div className="hidden sm:flex items-center gap-2">
                    <Button 
                        variant="info" 
                        onClick={() => setIsCreateAcademicYearScheduleDialogOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <CalendarDays className="h-4 w-4" />
                        Planifier les séquences
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeactivate}
                        className="flex items-center gap-2"
                    >
                        <Power className="h-4 w-4" />
                        Désactiver
                    </Button>
                </div>
            </PageHeader>
            
            <main className="container mx-auto px-4 sm:px-6 py-6">
                <div className="space-y-6 sm:space-y-5">
                    {/* Informations générales */}
                    <ContentLayout
                        icon={<FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />}
                        title="Informations générales"
                        description="Détails du curriculum et informations administratives"
                        
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Colonne de gauche */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Code className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="otf font-medium text-gray-900">Code Curriculum</p>
                                        <p className="otf text-gray-600 mt-0.5">
                                            {curriculum.curriculum_code}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <BookOpen className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="otf font-medium text-gray-900">Code Programme</p>
                                        <p className="otf text-gray-600 mt-0.5">
                                            {curriculum.program_code}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Colonne de droite */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="otf font-medium text-gray-900">Niveau d'études</p>
                                        <p className="otf text-gray-600 mt-0.5">
                                            {curriculum.study_level}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="otf font-medium text-gray-900">Date de création</p>
                                        <p className="otf text-gray-600 mt-0.5">
                                            {formatDateToText(curriculum.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section séparée pour les statistiques */}
                        <div className="border-t border-gray-100 mt-6 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <span className="otf font-semibold text-blue-600">
                                        {sequenceList.length}
                                    </span>
                                </div>
                                <div>
                                    <p className="otf font-medium text-gray-900">Séquences</p>
                                    <p className="text-sm text-gray-500">Nombre total de séquence</p>
                                </div>
                            </div>
                        </div>
                    </ContentLayout>

                    {/* Séquences de formation */}
                    <ContentLayout
                        icon={<CalendarDays className="h-5 w-5 text-gray-500 flex-shrink-0" />}
                        title="Horaires Académiques"
                        
                        actions={
                            groupedSchedules.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsCreateAcademicYearScheduleDialogOpen(true)}
                                    className="flex items-center gap-1.5"
                                >
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Planifier
                                </Button>
                            )
                        }
                    >
                        {groupedSchedules.length === 0 ? (
                            <EmptyAcademicSchedules onPlanClick={() => setIsCreateAcademicYearScheduleDialogOpen(true)} />
                        ) : (
                            <div className="space-y-2">
                                {groupedSchedules.map((schedulesForYear) => {
                                    const academicYear = schedulesForYear[0];

                                    return (
                                        <div
                                            key={academicYear.academic_year_code}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Badge className={getStatusColor(academicYear.academic_year_status)} variant="outline">
                                                    {academicYear.academic_year_status}
                                                </Badge>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
                                                    <span className="font-medium text-gray-900 text-sm truncate">
                                                        {academicYear.academic_year_name}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        ({schedulesForYear.length} séquence{schedulesForYear.length > 1 ? 's' : ''})
                                                    </span>
                                                </div>
                                            </div>
                                            {academicYear.academic_year_status === "IN_PROGRESS" && (
                                                <Button
                                                    className="inline-flex items-center gap-2"
                                                    variant='outline'
                                                    onClick={() => handlePlanRules(academicYear.academic_year_code)}
                                                >
                                                    <Settings className="h-3.5 w-3.5" />
                                                    <span className="text-xs">Règles</span>
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ContentLayout>

                    {/* Enrolled Students */}
                    <ContentLayout
                        icon={<Users className="h-5 w-5 text-gray-500 flex-shrink-0" />}
                        title="Étudiants inscrits"
                        description={`Liste des étudiants inscrits pour l'année académique ${selectedAcademicYear}`}
                        
                    >
                        <ResponsiveTable
                            columns={enrolledStudentsColumns}
                            data={enrolledStudents}
                            searchKey={['student_number', 'first_name', 'last_name']}
                            keyField="enrollment_code"
                            locale="fr"
                            isLoading={isLoading}
                            paginate={10}
                        />
                    </ContentLayout>
                </div>
            </main>
            
            <DialogCreateAcademicYearSchedule
                open = {isCreateAcademicYearScheduleDialogOpen}
                onSave={handlePlanSequences}
                onOpenChange={setIsCreateAcademicYearScheduleDialogOpen}
                sequenceList={sequenceList}
            />
            
            {
                (academicYears && academicYears.length > 0 && curriculum) && (() => {
                    const selectedAcademicYear = academicYears.find(
                    (ay) => ay.academic_year_code === currentAcademicYear
                    );

                    if (!selectedAcademicYear) return null;

                    return (
                    <DialogCreateValidationRule
                        academicYear={{
                        code: selectedAcademicYear.academic_year_code,
                        name:
                            selectedAcademicYear.start_date +
                            " / " +
                            selectedAcademicYear.end_date,
                        }}
                        curriculum={{
                        name: curriculum.curriculum_name,
                        code: curriculum.curriculum_code,
                        }}
                        onOpenChange={setIsCreateValisationRuleDialogOpen}
                        onSave={handleCreateValidationRule}
                        open={isCreateValisationRuleDialogOpen}
                    />
                    );
                })()
            }

        </>
    );
}