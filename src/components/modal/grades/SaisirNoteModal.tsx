'use client';

import React, { useState } from 'react';
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

interface SaisirNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: GradeData) => void;
}

interface GradeData {
  studentId: string;
  studentName: string;
  matricule: string;
  courseId: string;
  courseName: string;
  evaluation: string;
  value: number;
  max: number;
  date: Date;
  comment?: string;
}

const SaisirNoteModal: React.FC<SaisirNoteModalProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [formData, setFormData] = useState<GradeData>({
    studentId: '',
    studentName: '',
    matricule: '',
    courseId: '',
    courseName: '',
    evaluation: '',
    value: 0,
    max: 20,
    date: new Date(),
    comment: ''
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onOpenChange(false);
    // Reset form
    setFormData({
      studentId: '',
      studentName: '',
      matricule: '',
      courseId: '',
      courseName: '',
      evaluation: '',
      value: 0,
      max: 20,
      date: new Date(),
      comment: ''
    });
  };

  const handleInputChange = (field: keyof GradeData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title="Saisir une nouvelle note"
      description="Entrez les détails de l'évaluation"
      titleClassName="bg-blue-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-lg"
      onConfirm={handleSubmit}
      confirmText="Enregistrer"
      confirmButtonClassName="bg-blue-600 hover:bg-blue-700 text-white"
      cancelText="Annuler"
      size="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="student">Étudiant</Label>
            <div className="space-y-2">
              <Select 
                value={formData.studentId} 
                onValueChange={(value) => {
                  const [id, name, matricule] = value.split('|');
                  setFormData(prev => ({
                    ...prev,
                    studentId: id,
                    studentName: name,
                    matricule: matricule
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un étudiant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student1|Jean Dupont|MAT001">Jean Dupont (MAT001)</SelectItem>
                  <SelectItem value="student2|Marie Martin|MAT002">Marie Martin (MAT002)</SelectItem>
                  <SelectItem value="student3|Pierre Durand|MAT003">Pierre Durand (MAT003)</SelectItem>
                </SelectContent>
              </Select>
              {formData.matricule && (
                <p className="text-sm text-gray-500">Matricule: {formData.matricule}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Matière</Label>
            <Select 
              value={formData.courseId} 
              onValueChange={(value) => {
                const [id, name] = value.split('|');
                setFormData(prev => ({
                  ...prev,
                  courseId: id,
                  courseName: name
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course1|Anatomie générale">Anatomie générale</SelectItem>
                <SelectItem value="course2|Physiologie spécialisée">Physiologie spécialisée</SelectItem>
                <SelectItem value="course3|TP Anatomie">TP Anatomie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="evaluation">Type d'évaluation</Label>
            <Select value={formData.evaluation} onValueChange={(value) => handleInputChange('evaluation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'évaluation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TP">Travaux Pratiques (TP)</SelectItem>
                <SelectItem value="CC">Contrôle Continu (CC)</SelectItem>
                <SelectItem value="SN">Session Normale (SN)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && handleInputChange('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value">Note obtenue</Label>
            <Input
              id="value"
              type="number"
              min="0"
              max={formData.max}
              step="0.1"
              value={formData.value}
              onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max">Barème</Label>
            <Input
              id="max"
              type="number"
              min="1"
              value={formData.max}
              onChange={(e) => handleInputChange('max', parseFloat(e.target.value) || 20)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Commentaire (optionnel)</Label>
          <Textarea
            id="comment"
            placeholder="Ajouter un commentaire..."
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </GenericModal>
  );
};

export default SaisirNoteModal;
