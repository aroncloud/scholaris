'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, User, BookOpen, Calendar, FileText, Mail, Phone, MapPin, GraduationCap, Award, Clock, History, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStudentStore } from '@/store/studentStore';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { showToast } from '@/components/ui/showToast';
import { IStudentDetail, IEnrollmentHistory } from '@/types/programTypes';
import { getStudentDetails } from '@/actions/studentAction';
import { getStudentEnrollmentHistory } from '@/actions/programsAction';
import { DialogCreateFinalEnrollment } from '@/components/features/programs/Modal/DialogCreateFinalEnrollment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StudentDetailPage() {
  // Toast notifications are handled through showToast
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [student, setStudent] = useState<IStudentDetail | null>({
    ...({} as IStudentDetail),
    status_code: '',
    academic_year_code: '',
    user_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    birth_date: '',
    birth_place: '',
    gender: 'MALE',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    curriculum: {
      curriculum_code: '',
      program_name: '',
      study_level: ''
    },
    student_number: '',
    financial_status: 'PENDING',
    created_at: '',
    updated_at: ''
  });
  const [enrollmentHistory, setEnrollmentHistory] = useState<IEnrollmentHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    console.log('Current enrollment history state:', {
      loadingHistory,
      enrollmentHistory,
      studentCode: student?.user_code,
      studentStatus: student?.status_code,
      hasEnrollmentData: enrollmentHistory.length > 0,
      enrollmentDataSample: enrollmentHistory.length > 0 ? enrollmentHistory[0] : 'No data',
      rawResponse: (window as any).lastEnrollmentResponse // We'll log this in the fetch function
    });
  }, [enrollmentHistory, loadingHistory, student]);

  const fetchEnrollmentHistory = async (studentCode: string) => {
    console.log('Fetching enrollment history for student code:', studentCode);
    try {
      setLoadingHistory(true);
      const response = await getStudentEnrollmentHistory(studentCode);
      console.log('Enrollment history API response:', response);
      // Store raw response for debugging
      (window as any).lastEnrollmentResponse = response;
      
      let historyData: IEnrollmentHistory[] = [];
      
      // Handle the specific response format from the backend
      if (response && typeof response === 'object') {
        // Case 1: Response has a body array (from your example)
        if (response.body && Array.isArray(response.body)) {
          console.log('Found enrollment history in response.body');
          historyData = response.body;
        }
        // Case 2: Response has a data array
        else if (response.data && Array.isArray(response.data)) {
          console.log('Found enrollment history in response.data');
          historyData = response.data;
        }
        // Case 3: Response is the array directly (shouldn't happen with your backend but just in case)
        else if (Array.isArray(response)) {
          console.log('Response is directly an array');
          historyData = response;
        }
        
        // Log if we found data but it's empty
        if (historyData.length === 0) {
          console.log('No enrollment history data found in the expected format. Full response:', response);
          // Try to extract from the response structure
          if (response && typeof response === 'object' && 'code' in response && response.code === 'success' && 'body' in response) {
            try {
              const body = response.body;
              if (Array.isArray(body)) {
                historyData = body;
              } else if (body && typeof body === 'object' && 'data' in body && Array.isArray(body.data)) {
                historyData = body.data;
              }
            } catch (e) {
              console.error('Error parsing enrollment history:', e);
            }
          }
        }
      }
      
      console.log('Processed enrollment history data:', historyData);
      
      // Always update the state, even if empty
      setEnrollmentHistory(historyData);
      
      if (historyData.length === 0) {
        console.warn('No enrollment history records found for this student');
      } else {
        console.log(`Successfully loaded ${historyData.length} enrollment records`);
      }
    } catch (error) {
      console.error('Error fetching enrollment history:', error);
      showToast({
        variant: 'error',
        message: 'Erreur',
        description: 'Impossible de charger l\'historique des inscriptions',
      });
      setEnrollmentHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!params.id) {
        console.error('No student ID available');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching student details for ID:', params.id);
        const result = await getStudentDetails(params.id);
        console.log('Student details API response:', result);
        
        if (result.code === 'success' && result.data) {
          console.log('Setting student data:', result.data.body);
          setStudent(result.data.body);
          // Fetch enrollment history when student data is loaded
          if (result.data.body.user_code) {
            console.log('Fetching enrollment history for user code:', result.data.body.user_code);
            await fetchEnrollmentHistory(result.data.body.user_code);
          } else {
            console.warn('No user_code found in student details');
          }
        } else {
          console.error('Error in student details response:', result);
          showToast({
            variant: 'error',
            message: 'Erreur',
            description: 'Impossible de charger les détails de l\'étudiant',
          });
          router.push('/admin/students');
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
        showToast({
          variant: 'error',
          message: 'Erreur',
          description: 'Une erreur est survenue lors du chargement des détails',
        });
        router.push('/admin/students');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStudentDetails();
    }
  }, [params.id]);

  const handleEnrollmentSuccess = async (newEnrollment: any) => {
    if (!newEnrollment) {
      console.error('[handleEnrollmentSuccess] No enrollment data provided');
      showToast({
        variant: 'error',
        message: 'Erreur',
        description: 'Aucune donnée d\'inscription reçue',
      });
      return;
    }
    
    if (!params.id) {
      console.error('[handleEnrollmentSuccess] No student ID available');
      showToast({
        variant: 'error',
        message: 'Erreur',
        description: 'ID étudiant manquant',
      });
      return;
    }

    try {
      console.log('[handleEnrollmentSuccess] Updating student with new enrollment:', newEnrollment);
      
      // Update the student status to ENROLLED in the store
      const updateStudentStatus = useStudentStore.getState().updateStudentStatus;
      updateStudentStatus(params.id, 'ENROLLED');
      
      // Update local state
      setStudent(prev => ({
        ...(prev || {} as IStudentDetail),
        status_code: 'ENROLLED',
        status: 'ENROLLED',
        academic_year_code: newEnrollment.academic_year?.year_code || newEnrollment.academic_year_code || '',
        enrollment_date: newEnrollment.enrollment_date || new Date().toISOString(),
        user_code: params.id,
      }));
      
      // Wait for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Refresh the enrollment history
      if (student?.user_code) {
        await fetchEnrollmentHistory(student.user_code);
      }

      // Show success message
      showToast({
        variant: 'success',
        message: 'Succès',
        description: 'L\'inscription a été effectuée avec succès',
      });

      // Update the parent window if this is in an iframe
      if (typeof window !== 'undefined' && window.parent) {
        window.parent.postMessage({
          type: 'STUDENT_STATUS_UPDATED',
          studentId: params.id,
          status: 'ENROLLED'
        }, '*');
      }
    } catch (error) {
      console.error('[handleEnrollmentSuccess] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      showToast({
        variant: 'error',
        message: 'Erreur',
        description: `Erreur lors de la mise à jour des informations: ${errorMessage}`,
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'PP', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Format academic year for display (e.g., 'ay-2023-2024' -> '2023/2024')
  const formatAcademicYear = (yearCode: string) => {
    if (!yearCode) return 'N/A';
    // Remove 'ay-' prefix if it exists and format the year
    return yearCode.replace('ay-', '').replace('-', '/');
  };

  const getStatusBadge = (status: string) => {
    // Return null if status is empty
    if (!status) return null;
    
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; className?: string }> = {
      'PROMOTED': { variant: 'default', label: 'PROMOTED', className: 'bg-blue-100/50 hover:bg-blue-200/50 text-blue-800' },
      'REPEATER': { variant: 'destructive', label: 'REPEATER', className: 'bg-red-100/50 hover:bg-red-200/50 text-red-800' },
      'GRADUATED': { variant: 'default', label: 'GRADUATED', className: 'bg-blue-100/50 hover:bg-blue-200/50 text-blue-800' },
      'DROPPED_OUT': { variant: 'destructive', label: 'DROPPED OUT', className: 'bg-red-100/50 hover:bg-red-200/50 text-red-800' },
      'TRANSFERRED': { variant: 'outline', label: 'TRANSFERRED', className: 'bg-purple-100/50 hover:bg-purple-200/50 text-purple-800' },
      'ENROLLED': { variant: 'default', label: 'ENROLLED', className: 'bg-green-100/50 hover:bg-green-200/50 text-green-800' },
      'ACTIVE': { variant: 'default', label: 'ACTIVE', className: 'bg-green-100/50 hover:bg-green-200/50 text-green-800' },
      'INACTIVE': { variant: 'destructive', label: 'INACTIVE', className: 'bg-gray-200/50 hover:bg-gray-300/50 text-gray-600' },
      'PENDING': { variant: 'secondary', label: 'PENDING', className: 'bg-yellow-100/50 hover:bg-yellow-200/50 text-yellow-800' },
      'APPROVED': { variant: 'default', label: 'APPROVED', className: 'bg-green-100/50 hover:bg-green-200/50 text-green-800' },
      'REJECTED': { variant: 'destructive', label: 'REJECTED', className: 'bg-red-100/50 hover:bg-red-200/50 text-red-800' },
      'WITHDRAWN': { variant: 'destructive', label: 'WITHDRAWN', className: 'bg-red-100/50 hover:bg-red-200/50 text-red-800' },
      'SUSPENDED': { variant: 'destructive', label: 'SUSPENDED', className: 'bg-orange-100/50 hover:bg-orange-200/50 text-orange-800' },
    };

    const statusInfo = statusMap[status] || { variant: 'secondary' as const, label: status, className: 'bg-gray-100 hover:bg-gray-200 text-gray-800' };
    
    return (
      <Badge variant={statusInfo.variant} className={`capitalize ${statusInfo.className || ''}`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getFinancialStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; className?: string }> = {
      'PAID': { variant: 'default', label: 'PAID', className: 'bg-green-500 hover:bg-green-600 text-white' },
      'PENDING': { variant: 'secondary', label: 'PENDING', className: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
      'PARTIALLY_PAID': { variant: 'outline', label: 'PARTIALLY PAID', className: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
      'OVERDUE': { variant: 'destructive', label: 'OVERDUE', className: 'bg-red-500 hover:bg-red-600 text-white' },
      'EXEMPTED': { variant: 'default', label: 'EXEMPTED', className: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
      'UNPAID': { variant: 'destructive', label: 'UNPAID', className: 'bg-red-100 hover:bg-red-200 text-red-800' },
      'REFUNDED': { variant: 'secondary', label: 'REFUNDED', className: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
    };

    const statusInfo = statusMap[status] || { variant: 'secondary' as const, label: status, className: 'bg-gray-100 hover:bg-gray-200 text-gray-800' };
    
    return (
      <Badge variant={statusInfo.variant} className={`capitalize ${statusInfo.className || ''}`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const renderEnrollmentHistory = () => {
    if (loadingHistory) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }

    if (!enrollmentHistory || enrollmentHistory.length === 0) {
      return (
        <div className="text-center py-12">
          <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun historique d'inscription trouvé</h3>
          <p className="text-sm text-gray-500">Aucun historique d'inscription n'est disponible pour cet étudiant.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Année académique</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Niveau d'études</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollmentHistory.map((enrollment) => (
              <TableRow key={enrollment.enrollment_code}>
                <TableCell>
                  {enrollment.academic_year?.year_code || enrollment.academic_year_code || 'N/A'}
                </TableCell>
                <TableCell>
                  {enrollment.cirriculum?.program_name || 'N/A'}
                </TableCell>
                <TableCell>
                  {enrollment.cirriculum?.study_level || 'N/A'}
                </TableCell>
                <TableCell>
                  {enrollment.enrollment_date 
                    ? format(new Date(enrollment.enrollment_date), 'dd/MM/yyyy', { locale: fr }) 
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(enrollment.status_code || '')}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {enrollment.notes || 'Aucune note'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading || !student) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-[150px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.push('/admin/students');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack}
                className="border-gray-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Détail de l'Étudiant
                </h1>
                {student?.user_code && (
                  <p className="text-sm text-gray-500 mt-1">
                    {student.user_code} • Inscrit le {student.enrollment_date ? format(new Date(student.enrollment_date), 'dd/MM/yyyy') : 'N/A'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {student?.status_code && (
                <div className="mr-4">
                  {getStatusBadge(student.status_code)}
                </div>
              )}
              <Button 
                onClick={() => setIsEnrollmentModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
                disabled={student?.status_code === 'ENROLLED'}
              >
                {student?.status_code === 'ENROLLED' ? 'Déjà inscrit' : "Finaliser L'inscription"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Informations personnelles</CardTitle>
                {/* <div className="flex items-center space-x-2">
                  {student && getStatusBadge(student.status_code)}
                  {student?.financial_status && getFinancialStatusBadge(student.financial_status)}
                </div> */}
              </div>
            </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-muted rounded-full p-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">
                      {student.cirriculum?.program_name || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-muted rounded-full p-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Code</p>
                    <p className="font-medium">
                      {student?.user_code || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-muted rounded-full p-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">
                      {student?.student_number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-muted rounded-full p-2">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Programme</p>
                    <p className="font-medium">
                      {student.cirriculum?.program_name || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-muted rounded-full p-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Niveau</p>
                    <p className="font-medium">
                      {student?.cirriculum?.study_level || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-muted rounded-full p-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'inscription</p>
                    <p className="font-medium">
                      {student?.enrollment_date ? formatDate(student.enrollment_date) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Informations académiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Année académique</p>
                <p className="font-medium">
                  {student.academic_year_code ? formatAcademicYear(student.academic_year_code) : '-'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Niveau d'études</p>
                <p className="font-medium">{student.education_level_code || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Programme</p>
                <p className="font-medium">
                  {student.cirriculum?.program_name || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Curriculum</p>
                <p className="font-medium">
                  {student.cirriculum?.program_name || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Historique académique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Statut actuel</p>
                <div className="flex items-center">
                  {student.status_code ? getStatusBadge(student.status_code) : '-'}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Statut financier</p>
                <div className="flex items-center">
                  {getFinancialStatusBadge(student.financial_status)}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Numéro d'étudiant</p>
                <p className="font-mono font-medium">
                  {student.student_number || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Enrollment History */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center">
              <History className="h-5 w-5 mr-2 text-gray-500" />
              <CardTitle className="text-lg font-semibold">Historique des Inscriptions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadingHistory ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : enrollmentHistory.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Année Académique</TableHead>
                      <TableHead>Programme</TableHead>
                      <TableHead>Niveau d'études</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollmentHistory.map((enrollment) => (
                      <TableRow key={enrollment.enrollment_code}>
                        <TableCell className="font-medium">
                          {enrollment.academic_year?.year_code || enrollment.academic_year_code || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {enrollment.cirriculum?.program_name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {enrollment.cirriculum?.study_level || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {enrollment.enrollment_date ? 
                            format(parseISO(enrollment.enrollment_date), 'dd/MM/yyyy') : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(enrollment.status_code || '')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="text-muted-foreground">
                  Aucun historique d'inscription trouvé
                </div>
                
              </div>
            )}
          </CardContent>
        </Card>

        <DialogCreateFinalEnrollment
          open={isEnrollmentModalOpen}
          onOpenChange={setIsEnrollmentModalOpen}
          studentCode={student?.user_code || ''}
          studentId={student?.user_code || ''}
          curriculumCode={student?.curriculum_code || ''}
          onSuccess={handleEnrollmentSuccess}
          onEnrollmentSuccess={async (studentCode, status) => {
            try {
              console.log(`[AnnualEnrollment] Student ${studentCode} status updated to ${status}`);
              
              if (!studentCode) {
                throw new Error('No student code provided');
              }
              
              // Update the status in the Zustand store
              updateStudentStatus(studentCode, 'ENROLLED');
              
              // Wait for the store update to complete
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Update local state
              setStudent(prev => ({
                ...(prev || {} as IStudentDetail),
                status_code: 'ENROLLED',
                status: 'ENROLLED'
              }));
              
              // Close the modal
              setIsEnrollmentModalOpen(false);
              
              // Show success message
              showToast({ 
                variant: 'success',
                message: 'Succès',
                description: 'Le statut de l\'étudiant a été mis à jour avec succès'
              });
              
              // Refresh the enrollment history
              await fetchEnrollmentHistory(studentCode);
              
              // Force a refresh of the student list in the parent component
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('studentStatusUpdated', {
                  detail: { studentCode, status: 'ENROLLED' }
                }));
              }
              
            } catch (error) {
              console.error('[onEnrollmentSuccess] Error:', error);
              const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
              showToast({ 
                variant: 'error', 
                message: 'Erreur',
                description: `Échec de la mise à jour du statut: ${errorMessage}` 
              });
            }
          }}
        />
      </div>
    </div>
    </div>
  );
}