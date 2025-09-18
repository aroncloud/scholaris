'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCoursData } from '@/hooks/feature/cours/useCoursData';
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  MapPin,
  GraduationCap,
  FileText,
  Edit,
} from 'lucide-react';

interface CourseDetailsModalProps {
  courseId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (courseId: string) => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  courseId,
  isOpen,
  onClose,
  onEdit
}) => {
  const {
    selectedCourse: course,
    courseSessions: sessions,
    loadingCourse,
    courseError,
    fetchCourseById,
    fetchCourseSessions
  } = useCoursData();

  useEffect(() => {
    if (courseId && isOpen) {
      fetchCourseById(courseId);
      fetchCourseSessions(courseId);
    }
  }, [courseId, isOpen, fetchCourseById, fetchCourseSessions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Terminé':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planifié':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'Planifié':
        return 'bg-blue-100 text-blue-800';
      case 'En cours':
        return 'bg-green-100 text-green-800';
      case 'Terminé':
        return 'bg-gray-100 text-gray-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!course) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du cours</DialogTitle>
            <DialogDescription>Chargement des informations du cours</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            {loadingCourse ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {course.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {course.code} • {course.program} - Année {course.year}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`${getStatusColor(course.status)} border`}
              >
                {course.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(course.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="sessions">Séances</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {course.progress}%
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {course.completedHours}h / {course.totalHours}h
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Étudiants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {course.students}
                  </div>
                  <p className="text-xs text-gray-500">Inscrits au cours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Crédits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {course.credits}
                  </div>
                  <p className="text-xs text-gray-500">ECTS</p>
                </CardContent>
              </Card>
            </div>

            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations du cours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Code du cours</p>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Programme</p>
                      <p className="text-sm text-gray-600">{course.program}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enseignant</p>
                      <p className="text-sm text-gray-600">{course.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Durée totale</p>
                      <p className="text-sm text-gray-600">{course.totalHours} heures</p>
                    </div>
                  </div>
                </div>
                
                {course.description && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
                    <p className="text-sm text-gray-600">{course.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Séances du cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{session.type}</h4>
                            <Badge className={getSessionStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{session.date.toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{session.duration}h</span>
                            </div>
                            {session.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{session.location}</span>
                              </div>
                            )}
                          </div>
                          {session.description && (
                            <p className="text-sm text-gray-500 mt-2">{session.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucune séance planifiée pour ce cours.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Liste des étudiants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Fonctionnalité en cours de développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsModal;
