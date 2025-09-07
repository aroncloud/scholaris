'use client';

import { EvaluationKind, Student, GradeEntry, TeacherCourse } from '@/types/gradeTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save } from 'lucide-react';

interface Props {
  course: TeacherCourse;
  students: Student[];
  grades: GradeEntry[];
  activeEval: EvaluationKind;
  onChangeEval: (e: EvaluationKind) => void;
  onSave: (payload: { studentId: string; value: number; max: number; evaluation: EvaluationKind; courseId: string; }) => Promise<void>;
}

export default function GradeEntrySection({ course, students, grades, activeEval, onChangeEval, onSave }: Props) {
  const getCurrentValue = (studentId: string) => grades.find(g => g.studentId === studentId && g.evaluation === activeEval)?.value ?? '' as unknown as number;

  return (
    <Tabs value={activeEval} onValueChange={(v) => onChangeEval(v as EvaluationKind)} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="TP">TP</TabsTrigger>
        <TabsTrigger value="CC">CC</TabsTrigger>
        <TabsTrigger value="SN">SN</TabsTrigger>
      </TabsList>

      <TabsContent value={activeEval} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notes • {course.name} ({course.code})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Note /20</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.matricule}</TableCell>
                    <TableCell>{s.lastName} {s.firstName}</TableCell>
                    <TableCell className="w-48">
                      <Input defaultValue={getCurrentValue(s.id) as unknown as string} placeholder="--" type="number" step="0.5" min={0} max={20} />
                    </TableCell>
                    <TableCell className="w-32 text-right">
                      <Button size="sm" onClick={async (e) => {
                        const input = (e.currentTarget.closest('tr') as HTMLTableRowElement).querySelector('input') as HTMLInputElement;
                        const value = parseFloat(input.value || '0');
                        await onSave({ studentId: s.id, value, max: 20, evaluation: activeEval, courseId: course.id });
                      }}>
                        <Save className="w-4 h-4 mr-2" /> Enregistrer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}


