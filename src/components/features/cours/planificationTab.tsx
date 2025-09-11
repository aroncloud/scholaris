'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCoursData } from '@/hooks/feature/cours/useCoursData';
import { ICourse } from '@/types/courseType';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PlanningSession {
  id: string;
  courseId: string;
  title: string;
  type: 'Cours magistral' | 'TP' | 'TD' | 'Examen' | 'Autre';
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  maxStudents: number;
  status: 'Planifié' | 'Confirmé' | 'Annulé';
}

const PlanificationComponent: React.FC = () => {
  const { courses, programs } = useCoursData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<PlanningSession | null>(null);

  // Mock planning sessions data
  const [planningSessions, setPlanningSessions] = useState<PlanningSession[]>([
    {
      id: '1',
      courseId: '1',
      title: 'Introduction à l\'anatomie',
      type: 'Cours magistral',
      date: new Date('2024-01-25'),
      startTime: '09:00',
      endTime: '11:00',
      location: 'Amphithéâtre A',
      description: 'Introduction générale aux concepts d\'anatomie',
      maxStudents: 50,
      status: 'Planifié'
    },
    {
      id: '2',
      courseId: '1',
      title: 'TP Dissection',
      type: 'TP',
      date: new Date('2024-01-28'),
      startTime: '14:00',
      endTime: '17:00',
      location: 'Laboratoire 1',
      description: 'Travaux pratiques de dissection',
      maxStudents: 25,
      status: 'Confirmé'
    },
    {
      id: '3',
      courseId: '2',
      title: 'Physiologie cardiaque',
      type: 'Cours magistral',
      date: new Date('2024-01-30'),
      startTime: '10:00',
      endTime: '12:00',
      location: 'Amphithéâtre B',
      description: 'Étude du système cardiovasculaire',
      maxStudents: 40,
      status: 'Planifié'
    }
  ]);

  const [newSession, setNewSession] = useState<Partial<PlanningSession>>({
    title: '',
    type: 'Cours magistral',
    date: new Date(),
    startTime: '09:00',
    endTime: '11:00',
    location: '',
    description: '',
    maxStudents: 30,
    status: 'Planifié'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planifié':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Annulé':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Cours magistral':
        return 'bg-purple-100 text-purple-800';
      case 'TP':
        return 'bg-orange-100 text-orange-800';
      case 'TD':
        return 'bg-blue-100 text-blue-800';
      case 'Examen':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddSession = () => {
    if (selectedCourse && newSession.title && newSession.location) {
      const session: PlanningSession = {
        id: Date.now().toString(),
        courseId: selectedCourse,
        title: newSession.title!,
        type: newSession.type as PlanningSession['type'],
        date: newSession.date!,
        startTime: newSession.startTime!,
        endTime: newSession.endTime!,
        location: newSession.location!,
        description: newSession.description || '',
        maxStudents: newSession.maxStudents || 30,
        status: 'Planifié'
      };

      setPlanningSessions(prev => [...prev, session]);
      setNewSession({
        title: '',
        type: 'Cours magistral',
        date: new Date(),
        startTime: '09:00',
        endTime: '11:00',
        location: '',
        description: '',
        maxStudents: 30,
        status: 'Planifié'
      });
      setSelectedCourse('');
      setIsAddSessionOpen(false);
    }
  };

  const handleEditSession = (session: PlanningSession) => {
    setEditingSession(session);
    setNewSession(session);
    setIsAddSessionOpen(true);
  };

  const handleUpdateSession = () => {
    if (editingSession && newSession.title && newSession.location) {
      setPlanningSessions(prev => prev.map(session => 
        session.id === editingSession.id 
          ? { ...session, ...newSession } as PlanningSession
          : session
      ));
      setEditingSession(null);
      setNewSession({
        title: '',
        type: 'Cours magistral',
        date: new Date(),
        startTime: '09:00',
        endTime: '11:00',
        location: '',
        description: '',
        maxStudents: 30,
        status: 'Planifié'
      });
      setIsAddSessionOpen(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setPlanningSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Cours inconnu';
  };

  const getSessionsForDate = (date: Date) => {
    return planningSessions.filter(session => 
      session.date.toDateString() === date.toDateString()
    );
  };

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">Planification des cours</h2>
          <p className="text-gray-600">Vue d'ensemble de vos enseignements</p>
        </div>
        <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
          {/* <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une séance
            </Button>
          </DialogTrigger> */}
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? 'Modifier la séance' : 'Nouvelle séance'}
              </DialogTitle>
              <DialogDescription>
                {editingSession ? 'Modifiez les détails de la séance' : 'Planifiez une nouvelle séance de cours'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Cours</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} - {course.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type de séance</Label>
                  <Select 
                    value={newSession.type} 
                    onValueChange={(value) => setNewSession(prev => ({ ...prev, type: value as PlanningSession['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cours magistral">Cours magistral</SelectItem>
                      <SelectItem value="TP">TP</SelectItem>
                      <SelectItem value="TD">TD</SelectItem>
                      <SelectItem value="Examen">Examen</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre de la séance</Label>
                <Input
                  id="title"
                  value={newSession.title}
                  onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de la séance"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={newSession.date}
                    onSelect={(date) => setNewSession(prev => ({ ...prev, date }))}
                    className="rounded-md border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startTime">Heure de début</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">Heure de fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Lieu</Label>
                  <Input
                    id="location"
                    value={newSession.location}
                    onChange={(e) => setNewSession(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Salle, amphithéâtre, laboratoire..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Nombre max d'étudiants</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={newSession.maxStudents}
                    onChange={(e) => setNewSession(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 30 }))}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSession.description}
                  onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la séance..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddSessionOpen(false);
                    setEditingSession(null);
                    setNewSession({
                      title: '',
                      type: 'Cours magistral',
                      date: new Date(),
                      startTime: '09:00',
                      endTime: '11:00',
                      location: '',
                      description: '',
                      maxStudents: 30,
                      status: 'Planifié'
                    });
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingSession ? handleUpdateSession : handleAddSession}
                  disabled={!selectedCourse || !newSession.title || !newSession.location}
                >
                  {editingSession ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar and Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        {/* <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendrier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                locale={fr}
              />
            </CardContent>
          </Card>
        </div> */}

        {/* Sessions for selected date */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Séances du {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'jour sélectionné'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateSessions.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateSessions.map((session) => (
                    <div
                      key={session.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{session.title}</h4>
                            <Badge className={getTypeColor(session.type)}>
                              {session.type}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {getCourseName(session.courseId)}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{session.startTime} - {session.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>Max {session.maxStudents}</span>
                            </div>
                          </div>
                          {session.description && (
                            <p className="text-sm text-gray-600 mt-2">{session.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Aucune séance planifiée pour cette date
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Sessions Overview */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Toutes les séances planifiées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planningSessions
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {format(session.date, 'dd', { locale: fr })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(session.date, 'MMM', { locale: fr })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{session.title}</h4>
                        <Badge className={getTypeColor(session.type)}>
                          {session.type}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {getCourseName(session.courseId)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{session.startTime} - {session.endTime}</span>
                        <span>{session.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSession(session)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default PlanificationComponent;
