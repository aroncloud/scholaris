/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import GenericModal from '../GenericModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { GradeEntry, Student as StudentType, TeacherCourse, EvaluationKind } from '@/types/gradeTypes';

interface GradeFormData {
  evaluation: EvaluationKind;
  value: number | string;
  max: number | string;
  date: Date;
  comment: string;
  firstName: string;
  lastName: string;
  barem: number;
}

interface ModifyGradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GradeEntry) => void;
  grade: GradeEntry & { firstName: string; lastName: string; barem: number };
  course: TeacherCourse;
  student?: StudentType;
}

const evaluationTypes = [
  { value: 'TP' as const, label: 'Travaux Pratiques' },
  { value: 'CC' as const, label: 'Contrôle Continu' },
  { value: 'SN' as const, label: 'Session Normale' }
];

const ModifyGradeModal: React.FC<ModifyGradeModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  grade,
  course,
  student
}) => {
  const [date, setDate] = useState<Date>(grade?.date ? new Date(grade.date) : new Date());
  const [formData, setFormData] = useState<GradeFormData>(() => ({
    evaluation: grade.evaluation || 'TP',
    value: grade.value || 0,
    max: grade.max || 20,
    date: grade.date ? new Date(grade.date) : new Date(),
    comment: grade.comment || '',
    firstName: student?.firstName || grade.firstName || '',
    lastName: student?.lastName || grade.lastName || '',
    barem: grade.barem || 20
  }));

  // Update form data when grade or student prop changes
  useEffect(() => {
    if (grade) {
      setFormData({
        evaluation: grade.evaluation,
        value: grade.value,
        max: grade.max,
        comment: grade.comment || '',
        date: grade.date ? new Date(grade.date) : new Date(),
        firstName: student?.firstName || grade.firstName || '',
        lastName: student?.lastName || grade.lastName || '',
        barem: grade.barem || 20
      });
      setDate(grade.date ? new Date(grade.date) : new Date());
    }
  }, [grade, student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedGrade: GradeEntry = {
      id: grade.id,
      studentId: grade.studentId,
      courseId: course.id,
      matricule: student?.matricule || grade.matricule || '',
      evaluation: formData.evaluation,
      value: Number(formData.value) || 0,
      max: Number(formData.max) || 20,
      date: date.toISOString(),
      comment: formData.comment,
      studentName: `${formData.firstName} ${formData.lastName}`.trim()
    };
    onSubmit(updatedGrade);
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof GradeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      studentName: field === 'firstName' 
        ? `${value} ${prev.lastName || ''}`.trim()
        : `${prev.firstName || ''} ${value}`.trim()
    }));
  };

  if (!open) return null;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title="Modifier la note"
      description="Modifiez les détails de l'évaluation"
      titleClassName="bg-blue-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-lg"
      onConfirm={handleSubmit}
      confirmText="Enregistrer"
      confirmButtonClassName="bg-blue-600 hover:bg-blue-700 text-white"
      cancelText="Annuler"
      size="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="student">Étudiant</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleNameChange('firstName', e.target.value)}
                  placeholder="Prénom"
                  className="flex-1"
                  required
                />
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleNameChange('lastName', e.target.value)}
                  placeholder="Nom"
                  className="flex-1"
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Matricule: {student?.matricule || grade.matricule || 'Non spécifié'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date d&apos;évaluation</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="evaluation">Type d&apos;évaluation</Label>
            <Select
              value={formData.evaluation}
              onValueChange={(value) => handleInputChange('evaluation', value as EvaluationKind)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {evaluationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Note /20</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="value"
                type="number"
                min="0"
                max={formData.max}
                step="0.25"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className="w-full"
                required
              />
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                / {formData.max}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="barem">Barème</Label>
            <Input
              id="barem"
              type="number"
              min="0"
              step="1"
              value={formData.barem}
              onChange={(e) => handleInputChange('barem', Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Commentaire (optionnel)</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            placeholder="Ajoutez un commentaire si nécessaire"
            rows={3}
          />
        </div>
      </form>
    </GenericModal>
  );
};

export default ModifyGradeModal;
