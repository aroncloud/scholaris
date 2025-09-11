'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/types/courseType';
import { useCoursData } from '@/hooks/feature/cours/useCoursData';
import { Loader2, Save, X } from 'lucide-react';

interface CourseEditModalProps {
  courseId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({
  courseId,
  isOpen,
  onClose,
  onSave
}) => {
  const {
    selectedCourse: course,
    loadingCourse,
    saving,
    courseError,
    saveError,
    fetchCourseById,
    updateCourse
  } = useCoursData();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 0,
    completedHours: 0,
    totalHours: 0,
    students: 0,
    credits: 0,
    status: 'En cours' as 'En cours' | 'Terminé' | 'Planifié'
  });

  useEffect(() => {
    if (courseId && isOpen) {
      fetchCourseById(courseId);
    }
  }, [courseId, isOpen, fetchCourseById]);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description || '',
        progress: course.progress,
        completedHours: course.completedHours,
        totalHours: course.totalHours,
        students: course.students,
        credits: course.credits,
        status: course.status
      });
    }
  }, [course]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate completed hours when progress changes
    if (field === 'progress' && typeof value === 'number') {
      const completedHours = Math.round((value / 100) * formData.totalHours);
      setFormData(prev => ({
        ...prev,
        completedHours
      }));
    }
  };

  const handleSave = async () => {
    if (!course) return;

    try {
      // Update progress in the backend using the hook
      const updatedCourse = await updateCourse(course.id, formData.progress);
      
      // Update the course with new form data
      const finalCourse: Course = {
        ...updatedCourse,
        ...formData,
        updatedAt: new Date()
      };
      
      onSave(finalCourse);
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  if (!course) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            {loadingCourse ? (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : courseError ? (
              <div className="text-center">
                <p className="text-red-500 mb-2">Erreur lors du chargement</p>
                <p className="text-gray-500 text-sm">{courseError}</p>
              </div>
            ) : (
              <p className="text-gray-500">Cours non trouvé</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Modifier le cours
          </DialogTitle>
          <DialogDescription>
            {course.code} • {course.program} - Année {course.year}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du cours</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Titre du cours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                      <SelectItem value="Planifié">Planifié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description du cours"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails du cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalHours">Heures totales</Label>
                  <Input
                    id="totalHours"
                    type="number"
                    value={formData.totalHours}
                    onChange={(e) => handleInputChange('totalHours', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completedHours">Heures complétées</Label>
                  <Input
                    id="completedHours"
                    type="number"
                    value={formData.completedHours}
                    onChange={(e) => handleInputChange('completedHours', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">Progression (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="students">Nombre d'étudiants</Label>
                  <Input
                    id="students"
                    type="number"
                    value={formData.students}
                    onChange={(e) => handleInputChange('students', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Crédits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            {saveError && (
              <p className="text-red-500 text-sm mt-2">{saveError}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditModal;
