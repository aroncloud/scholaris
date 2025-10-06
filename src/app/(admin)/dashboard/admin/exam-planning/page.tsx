/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFactorizedProgramStore } from '@/store/programStore';
import { BookOpen, Calendar, GraduationCap, Info, Loader2, AlertCircle, Clock, BookMarked, Target, Search, Filter, Download, Grid3x3, List, MoreVertical, Edit, Trash2, Copy, TrendingUp, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react'
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/custom-ui/alert';
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

type ViewMode = 'grid' | 'list';
type SortBy = 'date' | 'title' | 'coefficient' | 'type';
type FilterType = 'all' | 'CC' | 'EXAM_SEQ';
type FilterStatus = 'all' | 'active' | 'pending' | 'completed' | 'cancelled';

export default function Page() {
    const { selectedAcademicYear } = useAcademicYearStore();
    const [selectedCurriculum, setSelectedCurriculum] = useState<string | undefined>(undefined);
    const [isIplannificationDialogOpen, setIplannificationDialogOpen] = useState(false);
    const [listEvaluationForCurriculum, setListEvaluationForCurriculum] = useState<IGetEvaluationsForCurriculum[]>();
    const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
    const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Nouveaux états pour les filtres et options
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [sortBy, setSortBy] = useState<SortBy>('date');
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

    // Filtrer et trier les évaluations
    const filteredAndSortedEvaluations = useMemo(() => {
        if (!listEvaluationForCurriculum) return [];
        
        let filtered = [...listEvaluationForCurriculum];
        
        // Recherche
        if (searchTerm) {
            filtered = filtered.filter(evaluation =>
                evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                evaluation.target_code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filtre par type
        if (filterType !== 'all') {
            filtered = filtered.filter(e => e.evaluation_type_code === filterType);
        }
        
        // Filtre par statut
        if (filterStatus !== 'all') {
            filtered = filtered.filter(e => e.status.toLowerCase() === filterStatus);
        }
        
        // Tri
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.deadline_date || 0).getTime() - new Date(a.deadline_date || 0).getTime();
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'coefficient':
                    return b.coefficient - a.coefficient;
                case 'type':
                    return a.evaluation_type_code.localeCompare(b.evaluation_type_code);
                default:
                    return 0;
            }
        });
        
        return filtered;
    }, [listEvaluationForCurriculum, searchTerm, filterType, filterStatus, sortBy]);

    // Grouper les évaluations par trimestre
    const evaluationsBySchedule = useMemo(() => {
        const grouped: { [scheduleCode: string]: IGetEvaluationsForCurriculum[] } = {};
        
        filteredAndSortedEvaluations.forEach(evaluation => {
            if (!grouped[evaluation.schedule_code]) {
                grouped[evaluation.schedule_code] = [];
            }
            grouped[evaluation.schedule_code].push(evaluation);
        });
        
        return grouped;
    }, [filteredAndSortedEvaluations]);

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
                            icon={<BookMarked className="w-4 h-4" />}
                            label="Total"
                            value={statistics.total}
                            color="blue"
                        />
                        <StatCard 
                            icon={<CheckCircle2 className="w-4 h-4" />}
                            label="Actives"
                            value={statistics.active}
                            color="green"
                        />
                        <StatCard 
                            icon={<Clock3 className="w-4 h-4" />}
                            label="En attente"
                            value={statistics.pending}
                            color="yellow"
                        />
                        <StatCard 
                            icon={<CheckCircle2 className="w-4 h-4" />}
                            label="Terminées"
                            value={statistics.completed}
                            color="indigo"
                        />
                        <StatCard 
                            icon={<Target className="w-4 h-4" />}
                            label="CC"
                            value={statistics.cc}
                            color="purple"
                        />
                        <StatCard 
                            icon={<GraduationCap className="w-4 h-4" />}
                            label="Examens"
                            value={statistics.exam}
                            color="pink"
                        />
                    </div>
                )}

                <ContentLayout
                    title='Liste des Évaluations Programmées'
                    description={`Curriculum sélectionné: ${curriculumList.find(c => c.curriculum_code === selectedCurriculum)?.curriculum_name} • ${filteredAndSortedEvaluations.length} évaluation(s) affichée(s)`}
                >
                    <>
                        {/* Barre de recherche et filtres */}
                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Recherche */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher une évaluation par titre ou code UE..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                
                                {/* Actions */}
                                <div className="flex gap-2">
                                    <div className="flex border rounded-md">
                                        <Button
                                            variant={viewMode === 'list' ? "default" : "ghost"}
                                            size="icon"
                                            onClick={() => setViewMode('list')}
                                            className="rounded-r-none"
                                        >
                                            <List className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={viewMode === 'grid' ? "default" : "ghost"}
                                            size="icon"
                                            onClick={() => setViewMode('grid')}
                                            className="rounded-l-none"
                                        >
                                            <Grid3x3 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleExport}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                        </div>

                        {/* Vérifier s'il y a des résultats après filtrage */}
                        {filteredAndSortedEvaluations.length === 0 && (searchTerm || filterType !== 'all' || filterStatus !== 'all') ? (
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
                                        setSearchTerm('');
                                        setFilterType('all');
                                        setFilterStatus('all');
                                    }}
                                >
                                    Réinitialiser la recherche
                                </Button>
                            </div>
                        ) : (
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
                                                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-4 border border-primary/20">
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
                                                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                                                        {scheduleEvaluations.map((evaluation) => (
                                                            <EvaluationCard
                                                                key={evaluation.evaluation_code}
                                                                evaluation={evaluation}
                                                                schedule={schedule}
                                                                viewMode={viewMode}
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
                    </>
                </ContentLayout>
            </>
        );
    };

    return (
        <>
            <PageHeader
                title="Gestion des Evaluations"
                description="Programmer la date buttoir de depot des notes de CC et de SN"
            />
            <div className="container mx-auto p-6 space-y-6">
                {/* Sélecteur de Curriculum */}
                <Card>
                    <CardHeader className='flex justify-between items-start'>
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Sélection du Curriculum
                            </CardTitle>
                            <CardDescription className='mt-2'>
                                Choisissez le programme académique pour lequel vous souhaitez gérer les Examens
                            </CardDescription>
                        </div>
                        <CardAction>
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
                        </CardAction>
                    </CardHeader>
                    <CardContent>
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
        </>
    )
}

// Composant StatCard
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        pink: 'bg-pink-50 text-pink-600 border-pink-200',
    };

    return (
        <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
            <div className="flex items-center justify-between mb-2">
                {icon}
                <span className="text-2xl font-bold">{value}</span>
            </div>
            <p className="text-xs font-medium">{label}</p>
        </div>
    );
};

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

