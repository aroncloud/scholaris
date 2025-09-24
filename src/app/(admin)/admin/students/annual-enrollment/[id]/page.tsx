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
import { SkeletonAnnualEnrollmentSection } from '@/components/features/skeleton/SkeletonAnnualEnrollmentSection';
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
  const [selectedCurriculum, setSelectedCurriculum] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  
  const openEnrollmentModal = useCallback(() => {
    console.log('Opening enrollment modal');
    setIsEnrollmentModalOpen(true);
  }, []);
  
  const closeEnrollmentModal = useCallback(() => {
    console.log('Closing enrollment modal');
    setIsEnrollmentModalOpen(false);
  }, []);

  // Fetch enrollment history
  const loadEnrollmentHistory = useCallback(async (studentCode: string, studentData: any = null) => {
    if (!studentCode) {
      console.warn('No student code provided to loadEnrollmentHistory');
      return;
    }
    try {
      console.log('Starting to load enrollment history for:', studentCode);
      setHistoryLoading(true);
      let result;
      try {
        result = await getStudentEnrollmentHistory(studentCode);
        console.log('Raw enrollment history API response:', result);
      } catch (error) {
        console.error('Network error when fetching enrollment history:', error);
        showToast({
          variant: 'error-solid',
          message: 'Erreur de connexion',
          description: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.'
        });
        setHistoryLoading(false);
        return;
      }
      
      if (result?.code === 'success') {
        // The API returns data in result.data according to the function's return type
        let historyData = Array.isArray(result.data) ? result.data : [];
        
        // If no history but student has an active enrollment, create a history entry from current enrollment
        const currentStudent = studentData || student;
        if (historyData.length === 0 && currentStudent?.status_code === 'ENROLLED' && currentStudent?.academic_year_code) {
          console.log('No history found, creating entry from current enrollment');
          historyData = [{
            enrollment_code: `${currentStudent.user_code}@${currentStudent.academic_year_code}@${currentStudent.curriculum_code}`,
            student_user_code: currentStudent.user_code,
            academic_year_code: currentStudent.academic_year_code,
            curriculum_code: currentStudent.curriculum_code,
            status_code: currentStudent.status_code,
            enrollment_date: currentStudent.enrollment_date || new Date().toISOString(),
            notes: '',  // Add the missing required property
            academic_year: {
              academic_year_code: currentStudent.academic_year_code,
              year_code: currentStudent.academic_year_code.replace('ay-', '').replace(/-/g, '/'),
              start_date: new Date().toISOString(),
              end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
              status_code: 'ACTIVE'
            },
            cirriculum: currentStudent.cirriculum || {
              curriculum_code: currentStudent.curriculum_code || '',
              curriculum_name: currentStudent.cirriculum?.curriculum_name || 'N/A',
              study_level: currentStudent.cirriculum?.study_level || 'N/A',
              program_code: currentStudent.cirriculum?.program_code || 'N/A',
              program_name: currentStudent.cirriculum?.program_name || 'N/A'
            }
          }];
        }
        
        console.log('Processed enrollment history data:', {
          count: historyData.length,
          data: historyData,
          studentCode
        });
        
        if (historyData.length === 0) {
          console.log('No enrollment history found for student:', studentCode);
        }
        
        setEnrollmentHistory(historyData);
      } else {
        console.error('Failed to load enrollment history:', result?.error);
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: result?.error?.message || 'Impossible de charger l\'historique des inscriptions. Veuillez réessayer plus tard.'
        });
      }
    } catch (error) {
      console.error('Unexpected error loading enrollment history:', error);
      showToast({
        variant: 'error-solid',
        message: 'Erreur inattendue',
        description: 'Une erreur inattendue est survenue. Veuillez réessayer ou contacter le support technique.'
      });
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Fetch student details
  const loadStudent = useCallback(async () => {
    if (!params.id) return;
    try {
      setLoading(true);
      console.log('Fetching student details for ID:', params.id);
      const result = await getStudentDetails(params.id);
      console.log('Student details result:', result);
      
      if (result.code === 'success' && result.data?.body) {
        const studentData = result.data.body;
        console.log('Setting student data:', studentData);
        setStudent(studentData);
        
        // Load enrollment history after student data is loaded
        if (studentData.user_code) {
          console.log('Loading enrollment history for user:', studentData.user_code);
          // Pass the student data to the loadEnrollmentHistory function
          await loadEnrollmentHistory(studentData.user_code, studentData);
        } else {
          console.warn('No user_code found in student data');
        }
      } else {
        showToast({ variant: 'error-solid', message: 'Erreur', description: 'Impossible de charger les détails de l\'étudiant' });
        router.push('/admin/students');
      }
    } catch (err) {
      console.error(err);
      showToast({ variant: 'error-solid', message: 'Erreur', description: 'Une erreur est survenue lors du chargement des détails' });
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
      
      // Refresh the student data to get the latest information
      await loadStudent();
      
      // Close the modal
      closeEnrollmentModal();
      
      showToast({ 
        variant: 'success-solid', 
        message: 'Succès', 
        description: 'L\'inscription a été effectuée avec succès' 
      });
    } catch (err) {
      console.error('Error updating enrollment status:', err);
      showToast({ 
        variant: 'error-solid', 
        message: 'Erreur', 
        description: 'Impossible de mettre à jour le statut' 
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonAnnualEnrollmentSection />
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
            {!['ENROLLED', 'PROMOTED'].includes(student?.status_code || '') && (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Button clicked, opening modal');
                    openEnrollmentModal();
                  }}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Finaliser l'inscription
                </Button>
              </div>
            )}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Année académique:</span> {formatAcademicYear(history.academic_year?.year_code || history.academic_year_code)}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Date d'inscription:</span> {formatDate(history.enrollment_date)}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Statut:</span> {getStatusBadge(history.status_code)}
                          </p>
                          {history.financial_status && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Statut financier:</span> {getFinancialStatusBadge(history.financial_status)}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">
                            <span className="text-muted-foreground">Programme:</span> {history.cirriculum?.program_name || history.curriculum_name || "N/A"}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Code Programme:</span> {history.cirriculum?.program_code || "N/A"}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Niveau:</span> {history.cirriculum?.study_level || "N/A"}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Code Curriculum:</span> {history.curriculum_code || "N/A"}
                          </p>
                          {history.notes && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Notes:</span> {history.notes}
                            </p>
                          )}
                        </div>
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
              curriculumCode={selectedCurriculum || student.cirriculum?.curriculum_code || ''}
              onSuccess={handleEnrollmentSuccess}
              onEnrollmentSuccess={(studentId, status, academicYear) => {
                setStudent(prev => {
                  if (!prev) return null; // handle null case
                  
                  // Create an updated curriculum object
                  const updatedCurriculum = {
                    ...(prev.cirriculum || {}),
                    curriculum_code: selectedCurriculum || prev.cirriculum?.curriculum_code || ''
                  };
                  
                  return {
                    ...prev,
                    status_code: status,
                    academic_year_code: academicYear ?? prev.academic_year_code,
                    cirriculum: updatedCurriculum
                  };
                });
                // Reset the selected values after enrollment
                setSelectedCurriculum('');
                setSelectedAcademicYear('');
              }}
              onCurriculumChange={(curriculumCode) => {
                setSelectedCurriculum(curriculumCode);
              }}
              onAcademicYearChange={(academicYear) => {
                setSelectedAcademicYear(academicYear);
              }}

            />

          </div>
        )}
      </div>
    </div>
  );
}