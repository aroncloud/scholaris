/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCallback, useEffect, useState } from "react";
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
  Building,
  GraduationCap,
  FileText,
  LogOut,
} from "lucide-react";
import { getStatusColor, formatDateToText, getWeekRange } from "@/lib/utils";
import { showToast } from "@/components/ui/showToast";
import { Separator } from "@/components/ui/separator";
import { getTeacherSchedule } from "@/actions/planificationAction";
import { IGetSchedule, IGetStudentAttendence } from "@/types/planificationType";
import { useUserStore } from "@/store/useAuthStore";
import { getSessionAttendees, recordAbsences, terminateSession } from "@/actions/attendeesAction";

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
  <div className="min-h-screen bg-gray-50">
    <div className="space-y-6">
      {/* Header Loading */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Loading */}
      <div className="container mx-auto px-6 pb-8">
        <div className="space-y-6">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    </div>
  </div>
);

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [studentList, setStudentList] = useState<IGetStudentAttendence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTerminatingSession, setIsTerminatingSession] = useState(false);
  const [teacherSessions, setTeacherSessions] = useState<IGetSchedule | undefined>(undefined);
  const {user} = useUserStore();

  const getTeacherSessions = useCallback(async () => {
    if (user) {
        const { start, end } = getWeekRange();
        const result = await getTeacherSchedule(
            user.user.user_code,
            start,
            end
        );
        if(result.code == "success") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setTeacherSessions(result.data.body.find((item: any) => item.session_code == sessionId));
        } else {
            showToast({
                variant: "error-solid",
                message: "Erreur lors de la récupération des données",
                description: "Une erreur est survenue lors de la récupération des données. Veuillez réessayer ultérieurement.",
                position: 'top-center',
            });
        }
    }
  }, [user, sessionId]);

  const init = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getSessionAttendees(sessionId);
      setStudentList(result.data.body || []);
      console.log('-->result', result);
    } catch (error) {
      console.error("Failed to fetch session attendees:", error);
    } finally {
      setIsLoading(false)
    }
  }, [sessionId]);

  const handleStudentToggle = (userCode: string) => {
    setStudentList(prev => 
      prev.map(student => 
        student.user_code === userCode 
          ? { ...student, is_present: !student.is_present }
          : student
      )
    );
  };

  const handleSelectAll = () => {
    const allPresent = studentList.every(s => s.is_present);
    setStudentList(prev => 
      prev.map(student => ({ ...student, is_present: !allPresent }))
    );
  };

  const handleSaveAttendance = async () => {
    if (studentList.length === 0) {
      showToast({
        variant: "warning-solid",
        message: "Aucun étudiant inscrit",
        description: "Il n'y a aucun étudiant inscrit dans cette session pour enregistrer l'appel.",
        position: 'top-center',
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await recordAbsences(sessionId, studentList.filter(item => item.is_present == false).map(item => item.enrollment_code));
      console.log('-->result', result)
      if(result.code == "success") {
        showToast({
          variant: "success-solid",
          message: "Appel enregistré",
          description: "La présence des étudiants a été enregistrée avec succès.",
          position: 'top-center',
        });
        await terminateSession(sessionId, "COMPLETED");
      } else {
        showToast({
          variant: "error-solid",
          message: "Erreur d'enregistrement",
          description: result.error ?? "Une erreur est survenue lors de l'enregistrement de l'appel.",
          position: 'top-center',
        });
      }
      
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: "Erreur d'enregistrement",
        description: "Une erreur est survenu lors de l'enregistrement de l'appel. Essayez à nouveau ou contactez l'administrateur",
        position: 'top-center',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTerminateSession = async () => {
    setIsTerminatingSession(true)
    const result =  await terminateSession(sessionId, "TERMINATED");
    if(result.code == "success") {
      showToast({
        variant: "success-solid",
        message: "Session terminée",
        description: "Session de cours terminée avec succès.",
        position: 'top-center',
      });
    } else {
      showToast({
        variant: "error-solid",
        message: "Erreur d'enregistrement",
        description: result.error ?? "Une erreur est survenue lors de la cloture de la session. Essayez à nouveau ou contactez l'administrateur",
        position: 'top-center',
      });
    }
    setIsTerminatingSession(false)
  }

  const handleGoBack = () => {
    router.push("/dashboard/teacher/cours");
  };


  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    getTeacherSessions();
  }, [getTeacherSessions]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const presentCount = studentList.filter(s => s.is_present).length;
  const totalCount = studentList.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  const hasStudents = studentList.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center gap-4 w-full">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleGoBack}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Retour
                </Button>
                {teacherSessions && (
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {teacherSessions.session_title}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{teacherSessions.session_code}</span>
                      <Badge className={getStatusColor(teacherSessions.status_code)}>
                        {teacherSessions.status_code}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>  
              <div>
                <Button
                  onClick={handleTerminateSession}
                  disabled={isTerminatingSession || teacherSessions?.status_code === "TERMINATED"}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isTerminatingSession ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Fermeture de la session...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Terminer la session
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations de la session */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  Informations de la session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacherSessions && (
                  <>
                    <div className="flex items-start gap-3">
                      <Hash className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Code Session</p>
                        <p className="text-sm text-gray-600 font-mono">{teacherSessions.session_code}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Unité d'enseignement</p>
                        <p className="text-sm text-gray-600 font-mono">{teacherSessions.course_unit_code}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Horaire</p>
                        <p className="text-sm text-gray-600">
                          {formatDateToText(teacherSessions.start_time)} - {formatDateToText(teacherSessions.end_time)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ressource</p>
                        <p className="text-sm text-gray-600 font-mono">{teacherSessions.resource_code}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Enseignant</p>
                        <p className="text-sm text-gray-600 font-mono">{teacherSessions.teacher_user_code}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Planning</p>
                        <p className="text-sm text-gray-600 font-mono">{teacherSessions.schedule_code}</p>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Statistiques d'appel */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">Statistiques</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border">
                      <div className="text-lg font-semibold text-blue-600">{totalCount}</div>
                      <div className="text-xs text-blue-600">Inscrits</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border">
                      <div className="text-lg font-semibold text-green-600">{presentCount}</div>
                      <div className="text-xs text-green-600">Présents</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg border">
                    <div className="text-lg font-semibold text-gray-700">{attendanceRate}%</div>
                    <div className="text-xs text-gray-600">Taux de présence</div>
                  </div>

                  {!hasStudents && (
                    <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertCircle className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                      <div className="text-xs text-orange-600 font-medium">Aucun étudiant inscrit</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feuille d'appel ou message d'absence d'étudiants */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-gray-600" />
                      Feuille d'Appel
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      <Badge className={getStatusColor(teacherSessions?.status_code || "UNKNOWN")}>
                        {(teacherSessions && (teacherSessions.status_code == "TERMINATED" || teacherSessions.status_code == "COMPLETED")) ? "COMPLETED" : teacherSessions?.status_code ?? "PENDING"}
                      </Badge>
                    </CardDescription>
                  </div>
                  {hasStudents && (
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-green-600">{presentCount}</span> / {totalCount}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={isSaving || teacherSessions?.status_code === "TERMINATED"}
                        className="text-sm"
                      >
                        {studentList.every(s => s.is_present) ? 'Désélectionner' : 'Sélectionner'} tout
                      </Button>
                      <Button
                        onClick={handleSaveAttendance}
                        disabled={isSaving || teacherSessions?.status_code === "TERMINATED"}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer l'appel
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              {hasStudents ? (
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-16">
                            N°
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Matricule
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Nom et Prénom
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-24">
                            Présence
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentList.map((student, index) => (
                          <tr 
                            key={student.user_code}
                            className={`hover:bg-gray-50 transition-colors ${
                              student.is_present ? 'bg-green-50' : ''
                            }`}
                          >
                            <td className="px-4 py-4 text-sm text-gray-500 font-medium">
                              {String(index + 1).padStart(2, '0')}
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-mono text-gray-900 font-medium">
                                {student.student_number}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.last_name.toUpperCase()}, {student.first_name}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <Checkbox
                                checked={student.is_present}
                                disabled={teacherSessions?.status_code === "TERMINATED"}
                                onCheckedChange={() => handleStudentToggle(student.user_code)}
                                className='h-5 w-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                  <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun étudiant inscrit
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Cette session n'a pas d'étudiants inscrits. Vous pouvez tout de même consulter les informations de la session et utiliser les actions disponibles.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleTerminateSession}
                      disabled={isTerminatingSession || teacherSessions?.status_code === "TERMINATED"}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isTerminatingSession ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Fermeture...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Terminer la session
                        </>
                      )}
                    </Button>
                    <Button onClick={handleGoBack} variant="outline">
                      Retour à la liste
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}