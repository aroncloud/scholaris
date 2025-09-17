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
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  UserPlus,
  Code,
  BookOpen,
  ListOrdered,
  CalendarDays,
  Power,
  MoreHorizontal,
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
import { formatDate } from "date-fns";

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




    if (!curriculum || !sequenceList) {
        return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-4 sm:p-6">
            <Card>
                <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Aucune donnée de curriculum disponible</p>
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start sm:items-center gap-3">
                                    <Code className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Code Curriculum</p>
                                        <p className="text-sm text-muted-foreground break-all">
                                        {curriculum.curriculum_code}
                                        </p>
                                    </div>
                                    </div>
                                    <div className="flex items-start sm:items-center gap-3">
                                    <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Code Programme</p>
                                        <p className="text-sm text-muted-foreground break-all">
                                        {curriculum.program_code}
                                        </p>
                                    </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start sm:items-center gap-3">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Niveau d'études</p>
                                        <p className="text-sm text-muted-foreground">
                                        {curriculum.study_level}
                                        </p>
                                    </div>
                                    </div>
                                    <div className="flex items-start sm:items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Date de création</p>
                                        <p className="text-sm text-muted-foreground">
                                        {formatDateToText(curriculum.created_at)}
                                        </p>
                                    </div>
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
                                    Séquences de formation
                                </CardTitle>
                                <Badge variant="secondary" className="self-start sm:ml-auto">
                                    {sequenceList.length} séquence{sequenceList.length > 1 ? 's' : ''}
                                </Badge>
                                </div>
                                <CardDescription className="text-sm">
                                Liste des séquences de formation associées à ce curriculum
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sequenceList.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">Aucune séquence de formation trouvée</p>
                                </div>
                                ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    {sequenceList.map((sequence, index) => (
                                    <div key={sequence.sequence_code}>
                                        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex-shrink-0">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-xs sm:text-sm font-semibold text-primary">
                                                {sequence.sequence_number}
                                            </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <h3 className="font-semibold text-sm sm:text-base break-words">
                                                {sequence.sequence_name}
                                            </h3>
                                            <Badge className={getStatusColor(sequence.status_code)} variant="secondary">
                                                {sequence.status_code}
                                            </Badge>
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground break-all">
                                            Code: {sequence.sequence_code}
                                            </p>
                                            {sequence.description && (
                                            <p className="text-xs sm:text-sm leading-relaxed">
                                                {sequence.description}
                                            </p>
                                            )}
                                            {!sequence.description && (
                                            <p className="text-xs sm:text-sm text-muted-foreground italic">
                                                Aucune description disponible
                                            </p>
                                            )}
                                        </div>
                                        </div>
                                        {index < sequenceList.length - 1 && (
                                        <Separator className="my-2 sm:my-2" />
                                        )}
                                    </div>
                                    ))}
                                </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Horaires Académiques</h2>
                        <Badge variant="outline" className="ml-2">
                        {academicYearsSchedulesForCurriculumList.length} élément(s)
                        </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {academicYearsSchedulesForCurriculumList.map((item, index) => (
                        <Card key={`${item.schedule_code}-${index}`} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-semibold text-blue-700">
                                {item.program_name}
                                </CardTitle>
                                <Badge className={getStatusColor(item.status_code)}>
                                {item.status_code}
                                </Badge>
                            </div>
                            <CardDescription className="text-sm text-gray-600">
                                {item.curriculum_name}
                            </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                <div className="flex items-center gap-1 text-gray-500 mb-1">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Année académique</span>
                                </div>
                                <p className="font-medium text-gray-900">{item.academic_year_name}</p>
                                <p className="text-xs text-gray-500">
                                    {formatDateToText(item.academic_year_start)} - {formatDateToText(item.academic_year_end)}
                                </p>
                                </div>
                                
                                <div>
                                <div className="flex items-center gap-1 text-gray-500 mb-1">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">Séquence</span>
                                </div>
                                <p className="font-medium text-gray-900">{item.sequence_name}</p>
                                <p className="text-xs text-gray-500">N° {item.sequence_number}</p>
                                </div>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex items-center gap-1 text-gray-500 mb-2">
                                <BookOpen className="h-4 w-4" />
                                <span className="font-medium text-sm">Période du programme</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Début: {formatDateToText(item.start_date)}</span>
                                <span className="text-gray-600">Fin: {formatDateToText(item.end_date)}</span>
                                </div>
                            </div>

                            <div className="border-t pt-3 space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                <div>
                                    <span className="font-medium">Code Programme:</span>
                                    <p className="text-gray-700">{item.program_code}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Code Curriculum:</span>
                                    <p className="text-gray-700">{item.curriculum_code}</p>
                                </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                <div>
                                    <span className="font-medium">Code Horaire:</span>
                                    <p className="text-gray-700">{item.schedule_code}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Code Séquence:</span>
                                    <p className="text-gray-700">{item.sequence_code}</p>
                                </div>
                                </div>
                            </div>

                            <div className="border-t pt-2">
                                <Badge variant="outline" className="text-xs">
                                Statut académique: {item.academic_year_status}
                                </Badge>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </div>
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