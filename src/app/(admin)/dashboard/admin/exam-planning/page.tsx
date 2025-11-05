/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFactorizedProgramStore } from '@/store/programStore';
import { BookOpen, Calendar, GraduationCap, Info, Loader2, AlertCircle, Clock, BookMarked, Target, Download, MoreVertical, Edit, Trash2, Copy, TrendingUp, CheckCircle2, XCircle, Clock3, ClipboardList } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createEvaluation, getEvaluationListForCurriculum } from '@/actions/examAction';
import { showToast } from '@/components/ui/showToast';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';
import { Button } from '@/components/ui/button';
import DialogCreateExam from '@/components/features/exam-planning/Modal/DialogCreateExam';
import { ICreateEvaluation, IGetEvaluationsForCurriculum } from '@/types/examTypes';
import { IGetAcademicYearsSchedulesForCurriculum } from '@/types/planificationType';
import { getListAcademicYearsSchedulesForCurriculum } from '@/actions/programsAction';
import PageHeader from '@/layout/PageHeader';
import ContentLayout from '@/layout/ContentLayout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTable, TableColumn } from '@/components/tables/ResponsiveTable';
import StatCard from '@/components/cards/StatCard';

type FilterType = 'all' | 'CC' | 'EXAM_SEQ';
type FilterStatus = 'all' | 'active' | 'pending' | 'completed' | 'cancelled';

