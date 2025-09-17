/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
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
} from "lucide-react";
import { getStatusColor, formatDateToText } from "@/lib/utils";
import { getCurriculumDetail, getListAcademicYearsSchedulesForCurriculum, getSemesterForCurriculum } from "@/actions/programsAction";
import { IAcademicYearsSchedulesForCurriculum, IGetCurriculumDetail, IGetTrainingSequenceForCurriculum } from "@/types/programTypes";
import { showToast } from "@/components/ui/showToast";
import { Separator } from "@/components/ui/separator";
import { DialogCreateAcademicYearSchedule } from "@/components/features/planification/Modal/DialogCreateAcademicYearSchedule";
import { ICreateAcademicYearSchedules } from "@/types/planificationType";
import { createAcademicYearSchedule } from "@/actions/planificationAction";
import { useAcademicYearSchedules } from "@/hooks/feature/planifincation/useAcademicYearSchedules";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function EnrollmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const programCode = params.programId as string;
    
    const [curriculum, setCurriculum] = useState<IGetCurriculumDetail | null>(null);
    const [sequenceList, setSequenceList] = useState<IGetTrainingSequenceForCurriculum []>([]);
    const [isCreateAcademicYearScheduleDialogOpen, setIsCreateAcademicYearScheduleDialogOpen] = useState(false);
    const [academicYearsSchedulesForCurriculumList, setAcademicYearsSchedulesForCurriculumList] = useState<IAcademicYearsSchedulesForCurriculum[]>([])
    const { academicYears } = useAcademicYearStore();
    const {refresh} = useAcademicYearSchedules();

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
            // refresh();
        } else {
            showToast({
                variant: "error-solid",
                message: "Impossible de créer le domaine",
                description: "Au moins un semestre n’a pas pu être créé",
                position: 'top-center',
            });

            return false;
        }

        return true;
    };


    const loadApplicationDetails = useCallback(async () => {
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
        
    }, [programCode, router]);


    const handleGoBack = () => {
        console.log('Navigation vers /admin/programs');
    }

    const handleDeactivate = () => {
        console.log('Désactiver le curriculum');
    };
    

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


    if (!curriculum || !sequenceList) {
        return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-4 sm:p-6">
            <Card>
                <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Aucune donnée de curriculum disponible.</p>
                </CardContent>
            </Card>
            </div>
        </div>
        );
    }

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
                                
                                {curriculum && (
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
                                )}
                            </div>

                            {/* Actions - Desktop */}
                            <div className="hidden sm:flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsCreateAcademicYearScheduleDialogOpen(true)}
                                    className="flex items-center gap-2"
                                >
                                    <CalendarDays className="h-4 w-4" />
                                    Planifier les séquences
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={handleDeactivate}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
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
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                        <ListOrdered className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                        <h2 className="text-2xl font-bold text-gray-900">Horaires Académiques</h2>
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-sm">
                                    Historique des séquences anuelles associées à ce curriculum
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="">
                                    <div className="space-y-4">
                                        {groupSchedulesByAcademicYear(academicYearsSchedulesForCurriculumList).map((schedulesForYear) => {
                                            const academicYear = schedulesForYear[0];
                                            
                                            return (
                                            <Card 
                                                key={academicYear.academic_year_code} 
                                                className="border border-gray-200 hover:border-gray-300 transition-colors"
                                            >
                                                <CardHeader className="">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                        <CardTitle className="text-lg font-semibold text-gray-900">
                                                            {academicYear.academic_year_name}
                                                        </CardTitle>
                                                        <CardDescription className="text-sm text-gray-500 mt-1">
                                                            {formatDateToText(academicYear.academic_year_start)} - {formatDateToText(academicYear.academic_year_end)}
                                                        </CardDescription>
                                                        </div>
                                                        <Badge className={getStatusColor(academicYear.academic_year_status)}>
                                                            {academicYear.academic_year_status}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="pt-0">
                                                    <div className="border-t border-gray-100 pt-3">
                                                        <div className="space-y-1">
                                                        {schedulesForYear.map((sequence) => (
                                                            <div 
                                                            key={uuidv4()} 
                                                            className="flex justify-between items-center py-1.5 text-sm"
                                                            >
                                                            <span className="font-medium text-gray-800">
                                                                {sequence.sequence_name}
                                                            </span>
                                                            <span className="text-gray-500">
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
                                </div>
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
        </div>
    );
}