/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { EvaluationKind, Student, GradeEntry, TeacherCourse } from '@/types/gradeTypes';
import ModifyGradeModal from '@/components/modal/grades/ModifyGradeModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteGradeModal from '@/components/modal/grades/DeleteGradeModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GradeTableProps {
  evaluation: EvaluationKind;
  students: Student[];
  grades: GradeEntry[];
  course: TeacherCourse;
  onSave: (payload: { studentId: string; value: number; max: number; evaluation: EvaluationKind; courseId: string; }) => Promise<void>;
  onDelete: (gradeId: string) => Promise<void>;
}

interface GradeEntrySectionProps {
  course: TeacherCourse;
  students: Student[];
  grades: GradeEntry[];
  activeEval: EvaluationKind;
  onChangeEval: (e: EvaluationKind) => void;
  onSave: (payload: { studentId: string; value: number; max: number; evaluation: EvaluationKind; courseId: string; }) => Promise<void>;
  onDelete: (gradeId: string) => Promise<void>;
}

const GradeTable = ({ 
  evaluation, 
  students, 
  grades, 
  course, 
  onSave,
  onDelete
}: GradeTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeEntry & { firstName: string; lastName: string; barem: number } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const getCurrentGrade = (studentId: string) => {
    return grades.find(g => g.studentId === studentId && g.evaluation === evaluation);
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.matricule.toLowerCase().includes(searchLower)
    );
  });

  const handleModifyClick = (student: Student) => {
    const studentGrade = grades.find(g => g.studentId === student.id && g.evaluation === evaluation);
    setSelectedStudent(student);
    
    if (studentGrade) {
      // If grade exists, ensure it has all required properties
      setSelectedGrade({
        ...studentGrade,
        firstName: student.firstName,
        lastName: student.lastName,
        barem: (studentGrade as any).barem || 20
      });
    } else {
      // Create a new grade object with all required properties
      setSelectedGrade({
        id: '',
        studentId: student.id,
        courseId: course.id,
        evaluation: evaluation,
        value: 0,
        max: 20,
        date: new Date().toISOString().split('T')[0],
        comment: '',
        studentName: `${student.firstName} ${student.lastName}`.trim(),
        matricule: student.matricule,
        firstName: student.firstName,
        lastName: student.lastName,
        barem: 20 // Default barem value
      });
    }
    
    setIsModifyModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    const grade = getCurrentGrade(student.id);
    if (grade?.id) {
      setSelectedGrade({
        ...grade,
        firstName: student.firstName,
        lastName: student.lastName,
        barem: (grade as any).barem || 20
      });
      setIsDeleteModalOpen(true);
    }
  };

  const handleModifyGrade = async (data: any) => {
    if (data) {
      await onSave({
        studentId: data.studentId,
        value: data.value,
        max: data.max,
        evaluation: data.evaluation,
        courseId: data.courseId,
      });
      setIsModifyModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedGrade?.id) {
      await onDelete(selectedGrade.id);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-lg">
            {evaluation === 'TP' ? 'Travaux Pratiques' : 
             evaluation === 'CC' ? 'Contrôle Continu' : 
             'Session Normale'}
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un étudiant..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredStudents.length} étudiant{filteredStudents.length !== 1 ? 's' : ''} sur {students.length}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead className="w-[200px]">Type d&apos;évaluation</TableHead>
                <TableHead className="w-[120px]">Note /20</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[60px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const grade = getCurrentGrade(student.id);
                const evaluationLabel = {
                  'TP': 'Travaux Pratiques',
                  'CC': 'Contrôle Continu',
                  'SN': 'Session Normale'
                }[evaluation] || evaluation;

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{student.lastName} {student.firstName}</span>
                        <span className="text-xs text-gray-500">{student.matricule}</span>
                      </div>
                    </TableCell>
                    <TableCell>{evaluationLabel}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-md ${grade ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                        {grade ? `${grade.value} / ${grade.max}` : '--'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {grade?.date ? format(new Date(grade.date), 'PPP', { locale: fr }) : '--'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleModifyClick(student)}
                            className="hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                            onClick={() => handleDeleteClick(student)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {selectedGrade && selectedStudent && (
        <ModifyGradeModal
          open={isModifyModalOpen}
          onOpenChange={setIsModifyModalOpen}
          onSubmit={handleModifyGrade}
          grade={selectedGrade}
          course={course}
          student={selectedStudent}
        />
      )}

      <DeleteGradeModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        studentName={selectedStudent ? `${selectedStudent.lastName} ${selectedStudent.firstName}` : 'Étudiant inconnu'}
        courseName={course.name}
        evaluation={evaluation}
        grade={selectedGrade?.value || 0}
        maxGrade={selectedGrade?.max || 20}
        date={selectedGrade?.date ? format(new Date(selectedGrade.date), 'PPP', { locale: fr }) : 'Date inconnue'}
      />
    </Card>
  );
};

export default function GradeEntrySection({ 
  course, 
  students, 
  grades, 
  activeEval, 
  onChangeEval, 
  onSave,
  onDelete 
}: GradeEntrySectionProps) {
  return (
    <Tabs value={activeEval} onValueChange={(v) => onChangeEval(v as EvaluationKind)} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="TP">TP</TabsTrigger>
        <TabsTrigger value="CC">CC</TabsTrigger>
        <TabsTrigger value="SN">SN</TabsTrigger>
      </TabsList>

      <TabsContent value="TP" className="space-y-4">
        <GradeTable 
          evaluation="TP" 
          students={students} 
          grades={grades} 
          course={course} 
          onSave={onSave}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="CC" className="space-y-4">
        <GradeTable 
          evaluation="CC" 
          students={students} 
          grades={grades} 
          course={course} 
          onSave={onSave}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="SN" className="space-y-4">
        <GradeTable 
          evaluation="SN" 
          students={students} 
          grades={grades} 
          course={course} 
          onSave={onSave}
          onDelete={onDelete}
        />
      </TabsContent>
    </Tabs>
  );
}


