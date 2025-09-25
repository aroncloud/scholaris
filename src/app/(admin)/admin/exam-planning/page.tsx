/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { v4 as uuidv4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFactorizedProgramStore } from '@/store/programStore';
import { useClassroomStore } from '@/store/useClassroomStore';
import { useTeacherStore } from '@/store/useTeacherStore';
import { BookOpen, Calendar, GraduationCap, Info, Loader2, AlertCircle, Clock, BookMarked, Target, Search } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react'
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/custom-ui/alert';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createEvaluation, getEvaluationListForCurriculum, getListModulesEvaluationsForCurriculum } from '@/actions/examAction';
import { showToast } from '@/components/ui/showToast';
import { IGetModulePerCurriculum } from '@/types/programTypes';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';
import { Button } from '@/components/ui/button';
import DialogCreateExam from '@/components/features/exam-planning/Modal/DialogCreateExam';
import { ICreateEvaluation, IGetEvaluationsForCurriculum } from '@/types/examTypes';
import { IGetAcademicYearsSchedulesForCurriculum } from '@/types/planificationType';
import { getListAcademicYearsSchedulesForCurriculum } from '@/actions/programsAction';



export default function Page () {
    const { academicYears, getCurrentAcademicYear } = useAcademicYearStore();
    const [selectedCurriculum, setSelectedCurriculum] = useState<string | undefined>(undefined);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | undefined>(undefined);
    const [isIplannificationDialogOpen, setIplannificationDialogOpen] = useState(false);
    const [listEvaluationForCurriculum, setListEvaluationForCurriculum] = useState<IGetEvaluationsForCurriculum[]>();
    const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
    const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);
    const [searchTerm, setSearchTerm] = useState('');



    const { factorizedPrograms } = useFactorizedProgramStore();
    const { teacherList } = useTeacherStore();
    const { classrooms } = useClassroomStore();
    const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

    useEffect(() => {
        // fetchListModulesEvaluationsForCurriculum('', '')
        if(selectedCurriculum && selectedAcademicYear) {
            fetchListAcademicYearsSchedulesForCurriculum(selectedCurriculum, selectedAcademicYear)
            fetchListEvaluationForCurriculum(selectedCurriculum);
        }
    }, [selectedAcademicYear, selectedCurriculum])
    
    useEffect(() => {
        const currentAcademicYear = getCurrentAcademicYear();
        setSelectedAcademicYear(currentAcademicYear ? currentAcademicYear.academic_year_code : undefined);
    }, [getCurrentAcademicYear, selectedAcademicYear, selectedCurriculum])


    const fetchListEvaluationForCurriculum = async (curriculum_code: string) => {
        setIsLoadingEvaluations(true);
        try {
            const result = await getEvaluationListForCurriculum(curriculum_code);
            console.log('-->ListEvaluationForCurriculum.result', result);
            setListEvaluationForCurriculum(result.data.body);
        } catch (error) {
            console.error('Erreur lors du chargement des évaluations:', error);
            setListEvaluationForCurriculum([]);
        } finally {
            setIsLoadingEvaluations(false);
        }
    }

    // const fetchListModulesEvaluationsForCurriculum = async (curriculum_code: string, schedule_code: string) => {
    //     setIsLoadingEvaluations(true);
    //     try {
    //         const result = await getListModulesEvaluationsForCurriculum("CURR_TPMS_Y1", "sched_c08eeafc-0a41-4f9e-b066-ba8bca32d127");
    //         console.log('-->fetchListModulesEvaluationsForCurriculum.result', result);
    //         // setListEvaluationForCurriculum(result.data.body);
    //     } catch (error) {
    //         // console.error('Erreur lors du chargement des évaluations:', error);
    //         // setListEvaluationForCurriculum([]);
    //     } finally {
    //         // setIsLoadingEvaluations(false);
    //     }
    // }
    const fetchListAcademicYearsSchedulesForCurriculum = async (curriculum_code: string, academic_year_code: string) => {
        const result = await getListAcademicYearsSchedulesForCurriculum(curriculum_code, academic_year_code);
        console.log('-->fetchListAcademicYearsSchedulesForCurriculum.result', result)
        setScheduleList(result.data.body)
    }

    const handlePlanExam = async (data: ICreateEvaluation) => {
        const result = await createEvaluation(data);
        if(result.code === 'success'){
            showToast({
                variant: "success-solid",
                message: 'Succès',
                description: 'Date buttoire de depot des dossier fixée avec succès',
                position: 'top-center',
            });

            return true
        } else {
            showToast({
                variant: "error-solid",
                message: 'Erreur',
                description: "Une erreur s'est produite lors de la création de l'evaluation",
                position: 'top-center',
            });
        }
        return false
    }

    // Filtrer les évaluations selon le terme de recherche
    const filteredEvaluations = useMemo(() => {
        if (!listEvaluationForCurriculum) return [];
        if (!searchTerm) return listEvaluationForCurriculum;
        
        return listEvaluationForCurriculum.filter(evaluation =>
            evaluation.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [listEvaluationForCurriculum, searchTerm]);

    // Grouper les évaluations par trimestre
    const evaluationsBySchedule = useMemo(() => {
        const grouped: { [scheduleCode: string]: IGetEvaluationsForCurriculum[] } = {};
        
        filteredEvaluations.forEach(evaluation => {
            if (!grouped[evaluation.schedule_code]) {
                grouped[evaluation.schedule_code] = [];
            }
            grouped[evaluation.schedule_code].push(evaluation);
        });
        
        return grouped;
    }, [filteredEvaluations]);

    const renderEvaluationContent = () => {
        // État de chargement
        if (isLoadingEvaluations) {
            return <LoadingEvaluations />;
        }

        // Aucune évaluation programmée
        if (listEvaluationForCurriculum && listEvaluationForCurriculum.length === 0) {
            return <NoEvaluationsMessage curriculumName={curriculumList.find(c => c.curriculum_code === selectedCurriculum)?.curriculum_name} />;
        }

        // Affichage des évaluations avec tabs par trimestre
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Liste des Évaluations Programmées
                    </CardTitle>
                    <CardDescription>
                        Curriculum sélectionné: {curriculumList.find(c => c.curriculum_code === selectedCurriculum)?.curriculum_name} • {listEvaluationForCurriculum?.length} évaluation(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Barre de recherche */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une évaluation par titre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Vérifier s'il y a des résultats après filtrage */}
                    {filteredEvaluations.length === 0 && searchTerm ? (
                        <div className="text-center py-8">
                            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground">
                                Aucun résultat trouvé
                            </h3>
                            <p className="text-muted-foreground">
                                Aucune évaluation ne correspond à votre recherche &quot;{searchTerm}&quot;
                            </p>
                        </div>
                    ) : (
                        // Tabs par trimestre
                        <Tabs defaultValue={scheduleList[0]?.schedule_code} className="w-full">
                            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${scheduleList.length}, minmax(0, 1fr))` }}>
                                {scheduleList.map((schedule) => {
                                    const evaluationCount = evaluationsBySchedule[schedule.schedule_code]?.length || 0;
                                    return (
                                        <TabsTrigger 
                                            key={schedule.schedule_code} 
                                            value={schedule.schedule_code}
                                            className="text-sm"
                                        >
                                            {schedule.sequence_name}
                                            {evaluationCount > 0 && (
                                                <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                                                    {evaluationCount}
                                                </span>
                                            )}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                            
                            {scheduleList.map((schedule) => {
                                const scheduleEvaluations = evaluationsBySchedule[schedule.schedule_code] || [];
                                
                                return (
                                    <TabsContent key={schedule.schedule_code} value={schedule.schedule_code} className="mt-6">
                                        <div className="space-y-4">
                                            {/* Informations du trimestre */}
                                            <div className="bg-muted/30 rounded-lg p-4">
                                                <h3 className="font-semibold text-lg mb-2">{schedule.sequence_name}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                    <div>
                                                        <span className="font-medium">Période:</span> {new Date(schedule.start_date).toLocaleDateString('fr-FR')} - {new Date(schedule.end_date).toLocaleDateString('fr-FR')}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Statut:</span> {schedule.status_code}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Évaluations pour ce trimestre */}
                                            {scheduleEvaluations.length === 0 ? (
                                                <div className="text-center py-8 bg-muted/10 rounded-lg">
                                                    <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                                    <p className="text-muted-foreground">
                                                        Aucune évaluation programmée pour ce trimestre
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {scheduleEvaluations.map((evaluation) => (
                                                        <EvaluationCard 
                                                            key={evaluation.evaluation_code} 
                                                            evaluation={evaluation}
                                                            schedule={schedule}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                );
                            })}
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* En-tête */}
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3">
                    {/* Bloc gauche : titre + description */}
                    <div className="w-full sm:w-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Gestion des Evaluations
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Programmer la date buttoir de depot des notes de CC et de SN
                    </p>
                    </div>
                </div>
            </div>


            {/* Sélecteur de Curriculum */}
            <Card>
                <CardHeader className='flex justify-between items-start'>
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Sélection du Curriculum
                        </CardTitle>
                        <CardDescription>
                            Choisissez le programme académique pour lequel vous souhaitez gérer les Examens
                        </CardDescription>
                    </div>
                    <CardAction>
                        <div className="w-full sm:w-auto flex justify-end">
                            <Button 
                                variant="info"
                                onClick={() => {setIplannificationDialogOpen(true)}}
                            >
                                Planifier évaluation
                            </Button>
                        </div>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {setSelectedAcademicYear &&
                            <div className="space-y-2">
                                <Label htmlFor="academic-select">
                                    Année académique <span className="text-red-600">*</span>
                                </Label>
                                <Select 
                                    value={selectedAcademicYear} 
                                    onValueChange={setSelectedAcademicYear}
                                >
                                    <SelectTrigger className="w-full" id="academic-select">
                                        <SelectValue placeholder="Sélectionner l'année academique" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {academicYears.map((acy) => (
                                            <SelectItem key={acy.academic_year_code} value={acy.academic_year_code}>
                                                {acy.start_date.split('-')[0]}/{acy.end_date.split('-')[0]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                         }
                        <div className="space-y-2">
                            <Label htmlFor="curriculum-select">
                                Curriculum <span className="text-red-600">*</span>
                            </Label>
                            <Select 
                                value={selectedCurriculum} 
                                onValueChange={setSelectedCurriculum}
                            >
                                <SelectTrigger className="w-full" id="curriculum-select">
                                    <SelectValue placeholder="Sélectionner un curriculum" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    {curriculumList.map((c) => (
                                        <SelectItem key={c.curriculum_code} value={c.curriculum_code}>
                                        {c.curriculum_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contenu conditionnel */}
            {!selectedCurriculum ? (
                <WelcomeMessage />
            ) : (
                renderEvaluationContent()
            )}

            <DialogCreateExam 
                onOpenChange={setIplannificationDialogOpen}
                open={isIplannificationDialogOpen}
                curriculum_code={selectedCurriculum}
                onSave={handlePlanExam}
                academic_year_code={selectedAcademicYear}
            />
        </div>
    )
}


const WelcomeMessage = () => (
    <Card>
        <CardContent>
            <div className="flex flex-col items-center justify-center bm-6 px-4">
                <div className="text-center space-y-6 max-w-xl">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                    Bienvenue dans votre utilitaire de gestion des Examens
                    </h3>
                    <p className="text-muted-foreground">
                    Veuillez sélectionner un curriculum pour commencer la planification de vos examens
                    </p>
                </div>

                <Alert className="text-left">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                    Une fois le curriculum sélectionné, vous pourrez accéder au calendrier de planification des examens et gérer vos programmes académiques.
                    </AlertDescription>
                </Alert>
                </div>
            </div>
        </CardContent>
    </Card>
);

const LoadingEvaluations = () => (
    <Card>
        <CardContent>
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                            Chargement en cours...
                        </h3>
                        <p className="text-muted-foreground">
                            Récupération des évaluations pour ce curriculum
                        </p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const NoEvaluationsMessage = ({ curriculumName }: { curriculumName?: string }) => (
    <Card>
        <CardContent>
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center space-y-6 max-w-xl">
                    <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-amber-500" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                            Aucune évaluation programmée
                        </h3>
                        <p className="text-muted-foreground">
                            Aucune évaluation n&apos;a été trouvée pour le curriculum &quot;{curriculumName}&quot;
                        </p>
                    </div>

                    <Alert className="text-left bg-amber-50 border-amber-200">
                        <Info className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                            Vous pouvez commencer par planifier une nouvelle évaluation en cliquant sur le bouton &quot;Planifier évaluation&quot; ci-dessus.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </CardContent>
    </Card>
);

const EvaluationCard = ({ 
    evaluation, 
    schedule 
}: { 
    evaluation: IGetEvaluationsForCurriculum;
    schedule?: IGetAcademicYearsSchedulesForCurriculum;
}) => {
    const getEvaluationTypeLabel = (type: string) => {
        switch(type) {
            case 'CC': return 'Contrôle Continu';
            case 'EXAM_SEQ': return 'Examen de Séquence';
            default: return type;
        }
    };

    const getTargetLevelLabel = (level: string) => {
        switch(level) {
            case 'COURSE_UNIT': return 'Unité d\'Enseignement';
            case 'MODULE': return 'Module';
            default: return level;
        }
    };

    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'active':
            case 'actif':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed':
            case 'terminé':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled':
            case 'annulé':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                {/* Informations principales */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="font-semibold text-lg text-foreground">{evaluation.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(evaluation.status)}`}>
                                    {evaluation.status}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {getEvaluationTypeLabel(evaluation.evaluation_type_code)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Détails de l'évaluation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Niveau:</span>
                                <span className="font-medium">{getTargetLevelLabel(evaluation.target_level)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookMarked className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Code UE:</span>
                                <span className="font-medium">{evaluation.target_code}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div>
                            <div className="text-muted-foreground">Date limite</div>
                            <div className="font-medium text-orange-600">{formatDate(evaluation.deadline_date)}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Coefficient:</span>
                        <span className="font-semibold text-primary">{evaluation.coefficient}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Note max:</span>
                        <span className="font-semibold">{evaluation.max_score}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};