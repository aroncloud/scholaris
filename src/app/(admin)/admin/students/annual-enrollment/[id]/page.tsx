'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Award,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { showToast } from '@/components/ui/showToast';
import { IStudentDetail } from '@/types/programTypes';
import { getStudentDetails } from '@/actions/studentAction';
import { getStudentEnrollmentHistory } from '@/actions/programsAction';
import { DialogCreateFinalEnrollment } from '@/components/features/programs/Modal/DialogCreateFinalEnrollment';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStudentStore } from '@/store/studentStore';

export default function AnnualEnrollmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [student, setStudent] = useState<IStudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [enrollmentHistory, setEnrollmentHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  const openEnrollmentModal = useCallback(() => {
    console.log('Opening enrollment modal');
    setIsEnrollmentModalOpen(true);
  }, []);
  
  const closeEnrollmentModal = useCallback(() => {
    console.log('Closing enrollment modal');
    setIsEnrollmentModalOpen(false);
  }, []);

  // Fetch enrollment history
  const loadEnrollmentHistory = useCallback(async (studentCode: string) => {
    if (!studentCode) return;
    try {
      setHistoryLoading(true);
      const result = await getStudentEnrollmentHistory(studentCode);
      if (result.code === 'success') {
        setEnrollmentHistory(result.data || []);
      } else {
        console.error('Failed to load enrollment history:', result.error);
      }
    } catch (error) {
      console.error('Error loading enrollment history:', error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Fetch student details
  const loadStudent = useCallback(async () => {
    if (!params.id) return;
    try {
      setLoading(true);
      const result = await getStudentDetails(params.id);
      if (result.code === 'success' && result.data?.body) {
        const studentData = result.data.body;
        setStudent(studentData);
        // Load enrollment history after student data is loaded
        if (studentData.user_code) {
          await loadEnrollmentHistory(studentData.user_code);
        }
      } else {
        showToast({ variant: 'error', message: 'Erreur', description: 'Impossible de charger les détails de l\'étudiant' });
        router.push('/admin/students');
      }
    } catch (err) {
      console.error(err);
      showToast({ variant: 'error', message: 'Erreur', description: 'Une erreur est survenue lors du chargement des détails' });
      router.push('/admin/students');
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'PPP', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PROMOTED: { label: 'PROMOTED', className: 'bg-blue-100 text-blue-800' },
      REPEATER: { label: 'REPEATER', className: 'bg-yellow-100 text-yellow-800' },
      GRADUATED: { label: 'GRATUATED', className: 'bg-green-100 text-green-800' },
      DROPPED_OUT: { label: 'DROPPED_OUT', className: 'bg-red-100 text-red-800' },
      TRANSFERRED: { label: 'TRANSFERRES', className: 'bg-purple-100 text-purple-800' },
      ENROLLED: { label: 'ENROLLED', className: 'bg-green-100 text-green-800' },
      PENDING: { label: 'PENDING', className: 'bg-yellow-100 text-yellow-800' },
      REJECTED: { label: 'REJECTED', className: 'bg-red-100 text-red-800' },
      WITHDRAWN: { label: 'WITHDRAWN', className: 'bg-gray-100 text-gray-800' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <Badge className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getFinancialStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PAID: { label: 'PAID', className: 'bg-green-100 text-green-800' },
      PARTIALLY_PAID: { label: ' PARTIALLY_PAID', className: 'bg-blue-100 text-blue-800' },
      PENDING: { label: 'PENDING', className: 'bg-yellow-100 text-yellow-800' },
      OVERDUE: { label: 'OVERDUE', className: 'bg-orange-100 text-orange-800' },
      CANCELLED: { label: 'CANCELLED', className: 'bg-gray-100 text-gray-800' },
      REFUNDED: { label: 'REFUNDED', className: 'bg-purple-100 text-purple-800' },
      FAILED: { label: 'FAILED', className: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <Badge className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  const formatAcademicYear = (yearCode: string) =>
    yearCode ? yearCode.replace('ay-', '').replace('-', '/') : 'N/A';

  const handleBack = () => router.push('/admin/students');

  const handleEnrollmentSuccess = async (newEnrollment: any) => {
    if (!newEnrollment || !params.id) return;
    try {
      // Update the student status in the store
      const storeState = useStudentStore.getState();
      storeState.updateStudentStatus(params.id, 'ENROLLED');
      
      // Update the local state to reflect the change
      setStudent(prev => ({
        ...(prev || {} as IStudentDetail),
        status_code: 'ENROLLED',
        academic_year_code: newEnrollment.academic_year_code || prev?.academic_year_code,
        enrollment_date: newEnrollment.enrollment_date || prev?.enrollment_date,
      }));
      
      // Close the modal
      closeEnrollmentModal();
      
      showToast({ 
        variant: 'success', 
        message: 'Succès', 
        description: 'L\'inscription a été effectuée avec succès' 
      });
    } catch (err) {
      console.error('Error updating enrollment status:', err);
      showToast({ 
        variant: 'error', 
        message: 'Erreur', 
        description: 'Impossible de mettre à jour le statut' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-[100px]" /></CardHeader>
              <CardContent><Skeleton className="h-6 w-[150px]" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">Aucune donnée d'étudiant disponible</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste des étudiants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-6">
        {/* Header section */}
        <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Étudiants
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Détail de l'Étudiant</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {student.user_code} • Inscrit le {formatDate(student.enrollment_date)}
                </p>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div>{student.status_code && getStatusBadge(student.status_code)}</div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Button clicked, opening modal');
                  openEnrollmentModal();
                  // Force a state update to ensure the modal opens
                  setTimeout(() => {
                    console.log('Forcing state update');
                    openEnrollmentModal();
                  }, 0);
                }}
                disabled={!student || student?.status_code === 'ENROLLED'}
                className={student?.status_code === 'ENROLLED' 
                  ? 'bg-gray-300 text-gray-800 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90 text-white'}
              >
                {!student ? 'Chargement...' : (student.status_code === 'ENROLLED' ? "Finaliser l'inscription" : "Finaliser l'inscription")}
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                 <p className="text-sm text-muted-foreground">Niveau</p>
                  <p className="font-medium">{student?.cirriculum?.study_level || 'N/A'}</p>                </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'inscription</p>
                <p className="font-medium">{formatDate(student.enrollment_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niveau d'éducation</p>
                <p className="font-medium">{student?.education_level_code || 'N/A'}</p> 
              </div>
            </CardContent>
          </Card>

          {/* Academic Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Informations académiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Année académique</p>
                <p className="font-medium">{formatAcademicYear(student.academic_year_code)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Programme</p>
                <p className="font-medium">{student?.cirriculum?.program_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Curriculum</p>
                <p className="font-medium">{student?.cirriculum?.curriculum_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Curriculum</p>
                <p className="font-medium">{student?.cirriculum?. curriculum_code || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Statut
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Statut actuel</p>
                {getStatusBadge(student.status_code)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut financier</p>
                {getFinancialStatusBadge(student.financial_status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Numéro d'étudiant</p>
                <p className="font-mono font-medium">{student.student_number || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment History */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Historique des inscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <p className="text-gray-500 text-sm">Chargement de l’historique...</p>
              ) : enrollmentHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun historique d’inscription disponible</p>
              ) : (
                <div className="space-y-4">
                  {enrollmentHistory.map((history, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-lg bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          Année académique: {formatAcademicYear(history.academic_year_code)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {formatDate(history.enrollment_date)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Programme: {history.program_name || "N/A"}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center space-x-2">
                        {getStatusBadge(history.status_code)}
                        {getFinancialStatusBadge(history.financial_status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Enrollment Modal */}
        {student && (
          <div className="relative" style={{ zIndex: 1000 }}>
            <DialogCreateFinalEnrollment
              isOpen={isEnrollmentModalOpen}
              onClose={closeEnrollmentModal}
              studentCode={student.user_code}
              studentId={student.user_code}
              curriculumCode={student.cirriculum?.curriculum_code || ''}
              onSuccess={handleEnrollmentSuccess}
              onEnrollmentSuccess={(studentId, status, academicYear) => {
              setStudent(prev => {
                if (!prev) return null; // handle null case
                return {
                  ...prev,
                  status_code: status,
                  academic_year_code: academicYear ?? prev.academic_year_code, // use ?? instead of ||
                };
              });
              }}

            />

          </div>
        )}
      </div>
    </div>
  );
}