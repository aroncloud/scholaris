/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { IGetModulePerCurriculum } from '@/types/programTypes'
import React, { lazy, use, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { ICreateEvaluation } from '@/types/examTypes';
import { createEvaluation } from '@/actions/examAction';
import { showToast } from '@/components/ui/showToast';
const DialogCreateExam = lazy(() => import('../Modal/DialogCreateExam'));

interface Myprops {
    module: IGetModulePerCurriculum,
    curriculum_code: string
}
const ModuleTab = ({ module }: Myprops) => {
    const [isCardExpanded, setIsCardExpanded] = useState(false);
    const [examType, setExamType] = useState<"EXAM_SEQ" | "CC">('EXAM_SEQ');
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const handleCreateEvaluation = async (data: ICreateEvaluation) => {
        console.log('-->data', data);
        const result = await createEvaluation(data);
        if (result.code === 'success') {
          setIsDialogOpen(false);
          showToast({
            variant: "success-solid",
            message: 'Evaluation plannifiée avec succès',
            description: `L'évaluation de ${data.title} a été programmée avec succès`,
            position: 'top-center',
          });
    
          // refreshData(session.curriculum_code)
          return true
        } else {
          showToast({
            variant: "error-solid",
            message: "Impossible de créer la salle de classe",
            description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
            position: 'top-center',
          });
        }
        return false
    };


    return (
        <div>
            <Collapsible className="w-full" open={isCardExpanded} onOpenChange={setIsCardExpanded}>
                <Card className="border-l-4 border-l-blue-500 gap-4">
                    <CardHeader>
                        {/* Header principal du collapsible */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="w-full md:w-auto">
                                <CollapsibleTrigger asChild>
                                    <div className="flex items-center cursor-pointer">
                                        <Button variant="ghost" size="sm" className="h-10 -ml-3 w-auto">
                                            {isCardExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </Button>
                                        <CardTitle className="text-lg text-blue-900">{module.module_name}</CardTitle>
                                    </div>
                                </CollapsibleTrigger>
                                <CardDescription>
                                <div className="flex flex-wrap items-center gap-2 my-1 text-sm">
                                    <span>Code: {module.module_code}</span>
                                </div>
                                </CardDescription>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-7 w-7 p-4">
                                    <MoreHorizontal className="h-4 w-7" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => {
                                        setExamType('CC');
                                        setIsDialogOpen(true);
                                    }}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Planifier date des CC
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        setExamType('EXAM_SEQ');
                                        setIsDialogOpen(true);
                                    }}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Planifier date de la SN
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Contenu du collapsible */}
                    <CollapsibleContent>
                        <CardContent>
                        <div>Hello world</div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            <DialogCreateExam
                open = {isDialogOpen}
                onOpenChange = {setIsDialogOpen}
                onSave = {handleCreateEvaluation}
                examType={examType}
            />
        </div>
    )
}

export default ModuleTab