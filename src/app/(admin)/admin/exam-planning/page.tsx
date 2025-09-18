/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import CalendarExamPlanification from '@/components/features/exam-planning/Calendar/CalendarExamPlanification';
import { IFullCalendarEvent } from '@/components/features/planification/Calendar/CalendarPlanification';
import { v4 as uuidv4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFactorizedProgramStore } from '@/store/programStore';
import { useClassroomStore } from '@/store/useClassroomStore';
import { useTeacherStore } from '@/store/useTeacherStore';
import { BookOpen, Calendar, ChevronDown, ChevronRight, GraduationCap, Info, MoreHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/custom-ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEvaluationListForCurriculum } from '@/actions/examAction';
import { useEvaluationData } from '@/hooks/feature/exam/useEvaluationData';
import { getModuleListPerCurriculum } from '@/actions/programsAction';
import { showToast } from '@/components/ui/showToast';
import { IGetModulePerCurriculum } from '@/types/programTypes';
import ModuleTab from '@/components/features/exam-planning/Table/ModuleTab';



const stats = [
  {
    title: 'Filières actives',
    value: '2',
    description: 'Programmes proposés'
  },
  {
    title: 'Maquettes validées',
    value: '1',
    description: 'Structures pédagogiques'
  },
  {
    title: 'Modules enseignés',
    value: '4',
    description: "Unités d'enseignement"
  },
  {
    title: "Capacité d'accueil",
    value: 200,
    description: 'Étudiants maximum'
  },
]



export default function Page () {
    const [selectedCurriculum, setSelectedCurriculum] = useState<string>("");
    const [selectedUE, setSelectedselectedUE] = useState<string>("");
    const [events, setEvents] = useState<IFullCalendarEvent[]>([]);
    const [moduleList, setModuleList] = useState<IGetModulePerCurriculum[]>([]);
    const [isCardExpanded, setIsCardExpanded] = useState(false);


    const { factorizedPrograms, UEPerCurriculumList } = useFactorizedProgramStore();
    const { fetchEvaluationForCurriculum, fetchEvaluationForTeacher } = useEvaluationData();
    const { teacherList } = useTeacherStore();
    const { classrooms } = useClassroomStore();
    const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);
    const ueList = selectedCurriculum ? UEPerCurriculumList[selectedCurriculum] || [] : [];

    useEffect(() => {
        if(selectedCurriculum.trim().length > 0) {
            getModulePerCurriculum(selectedCurriculum);
        }
    }, [selectedCurriculum])

    const getFilteredResult = async (start: string, end: string) => {

    }


    const initCalendar = async (curriculum_code: string | null) =>{
        if(curriculum_code) {
            const result = await getEvaluationListForCurriculum(curriculum_code);
            if(result.code === 'success'){
                setEvents(result.data.body);
            } else {
                
            }
        }
    }

    const getModulePerCurriculum = async (curriculum_code: string) => {
        const result = await getModuleListPerCurriculum(curriculum_code);
        console.log('-->getModuleListPerCurriculum.result', result)
        if(result.code === 'success'){
            setModuleList(result.data.body);
        } else {
            showToast({
                variant: "error-solid",
                message: "Erreur lors de la récupération des modules",
                description: result.code,
                position: "top-center",
            });
        }
    }



    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* En-tête */}
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3">
                    <div className="w-full sm:w-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Gestion des Evaluations
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Programmer la date button de depot des notes de CC et de SN
                        </p>
                    </div>
                </div>
            </div>

            {/* Sélecteur de Curriculum */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Sélection du Curriculum
                    </CardTitle>
                    <CardDescription>
                        Choisissez le programme académique pour lequel vous souhaitez gérer les examens
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Calendrier de Planification des Examens
                        </CardTitle>
                        <CardDescription>
                            Curriculum sélectionné: {curriculumList.find(c => c.curriculum_code === selectedCurriculum)?.curriculum_name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <div className="text-center space-y-3">
                                {moduleList.map((module) => (
                                    <ModuleTab
                                        key={uuidv4()}
                                        module={module}
                                        curriculum_code={selectedCurriculum}
                                    />
                                ))}



                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
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