const EvaluationCard = ({
    evaluation,
    schedule,
    viewMode
}: {
    evaluation: IGetEvaluationsForCurriculum;
    schedule?: IGetAcademicYearsSchedulesForCurriculum;
    viewMode: ViewMode;
}) => {
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

    const statusConfig = getStatusConfig(evaluation.status);
    const daysUntil = getDaysUntilDeadline(evaluation.deadline_date);

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

    if (viewMode === 'grid') {
        return (
            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-base line-clamp-2">{evaluation.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                                    {statusConfig.icon}
                                    {statusConfig.label}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {getEvaluationTypeLabel(evaluation.evaluation_type_code)}
                                </Badge>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Éditer
                                </DropdownMenuItem>
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
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">Niveau:</span>
                            <span className="font-medium truncate">{getTargetLevelLabel(evaluation.target_level)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookMarked className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">Code:</span>
                            <span className="font-medium truncate">{evaluation.target_code}</span>
                        </div>
                    </div>

                    <div className="pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Date limite</span>
                            <div className="text-right">
                                <div className="font-medium text-orange-600">{formatDate(evaluation.deadline_date)}</div>
                                {daysUntil !== null && daysUntil >= 0 && (
                                    <div className="text-xs text-muted-foreground">
                                        Dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                                    </div>
                                )}
                                {daysUntil !== null && daysUntil < 0 && (
                                    <div className="text-xs text-red-600">
                                        Échue depuis {Math.abs(daysUntil)} jour{Math.abs(daysUntil) > 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Coefficient</span>
                            <span className="font-semibold text-primary">{evaluation.coefficient}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Note max</span>
                            <span className="font-semibold">{evaluation.max_score}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Vue liste
    return (
        <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-600">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Informations principales */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-semibold text-lg text-foreground mb-2">{evaluation.title}</h4>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                                    {statusConfig.icon}
                                    {statusConfig.label}
                                </Badge>
                                <Badge variant="outline">
                                    {getEvaluationTypeLabel(evaluation.evaluation_type_code)}
                                </Badge>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    {getTargetLevelLabel(evaluation.target_level)}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Détails de l'évaluation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <BookMarked className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Code UE:</span>
                            <span className="font-medium">{evaluation.target_code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Coefficient:</span>
                            <span className="font-semibold text-primary">{evaluation.coefficient}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Note max:</span>
                            <span className="font-semibold">{evaluation.max_score}</span>
                        </div>
                    </div>
                </div>

                {/* Date et actions */}
                <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-2 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-4">
                    <div className="text-center lg:text-right flex-1 lg:flex-none">
                        <div className="text-xs text-muted-foreground mb-1">Date limite</div>
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Éditer
                            </DropdownMenuItem>
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
                </div>
            </div>
        </div>
    );
};