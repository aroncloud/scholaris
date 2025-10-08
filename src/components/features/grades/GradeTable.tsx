import React, { useMemo } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResponsiveTable, TableColumn } from '@/components/tables/ResponsiveTable';
import ContentLayout from '@/layout/ContentLayout';
import { getStatusColor } from '@/lib/utils';
import { EvaluationSheet, IStudentEvaluationInfo } from '@/types/examTypes';
import { ScoreInput } from './ScoreInput';

interface GradeTableProps {
    examSheet: EvaluationSheet;
    studentGrades: Map<string, number>;
    modifiedStudents: Set<string>;
    onScoreChange: (studentCode: string, score: number) => void;
    isLoading: boolean;
}

export const GradeTable: React.FC<GradeTableProps> = ({
    examSheet,
    studentGrades,
    modifiedStudents,
    onScoreChange,
    isLoading,
}) => {
    const createColumns = useMemo((): TableColumn<IStudentEvaluationInfo>[] => {
        return [
            {
                key: "student_number",
                label: "N° Étudiant",
                render: (studentNumber: string) => (
                    <div className="font-mono text-sm font-medium">
                        {studentNumber}
                    </div>
                ),
            },
            {
                key: "first_name",
                label: "Nom Complet",
                render: (_, student: IStudentEvaluationInfo) => (
                    <div>
                        <div className="font-medium">
                            {student.first_name} {student.last_name}
                        </div>
                    </div>
                ),
            },
            {
                key: "graded",
                label: "Statut",
                render: (graded: boolean, student: IStudentEvaluationInfo) => {
                    return (
                        <Badge
                            className={getStatusColor(student.graded ? "APPROVED" : "PENDING")}
                        >
                            {student.graded ? "NOTÉ" : "NON NOTÉ"}
                        </Badge>
                    );
                },
            },
            {
                key: "score",
                label: `Note (/${examSheet.evaluation.max_score})`,
                render: (score: number, student: IStudentEvaluationInfo) => (
                    <div className="flex items-center space-x-2">
                        <ScoreInput
                            student={{
                                ...student,
                                score: studentGrades.get(student.enrollment_code) ?? student.score
                            }}
                            maxScore={examSheet.evaluation.max_score}
                            onScoreChange={onScoreChange}
                            isModified={modifiedStudents.has(student.enrollment_code)}
                            locale="fr"
                        />
                        <span className="text-sm text-muted-foreground">
                            / {examSheet.evaluation.max_score}
                        </span>
                    </div>
                ),
            },
        ];
    }, [examSheet.evaluation.max_score, studentGrades, modifiedStudents, onScoreChange]);

    return (
        <ContentLayout
            icon={<ClipboardList className="w-6 h-6 text-primary" />}
            title={examSheet.evaluation.title}
            description={
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>
                        Date: {examSheet.evaluation.evaluation_date
                            ? new Date(examSheet.evaluation.evaluation_date).toLocaleDateString('fr-FR')
                            : "Non programmée"}
                    </span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Note max: {examSheet.evaluation.max_score}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Coefficient: {examSheet.evaluation.coefficient}</span>
                </div>
            }
            actions={
                <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(examSheet.evaluation.status)}>
                        {examSheet.evaluation.status}
                    </Badge>
                    {modifiedStudents.size > 0 && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                            {modifiedStudents.size} modification{modifiedStudents.size > 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>
            }
            cardClassName="border shadow-sm"
            headerClassName="pb-4"
        >
            <ResponsiveTable
                columns={createColumns}
                data={examSheet.students}
                searchKey={["first_name", "last_name", "student_number"]}
                paginate={20}
                locale="fr"
                isLoading={isLoading}
            />
        </ContentLayout>
    );
};

export const GradeTableLoading: React.FC = () => {
    return (
        <Card className="border shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Chargement des notes des étudiants...</p>
            </CardContent>
        </Card>
    );
};
