import React from 'react';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/Combobox';
import { Separator } from '@/components/ui/separator';
import { EvaluationSheet } from '@/types/examTypes';

interface EvaluationOption {
    value: string;
    label: string;
}

interface EvaluationSelectorProps {
    examList: EvaluationOption[];
    selectedExam: string;
    onExamChange: (value: string) => void;
    isLoadingExam: boolean;
    examSheet?: EvaluationSheet;
}

export const EvaluationSelector: React.FC<EvaluationSelectorProps> = ({
    examList,
    selectedExam,
    onExamChange,
    isLoadingExam,
    examSheet,
}) => {
    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Sélection de l&apos;évaluation
                </CardTitle>
                <CardDescription>
                    Choisissez l&apos;évaluation pour laquelle vous souhaitez saisir les notes
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Évaluation
                    </label>
                    <Combobox
                        options={examList}
                        value={selectedExam}
                        onChange={onExamChange}
                        placeholder={isLoadingExam ? "Chargement des évaluations..." : "Sélectionner une évaluation"}
                        className='py-5'
                    />
                    {isLoadingExam && (
                        <Card className="mt-3 border shadow-sm bg-blue-50">
                            <CardContent className="flex items-center gap-2 py-3">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                <p className="text-sm text-blue-700 font-medium">
                                    Chargement des évaluations...
                                </p>
                            </CardContent>
                        </Card>
                    )}
                    {!isLoadingExam && examList.length === 0 && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <p className="text-sm text-amber-800">
                                Aucune évaluation disponible pour cette année académique.
                            </p>
                        </div>
                    )}
                </div>

                {selectedExam && examSheet?.evaluation && examSheet?.students && (
                    <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">
                                    {examSheet.evaluation.title}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-1 text-sm text-blue-700">
                                    <span>Coefficient: {examSheet.evaluation.coefficient}</span>
                                    <Separator orientation="vertical" className="h-4" />
                                    <span>Note max: {examSheet.evaluation.max_score}</span>
                                    <Separator orientation="vertical" className="h-4" />
                                    <span>{examSheet.students.length} étudiant{examSheet.students.length > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
