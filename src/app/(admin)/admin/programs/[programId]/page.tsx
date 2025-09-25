/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowLeft,
  GraduationCap,
  Calendar,
  FileText,
  Clock,
  Code,
  BookOpen,
  ListOrdered,
  CalendarDays,
  Power,
  Settings,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getStatusColor, formatDateToText } from "@/lib/utils";
import { getCurriculumDetail, getListAcademicYearsSchedulesForCurriculum, getSemesterForCurriculum } from "@/actions/programsAction";
import { IAcademicYearsSchedulesForCurriculum, IGetCurriculumDetail, IGetTrainingSequenceForCurriculum } from "@/types/programTypes";
import { showToast } from "@/components/ui/showToast";
import { Separator } from "@/components/ui/separator";
import { DialogCreateAcademicYearSchedule } from "@/components/features/planification/Modal/DialogCreateAcademicYearSchedule";
import { ICreateAcademicYearSchedules, ICreateValidationRule } from "@/types/planificationType";
import { createAcademicYearSchedule, createValidationRule } from "@/actions/planificationAction";
import { useAcademicYearSchedules } from "@/hooks/feature/planifincation/useAcademicYearSchedules";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DialogCreateValidationRule } from "@/components/features/planification/DialogCreateValidationRule";

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
    const [isCreateAcademicYearScheduleDialogOpen, setIsCreateAcademicYearScheduleDialogOpen] = useState(false);
    const [isCreateValisationRuleDialogOpen, setIsCreateValisationRuleDialogOpen] = useState(false);
    const [currentAcademicYear, setCurrentAcademicYear] = useState('');
    const [academicYearsSchedulesForCurriculumList, setAcademicYearsSchedulesForCurriculumList] = useState<IAcademicYearsSchedulesForCurriculum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { academicYears } = useAcademicYearStore();

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
            // Recharger les données après création
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
        setIsLoading(true);
        try {
            const result = await getCurriculumDetail(programCode);
            const sequenceListResult = await getSemesterForCurriculum(programCode);
            const historic = await getListAcademicYearsSchedulesForCurriculum(programCode);
            console.log('historic', historic);

            if (result.code === "success" && sequenceListResult.code === "success" && historic.code === "success") {
                console.log("result", result);
                console.log("sequenceListResult", sequenceListResult);
                setCurriculum(result.data.body);
                setSequenceList(sequenceListResult.data.body as IGetTrainingSequenceForCurriculum []);
                setAcademicYearsSchedulesForCurriculumList(historic.data.body);
            } else {
                showToast({
                    variant: "error-solid",
                    message: "Erreur lors du chargement des détails",
                    description:result.error ?? "Une erreur est survenue lors du chargement des détails, essayez encore ou veuillez contacter l'administrateur",
                    position: 'top-center',
                });
                router.push("/admin/programs");
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
    }, [programCode, router]);

    const handleGoBack = () => {
        console.log('Navigation vers /admin/programs');
        router.push("/admin/programs");
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
        <div className="min-h-screen bg-background">
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 sm:px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Navigation et titre */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={handleGoBack}
                                    className="self-start"
                                >
                                    <ArrowLeft size={20} className="mr-2" />
                                    Retour
                                </Button>
                                
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                                            <h1 className="text-lg sm:text-xl font-bold tracking-tight break-words">
                                                {curriculum.curriculum_name}
                                            </h1>
                                        </div>
                                        <Badge className={getStatusColor(curriculum.status_code)} variant="secondary">
                                            {curriculum.status_code}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Actions - Desktop */}
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

                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="container mx-auto px-4 sm:px-6 pb-8">
                    <div className="space-y-6 sm:space-y-8">
                        {/* Informations générales */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                Informations générales
                                </CardTitle>
                                <CardDescription className="text-sm">
                                Détails du curriculum et informations administratives
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Colonne de gauche */}
                                    <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Code className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Code Curriculum</p>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {curriculum.curriculum_code}
                                        </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Code Programme</p>
                                        <p className="text-sm text-gray-600 mt-0.5">
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
                                        <p className="text-sm font-medium text-gray-900">Niveau d'études</p>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {curriculum.study_level}
                                        </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Date de création</p>
                                        <p className="text-sm text-gray-600 mt-0.5">
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
                                        <span className="text-sm font-semibold text-blue-600">
                                        {sequenceList.length}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Séquences</p>
                                        <p className="text-xs text-gray-500">Nombre total de séquence</p>
                                    </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Séquences de formation */}
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                            <ListOrdered className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                            Horaires Académiques
                                        </CardTitle>
                                        <CardDescription className="text-sm mt-1">
                                            Historique des séquences anuelles associées à ce curriculum
                                        </CardDescription>
                                    </div>
                                    {groupedSchedules.length > 0 && (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setIsCreateAcademicYearScheduleDialogOpen(true)}
                                            className="flex items-center gap-2 sm:hidden"
                                        >
                                            <CalendarDays className="h-4 w-4" />
                                            Planifier
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {groupedSchedules.length === 0 ? (
                                    <EmptyAcademicSchedules onPlanClick={() => setIsCreateAcademicYearScheduleDialogOpen(true)} />
                                ) : (
                                    <div className="space-y-4">
                                        {groupedSchedules.map((schedulesForYear) => {
                                            const academicYear = schedulesForYear[0];
                                            
                                            return (
                                                <Card 
                                                    key={academicYear.academic_year_code} 
                                                    className="border border-gray-200 hover:border-gray-300 transition-colors"
                                                >
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <CardTitle className="text-lg font-semibold text-gray-900">
                                                                    {academicYear.academic_year_name}
                                                                </CardTitle>
                                                                <CardDescription className="text-sm text-gray-500 mt-1">
                                                                    {formatDateToText(academicYear.academic_year_start)} - {formatDateToText(academicYear.academic_year_end)}
                                                                </CardDescription>
                                                            </div>
                                                            <div className="flex items-center gap-2 ml-4">
                                                                <Badge className={getStatusColor(academicYear.academic_year_status)}>
                                                                    {academicYear.academic_year_status}
                                                                </Badge>
                                                                {academicYear.academic_year_status === "IN_PROGRESS" && (
                                                                    <Button 
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handlePlanRules(academicYear.academic_year_code)}
                                                                        className="flex items-center gap-1"
                                                                    >
                                                                        <Settings className="h-3 w-3" />
                                                                        <span className="hidden sm:inline">Règles de calcul</span>
                                                                        <span className="sm:hidden">Règles</span>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="pt-0">
                                                        <div className="border-t border-gray-100 pt-3">
                                                            <div className="space-y-1">
                                                                {schedulesForYear.map((sequence) => (
                                                                    <div 
                                                                        key={uuidv4()} 
                                                                        className="flex justify-between items-center py-1.5 text-sm hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                                                                    >
                                                                        <span className="font-medium text-gray-800">
                                                                            {sequence.sequence_name}
                                                                        </span>
                                                                        <span className="text-gray-500 text-xs sm:text-sm">
                                                                            {formatDateToText(sequence.start_date)} - {formatDateToText(sequence.end_date)}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

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

        </div>
    );
}