export default function Page() {
    const { selectedAcademicYear } = useAcademicYearStore();
    const [selectedCurriculum, setSelectedCurriculum] = useState<string | undefined>(undefined);
    const [isIplannificationDialogOpen, setIplannificationDialogOpen] = useState(false);
    const [listEvaluationForCurriculum, setListEvaluationForCurriculum] = useState<IGetEvaluationsForCurriculum[]>();
    const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
    const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    const { factorizedPrograms } = useFactorizedProgramStore();
    const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

    useEffect(() => {
        if (selectedCurriculum && selectedAcademicYear) {
            fetchListAcademicYearsSchedulesForCurriculum(selectedCurriculum, selectedAcademicYear)
            fetchListEvaluationForCurriculum(selectedCurriculum);
        }
    }, [selectedAcademicYear, selectedCurriculum])

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

    const fetchListAcademicYearsSchedulesForCurriculum = async (curriculum_code: string, academic_year_code: string) => {
        const result = await getListAcademicYearsSchedulesForCurriculum(curriculum_code, academic_year_code);
        console.log('-->fetchListAcademicYearsSchedulesForCurriculum.result', result)
        setScheduleList(result.data.body)
    }

    const handlePlanExam = async (data: ICreateEvaluation) => {
        const result = await createEvaluation(data);
        if (result.code === 'success') {
            showToast({
                variant: "success-solid",
                message: 'Succès',
                description: 'Date buttoire de depot des dossier fixée avec succès',
                position: 'top-center',
            });
            if (selectedCurriculum) {
                fetchListEvaluationForCurriculum(selectedCurriculum);
            }
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

    // Helper functions
    const getEvaluationTypeLabel = (type: string) => {
        switch (type) {
            case 'CC': return 'Contrôle Continu';
            case 'EXAM_SEQ': return 'Examen de Séquence';
            default: return type;
        }
    };

    const getTargetLevelLabel = (level: string) => {
        switch (level) {
            case 'COURSE_UNIT': return 'Unité d\'Enseignement';
            case 'MODULE': return 'Module';
            default: return level;
        }
    };

    const getStatusConfig = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'active':
            case 'actif':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <CheckCircle2 className="w-3 h-3" />,
                    label: 'Actif'
                };
            case 'pending':
            case 'en_attente':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: <Clock3 className="w-3 h-3" />,
                    label: 'En attente'
                };
            case 'completed':
            case 'terminé':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <CheckCircle2 className="w-3 h-3" />,
                    label: 'Terminé'
                };
            case 'cancelled':
            case 'annulé':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <XCircle className="w-3 h-3" />,
                    label: 'Annulé'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <Info className="w-3 h-3" />,
                    label: status
                };
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getDaysUntilDeadline = (dateString: string | null) => {
        if (!dateString) return null;
        const deadline = new Date(dateString);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleEdit = () => {
        showToast({
            variant: "info-solid",
            message: 'Édition',
            description: 'Fonctionnalité d\'édition en cours de développement',
            position: 'top-center',
        });
    };

    const handleDelete = () => {
        showToast({
            variant: "warning-solid",
            message: 'Suppression',
            description: 'Fonctionnalité de suppression en cours de développement',
            position: 'top-center',
        });
    };

    const handleDuplicate = () => {
        showToast({
            variant: "info-solid",
            message: 'Duplication',
            description: 'Fonctionnalité de duplication en cours de développement',
            position: 'top-center',
        });
    };

    // Définir les colonnes du tableau
    const evaluationColumns: TableColumn<IGetEvaluationsForCurriculum>[] = useMemo(() => [
        {
            key: "title",
            label: "Évaluation",
            priority: 'high',
            render: (_, evaluation) => {
                const statusConfig = getStatusConfig(evaluation.status);
                return (
                    <div>
                        <div className="font-semibold text-lg text-foreground mb-2">{evaluation.title}</div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                            </Badge>
                            <Badge variant="outline">
                                {getEvaluationTypeLabel(evaluation.evaluation_type_code)}
                            </Badge>
                        </div>
                    </div>
                );
            },
        },
        {
            key: "target_code",
            label: "Code UE",
            priority: 'high',
            render: (_, evaluation) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <BookMarked className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{evaluation.target_code}</span>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Target className="w-3 h-3" />
                        {getTargetLevelLabel(evaluation.target_level)}
                    </Badge>
                </div>
            ),
        },
        {
            key: "coefficient",
            label: "Coefficient",
            priority: 'medium',
            render: (_, evaluation) => (
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-primary">{evaluation.coefficient}</span>
                </div>
            ),
        },
        {
            key: "max_score",
            label: "Note max",
            priority: 'medium',
            render: (_, evaluation) => (
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{evaluation.max_score}</span>
                </div>
            ),
        },
        {
            key: "deadline_date",
            label: "Date limite",
            priority: 'high',
            render: (_, evaluation) => {
                const daysUntil = getDaysUntilDeadline(evaluation.deadline_date);
                return (
                    <div className="text-center">
                        <div className="font-semibold text-orange-600">{formatDate(evaluation.deadline_date)}</div>
                        {daysUntil !== null && daysUntil >= 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                                Dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                            </div>
                        )}
                        {daysUntil !== null && daysUntil < 0 && (
                            <div className="text-xs text-red-600 font-medium mt-1">
                                Échue depuis {Math.abs(daysUntil)} jour{Math.abs(daysUntil) > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            key: "actions",
            label: "Actions",
            priority: 'high',
            render: (_, evaluation) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleDuplicate}>
                            <Copy className="mr-2 h-4 w-4" />
                            Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ], []);

    // Calcul des statistiques
    const statistics = useMemo(() => {
        if (!listEvaluationForCurriculum) return null;
        
        const total = listEvaluationForCurriculum.length;
        const active = listEvaluationForCurriculum.filter(e => e.status.toLowerCase() === 'active').length;
        const completed = listEvaluationForCurriculum.filter(e => e.status.toLowerCase() === 'completed').length;
        const pending = listEvaluationForCurriculum.filter(e => e.status.toLowerCase() === 'pending').length;
        const cc = listEvaluationForCurriculum.filter(e => e.evaluation_type_code === 'CC').length;
        const exam = listEvaluationForCurriculum.filter(e => e.evaluation_type_code === 'EXAM_SEQ').length;
        
        return { total, active, completed, pending, cc, exam };
    }, [listEvaluationForCurriculum]);

    // Filtrer les évaluations
    const filteredEvaluations = useMemo(() => {
        if (!listEvaluationForCurriculum) return [];

        let filtered = [...listEvaluationForCurriculum];

        // Filtre par type
        if (filterType !== 'all') {
            filtered = filtered.filter(e => e.evaluation_type_code === filterType);
        }

        // Filtre par statut
        if (filterStatus !== 'all') {
            filtered = filtered.filter(e => e.status.toLowerCase() === filterStatus);
        }

        return filtered;
    }, [listEvaluationForCurriculum, filterType, filterStatus]);

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

    const handleExport = () => {
        showToast({
            variant: "info-solid",
            message: 'Export',
            description: 'Fonctionnalité d\'export en cours de développement',
            position: 'top-center',
        });
    };

    const renderEvaluationContent = () => {
        if (isLoadingEvaluations) {
            return <LoadingEvaluations />;
        }

        if (listEvaluationForCurriculum && listEvaluationForCurriculum.length === 0) {
            return <NoEvaluationsMessage curriculumName={curriculumList.find(c => c.curriculum_code === selectedCurriculum)?.curriculum_name} />;
        }

        return (
            <>
                {/* Statistiques */}
                {statistics && (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        <StatCard 
                            icon={BookMarked}
                            title='Total'
                            value={statistics.total}
                            variant='info'
                            compact
                        />
                        <StatCard 
                            icon={CheckCircle2}
                            title="Actives"
                            value={statistics.active}
                            variant='success'
                            compact
                        />
                        <StatCard 
                            icon={Clock3}
                            title="En attente"
                            value={statistics.pending}
                            variant='warning'
                            compact
                        />
                        <StatCard 
                            icon={CheckCircle2}
                            title="Terminées"
                            value={statistics.completed}
                            variant='neutral'
                            compact
                        />
                        <StatCard 
                            icon={Target}
                            title="CC"
                            value={statistics.cc}
                            variant='purple'
                            compact
                        />
                        <StatCard 
                            icon={GraduationCap}
                            title="Examens"
                            value={statistics.exam}
                            compact
                        />
                    </div>
                )}

                <ContentLayout
                    title='Liste des Évaluations Programmées'
                    description={`Curriculum sélectionné: ${curriculumList.find(c => c.curriculum_code === selectedCurriculum)?.curriculum_name} • ${filteredEvaluations.length} évaluation(s) affichée(s)`}
                    actions ={
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Exporter
                        </Button>
                    }
                >
                    <>
                        {/* Vérifier s'il y a des résultats après filtrage */}
                        {filteredEvaluations.length === 0 && (filterType !== 'all' || filterStatus !== 'all') ? (
                            <div className="text-center py-12 bg-muted/10 rounded-lg">
                                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                    Aucun résultat trouvé
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Aucune évaluation ne correspond à vos critères de recherche
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFilterType('all');
                                        setFilterStatus('all');
                                    }}
                                >
                                    Réinitialiser les filtres
                                </Button>
                            </div>
                        ) : (
                            <Tabs defaultValue={scheduleList[0]?.schedule_code} className="w-full">
                                <TabsList className="bg-white rounded-xl border border-slate-200 p-1.5 inline-flex space-x-1 shadow-sm h-auto w-full mt-6 mb-2" style={{ gridTemplateColumns: `repeat(${scheduleList.length}, minmax(0, 1fr))` }}>
                                    {scheduleList.map((schedule) => {
                                        const evaluationCount = evaluationsBySchedule[schedule.schedule_code]?.length || 0;
                                        return (
                                            <TabsTrigger
                                                key={schedule.schedule_code}
                                                value={schedule.schedule_code}
                                                className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
                                            >
                                                {schedule.sequence_name}
                                                {evaluationCount > 0 && (
                                                    <Badge variant="secondary" className="ml-2">
                                                        {evaluationCount}
                                                    </Badge>
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
                                                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                                                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                                        <Calendar className="w-5 h-5 text-primary" />
                                                        {schedule.sequence_name}
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span className="font-medium">Période:</span>
                                                            <span>{new Date(schedule.start_date).toLocaleDateString('fr-FR')} - {new Date(schedule.end_date).toLocaleDateString('fr-FR')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <TrendingUp className="w-4 h-4" />
                                                            <span className="font-medium">Statut:</span>
                                                            <Badge variant="outline">{schedule.status_code}</Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Évaluations pour ce trimestre */}
                                                {scheduleEvaluations.length === 0 ? (
                                                    <div className="text-center py-12 bg-muted/10 rounded-lg border-2 border-dashed">
                                                        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                                                        <p className="text-muted-foreground font-medium">
                                                            Aucune évaluation programmée pour ce trimestre
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <ResponsiveTable
                                                        columns={evaluationColumns}
                                                        data={scheduleEvaluations}
                                                        searchKey={["title", "target_code"]}
                                                        paginate={10}
                                                        locale="fr"
                                                        keyField="evaluation_code"
                                                    />
                                                )}
                                            </div>
                                        </TabsContent>
                                    );
                                })}
                            </Tabs>
                        )}
                    </>
                </ContentLayout>
            </>
        );
    };

    return (
        <>
            <PageHeader
                title="Gestion des Evaluations"
                Icon={ClipboardList}
                description="Programmer la date buttoir de depot des notes de CC et de SN"
            />
            <div className="container mx-auto p-6 space-y-6">
                {/* Sélecteur de Curriculum */}
                <ContentLayout
                    title='Sélection du Curriculum'
                    description="Choisissez le programme académique pour lequel vous souhaitez gérer les Examens"
                    actions = {
                        <div className="w-full sm:w-auto flex justify-end">
                            <Button
                                variant="info"
                                onClick={() => { setIplannificationDialogOpen(true) }}
                                disabled={!selectedCurriculum}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Planifier évaluation
                            </Button>
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </ContentLayout>

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
        </>
    )
}

// Composant StatCard

const WelcomeMessage = () => (
    <Card>
        <CardContent>
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center space-y-6 max-w-xl">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">
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
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
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
                    <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-200">
                        <AlertCircle className="w-10 h-10 text-amber-500" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">
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