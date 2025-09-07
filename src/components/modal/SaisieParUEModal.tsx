'use client';

import React, { useState } from 'react';
import GenericModal from './GenericModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SaisieParUEModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: UEGradeData) => void;
}

interface StudentGrade {
  studentId: string;
  studentName: string;
  value: number;
  max: number;
}

interface UEGradeData {
  ueId: string;
  ueName: string;
  evaluation: string;
  date: Date;
  max: number;
  students: StudentGrade[];
  comment?: string;
}

const SaisieParUEModal: React.FC<SaisieParUEModalProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [formData, setFormData] = useState<UEGradeData>({
    ueId: '',
    ueName: '',
    evaluation: '',
    date: new Date(),
    max: 20,
    students: [],
    comment: ''
  });

  const [newStudent, setNewStudent] = useState({
    studentId: '',
    studentName: '',
    value: 0
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onOpenChange(false);
    // Reset form
    setFormData({
      ueId: '',
      ueName: '',
      evaluation: '',
      date: new Date(),
      max: 20,
      students: [],
      comment: ''
    });
  };

  const handleInputChange = (field: keyof UEGradeData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addStudent = () => {
    if (newStudent.studentId && newStudent.studentName) {
      setFormData(prev => ({
        ...prev,
        students: [...prev.students, {
          ...newStudent,
          max: formData.max
        }]
      }));
      setNewStudent({
        studentId: '',
        studentName: '',
        value: 0
      });
    }
  };

  const removeStudent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== index)
    }));
  };

  const updateStudentGrade = (index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.map((student, i) => 
        i === index ? { ...student, value } : student
      )
    }));
  };

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title="Saisie par Unité d'Enseignement"
      description="Saisir les notes pour tous les étudiants d'une UE"
      onConfirm={handleSubmit}
      confirmText="Enregistrer toutes les notes"
      cancelText="Annuler"
      size="max-w-4xl"
    >
      <div className="space-y-6">
        {/* UE Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ue">Unité d'Enseignement</Label>
            <Select value={formData.ueId} onValueChange={(value) => {
              const ueName = value === 'ue1' ? 'UE Mathématiques' : 
                           value === 'ue2' ? 'UE Physique' : 
                           value === 'ue3' ? 'UE Informatique' : '';
              handleInputChange('ueId', value);
              handleInputChange('ueName', ueName);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une UE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ue1">UE Mathématiques</SelectItem>
                <SelectItem value="ue2">UE Physique</SelectItem>
                <SelectItem value="ue3">UE Informatique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluation">Type d'évaluation</Label>
            <Select value={formData.evaluation} onValueChange={(value) => handleInputChange('evaluation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'évaluation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam">Examen</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="homework">Devoir</SelectItem>
                <SelectItem value="project">Projet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label htmlFor="max">Note maximale</Label>
            <Input
              id="max"
              type="number"
              min="1"
              value={formData.max}
              onChange={(e) => {
                const max = parseFloat(e.target.value) || 20;
                handleInputChange('max', max);
                // Update all students' max values
                setFormData(prev => ({
                  ...prev,
                  max,
                  students: prev.students.map(student => ({ ...student, max }))
                }));
              }}
            />
          </div>
        </div>

        {/* Add Student Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Ajouter des étudiants</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student-select">Étudiant</Label>
              <Select value={newStudent.studentId} onValueChange={(value) => {
                const studentName = value === 'student1' ? 'Jean Dupont' : 
                                 value === 'student2' ? 'Marie Martin' : 
                                 value === 'student3' ? 'Pierre Durand' : '';
                setNewStudent(prev => ({
                  ...prev,
                  studentId: value,
                  studentName
                }));
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un étudiant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student1">Jean Dupont</SelectItem>
                  <SelectItem value="student2">Marie Martin</SelectItem>
                  <SelectItem value="student3">Pierre Durand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-grade">Note</Label>
              <Input
                id="student-grade"
                type="number"
                min="0"
                max={formData.max}
                step="0.1"
                value={newStudent.value}
                onChange={(e) => setNewStudent(prev => ({
                  ...prev,
                  value: parseFloat(e.target.value) || 0
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={addStudent} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        {/* Students List */}
        {formData.students.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Étudiants ajoutés ({formData.students.length})</h3>
            <div className="border rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Étudiant</th>
                      <th className="px-4 py-2 text-left">Note</th>
                      <th className="px-4 py-2 text-left">Max</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.students.map((student, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{student.studentName}</td>
                        <td className="px-4 py-2">
                          <Input
                            type="number"
                            min="0"
                            max={student.max}
                            step="0.1"
                            value={student.value}
                            onChange={(e) => updateStudentGrade(index, parseFloat(e.target.value) || 0)}
                            className="w-20"
                          />
                        </td>
                        <td className="px-4 py-2">{student.max}</td>
                        <td className="px-4 py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeStudent(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="comment">Commentaire général (optionnel)</Label>
          <Textarea
            id="comment"
            placeholder="Ajouter un commentaire général..."
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </GenericModal>
  );
};

export default SaisieParUEModal;
