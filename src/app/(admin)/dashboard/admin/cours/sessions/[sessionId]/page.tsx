/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Save,
  User,
  Hash,
} from "lucide-react";
import { getStatusColor, formatDateToText } from "@/lib/utils";
import { showToast } from "@/components/ui/showToast";
import { Separator } from "@/components/ui/separator";

// Types pour les données de session
interface ISessionDetail {
  session_id: string;
  session_code: string;
  course_name: string;
  group_name: string;
  schedule: string;
  room: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  instructor_name: string;
  total_students: number;
  attendance_done: boolean;
  created_at: string;
}

interface IStudent {
  student_id: string;
  matricule: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  is_present: boolean;
  total_absences: number;
}

interface IAttendanceRecord {
  session_id: string;
  student_attendances: {
    student_id: string;
    is_present: boolean;
  }[];
}

// Composant de chargement
const LoadingCard = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </CardContent>
  </Card>
);

// Composant de chargement principal
const LoadingPage = () => (
  <div className="min-h-screen bg-background">
    <div className="space-y-4 sm:space-y-6">
      {/* Header Loading */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Loading */}
      <main className="container mx-auto px-4 sm:px-6 pb-8">
        <div className="space-y-6 sm:space-y-8">
          <LoadingCard />
          <LoadingCard />
        </div>
      </main>
    </div>
  </div>
);

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [session, setSession] = useState<ISessionDetail | null>(null);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Données simulées - à remplacer par vos appels d'API
  const mockSessionDetail = useMemo<ISessionDetail>(() => ({
    session_id: sessionId,
    session_code: "MATH101-A1-S001",
    course_name: "Mathématiques 101",
    group_name: "Groupe A1",
    schedule: "Lundi 08:00-10:00",
    room: "Salle 204",
    date: "2025-09-22",
    start_time: "08:00",
    end_time: "10:00",
    status: "IN_PROGRESS",
    instructor_name: "Dr. Martin Dubois",
    total_students: 28,
    attendance_done: false,
    created_at: "2025-09-15T10:00:00Z"
  }), [sessionId]);

  const mockStudents = useMemo<IStudent[]>(() => [
    {
      student_id: "1",
      matricule: "ETU001",
      first_name: "Marie",
      last_name: "Dubois",
      email: "marie.dubois@university.edu",
      is_present: true,
      total_absences: 2
    },
    {
      student_id: "2",
      matricule: "ETU002",
      first_name: "Jean",
      last_name: "Martin",
      email: "jean.martin@university.edu",
      is_present: true,
      total_absences: 0
    },
    {
      student_id: "3",
      matricule: "ETU003",
      first_name: "Sophie",
      last_name: "Bernard",
      email: "sophie.bernard@university.edu",
      is_present: false,
      total_absences: 1
    },
    {
      student_id: "4",
      matricule: "ETU004",
      first_name: "Pierre",
      last_name: "Durand",
      email: "pierre.durand@university.edu",
      is_present: true,
      total_absences: 3
    },
    {
      student_id: "5",
      matricule: "ETU005",
      first_name: "Emma",
      last_name: "Petit",
      email: "emma.petit@university.edu",
      is_present: true,
      total_absences: 1
    }
  ], []);

  const loadSessionDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulation d'appel API - remplacez par vos vrais appels
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSession(mockSessionDetail);
      setStudents(mockStudents);
      
      // Initialiser les étudiants présents
      const presentStudents = new Set(
        mockStudents
          .filter(student => student.is_present)
          .map(student => student.student_id)
      );
      setSelectedStudents(presentStudents);
      
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: "Erreur lors du chargement",
        description: "Une erreur est survenue lors du chargement des détails de la session",
        position: 'top-center',
      });
      router.push("/dashboard/dashboard/admin/sessions");
    } finally {
      setIsLoading(false);
    }
  }, [mockSessionDetail, mockStudents, router]);

  const handleStudentToggle = (studentId: string) => {
    if (session?.attendance_done) return;
    
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (session?.attendance_done) return;
    
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.student_id)));
    }
  };

  const handleSaveAttendance = async () => {
    if (!session || session.attendance_done) return;
    
    setIsSaving(true);
    try {
      const attendanceData: IAttendanceRecord = {
        session_id: session.session_id,
        student_attendances: students.map(student => ({
          student_id: student.student_id,
          is_present: selectedStudents.has(student.student_id)
        }))
      };

      // Simulation d'appel API - remplacez par votre vrai appel
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Saving attendance:', attendanceData);

      // Mettre à jour l'état local
      setSession(prev => prev ? { ...prev, attendance_done: true } : null);
      
      showToast({
        variant: "success-solid",
        message: "Appel enregistré avec succès",
        description: `Présences mises à jour pour ${students.length} étudiants`,
        position: 'top-center',
      });

    } catch (error) {
      showToast({
        variant: "error-solid",
        message: "Erreur lors de l'enregistrement",
        description: "Une erreur est survenue lors de l'enregistrement de l'appel",
        position: 'top-center',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard/admin/sessions");
  };

  useEffect(() => {
    loadSessionDetails();
  }, [sessionId, loadSessionDetails]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto p-4 sm:p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Session non trouvée
              </h3>
              <p className="text-muted-foreground mb-4">
                La session demandée n'existe pas ou n'est plus disponible.
              </p>
              <Button onClick={handleGoBack} variant="outline">
                Retour à la liste des sessions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const presentCount = selectedStudents.size;
  const absentCount = students.length - presentCount;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Navigation et titre */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleGoBack}
                  className="self-start"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Retour
                </Button>
                
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                      <h1 className="text-lg sm:text-xl font-bold tracking-tight break-words">
                        {session.course_name} - {session.group_name}
                      </h1>
                    </div>
                    <Badge className={getStatusColor(session.status)} variant="secondary">
                      {session.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions - Desktop */}
              <div className="hidden sm:flex items-center gap-2">
                {!session.attendance_done && (
                  <Button 
                    variant="info" 
                    onClick={handleSaveAttendance}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? 'Enregistrement...' : 'Enregistrer l\'appel'}
                  </Button>
                )}
                {session.attendance_done && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Appel terminé</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 pb-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Informations de session */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Informations de la session
                </CardTitle>
                <CardDescription className="text-sm">
                  Détails de la session de cours et planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Colonne de gauche */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Hash className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Code Session</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {session.session_code}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Horaire</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {session.schedule}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Colonne de droite */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Salle</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {session.room}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Enseignant</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {session.instructor_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="border-t border-gray-100 mt-6 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {students.length}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total</p>
                        <p className="text-xs text-gray-500">Étudiants inscrits</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600">
                          {presentCount}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Présents</p>
                        <p className="text-xs text-gray-500">Sélectionnés</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                        <span className="text-sm font-semibold text-red-600">
                          {absentCount}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Absents</p>
                        <p className="text-xs text-gray-500">Non sélectionnés</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des étudiants et appel */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      Liste d'Appel
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {session.attendance_done 
                        ? "Appel terminé - Consultation en lecture seule" 
                        : "Sélectionnez les étudiants présents et enregistrez l'appel"
                      }
                    </CardDescription>
                  </div>
                  
                  {!session.attendance_done && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleSelectAll}
                        className="flex items-center gap-1"
                      >
                        <Checkbox 
                          checked={selectedStudents.size === students.length}
                          onChange={() => {}}
                        />
                        Tous présents
                      </Button>
                      <Button 
                        variant="info" 
                        size="sm"
                        onClick={handleSaveAttendance}
                        disabled={isSaving}
                        className="sm:hidden flex items-center gap-1"
                      >
                        {isSaving ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3" />
                        )}
                        Enregistrer
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {students.map((student) => {
                    const isPresent = selectedStudents.has(student.student_id);
                    
                    return (
                      <div 
                        key={student.student_id} 
                        className={`p-4 transition-colors ${
                          session.attendance_done 
                            ? 'cursor-default' 
                            : 'cursor-pointer hover:bg-gray-50'
                        }`}
                        onClick={() => handleStudentToggle(student.student_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              {!session.attendance_done && (
                                <Checkbox 
                                  checked={isPresent}
                                  onChange={() => handleStudentToggle(student.student_id)}
                                  className="pointer-events-none"
                                />
                              )}
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                                {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {student.first_name} {student.last_name}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-3">
                                <span className="font-mono">{student.matricule}</span>
                                <span>{student.email}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                              <div className={`font-medium ${
                                student.total_absences === 0 
                                  ? 'text-green-600'
                                  : student.total_absences <= 2 
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}>
                                {student.total_absences} absence{student.total_absences > 1 ? 's' : ''}
                              </div>
                            </div>
                            
                            {session.attendance_done && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                isPresent 
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {isPresent ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Présent
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3" />
                                    Absent
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}