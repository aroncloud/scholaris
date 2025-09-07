'use client';

import React, { useState, useEffect } from 'react';
import GenericModal from '../GenericModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
}

export interface Course {
  id: string;
  name: string;
}

export interface GradeData {
  id?: string;
  studentId: string;
  courseId: string;
  evaluation: string;
  value: number;
  max: number;
  date: string;
  comment?: string;
  matricule?: string;
}

interface ModifyGradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GradeData) => void;
  grade: GradeData;
  course: Course;
  student?: Student;
}

const evaluationTypes = [
  { value: 'TP', label: 'Travaux Pratiques' },
  { value: 'CC', label: 'Contrôle Continu' },
  { value: 'SN', label: 'Session Normale' }
];

const ModifyGradeModal: React.FC<ModifyGradeModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  grade,
  course,
  student
}) => {
  const [formData, setFormData] = useState<GradeData>(() => ({
    ...grade,
    date: grade?.date || new Date().toISOString(),
    value: grade?.value || 0,
    max: grade?.max || 20,
    evaluation: grade?.evaluation || 'TP',
    comment: grade?.comment || ''
  }));
  
  const [date, setDate] = useState<Date>(grade?.date ? new Date(grade.date) : new Date());
  
  // Update form data when grade prop changes
  React.useEffect(() => {
    if (grade) {
      setFormData(prev => ({
        ...prev,
        ...grade,
        date: grade.date || new Date().toISOString()
      }));
      setDate(grade.date ? new Date(grade.date) : new Date());
    }
  }, [grade]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const updatedGrade = {
      ...formData,
      date: date.toISOString(),
      // Ensure we're using the latest form data
      value: parseFloat(formData.value as any) || 0,
      max: parseFloat(formData.max as any) || 20
    };
    onSubmit(updatedGrade);
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof GradeData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      confirmText="Enregistrer"
      confirmButtonClassName="bg-blue-600 hover:bg-blue-700 text-white"
      onConfirm={handleSubmit}
      cancelText="Annuler"
      size="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student">
            Étudiant
          </Label>
          <div className="col-span-3">
            <div className="flex items-center p-2 bg-gray-100 rounded-md">
              <span className="text-gray-700">
                {student ? `${student.lastName} ${student.firstName} (${student.matricule})` : 'Étudiant inconnu'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">
            Cours
          </Label>
          <div className="col-span-3">
            <div className="flex items-center p-2 bg-gray-100 rounded-md">
              <span className="text-gray-700">
                {course?.name || 'Cours inconnu'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluation">
            Type d'évaluation
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.evaluation}
              onValueChange={(value) => handleInputChange('evaluation', value)}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">
            Note
          </Label>
          <div className="col-span-3">
            <div className="flex items-center space-x-4">
                <Input
                  id="value"
                  type="number"
                  min="0"
                  max={formData.max}
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      handleInputChange('value', value);
                    }
                  }}
                  className="w-24"
                />
              <span className="text-muted-foreground">/ {formData.max}</span>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={formData.max === 20 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('max', 20)}
                >
                  20
                </Button>
                <Button
                  type="button"
                  variant={formData.max === 100 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('max', 100)}
                >
                  100
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Date
          </Label>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
                  <input
                    type="hidden"
                    value={date.toISOString()}
                    onChange={(e) => setDate(new Date(e.target.value))}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      // Update the form data with the new date
                      setFormData(prev => ({
                        ...prev,
                        date: newDate.toISOString()
                      }));
                    }
                  }}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">
            Commentaire
          </Label>
          <div className="col-span-3">
            <Textarea
              id="comment"
              value={formData.comment || ''}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Ajouter un commentaire (optionnel)"
              rows={3}
            />
          </div>
        </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default ModifyGradeModal;
