/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';

import BoxedSkeleton from '@/components/Skeletons/BoxedSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentDetails } from '@/hooks/feature/students/useStudentDetailsData';
import PageHeader from '@/layout/PageHeader';
import { formatDateToText, getStatusColor } from '@/lib/utils';
import { useRouter } from '@bprogress/next/app';
import { 
  ArrowLeft, 
  Award, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  GraduationCap,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from "uuid";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id;
  const router = useRouter();
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  const { student, isLoading, history, isHistoryLoading } = useStudentDetails(studentId as string);
  
  if (isLoading && isHistoryLoading) {
    return <BoxedSkeleton />
  }

  const handleBack = () => {
    router.push('/dashboard/admin/students');
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Etudiant introuvable</h2>
          <p className="text-gray-600 mt-2">L&apos;Etudiant demandé n&apos;existe pas ou a été supprimé.</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value, className = "" }: any) => (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="mt-0.5 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="font-medium text-sm truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        backLabel='Etudiants'
        title={`${student.first_name} ${student.last_name}`}
        description={`Inscrit le ${formatDateToText(student.enrollment_date)}`}
        backUrl='/dashboard/admin/students'
        status={
          <Badge className={getStatusColor(student.status_code ?? "N/A")}>
            {student.status_code ?? "N/A"}
          </Badge>
        }
      >
        <div className="flex items-center justify-end space-x-3">
          {!['ENROLLED', 'PROMOTED'].includes(student?.status_code || '') && (
            <Button
              onClick={() => setIsEnrollmentModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white"
              variant={"info"}
            >
              Finaliser L'inscription
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="space-y-6 mt-6 p-6">
        {/* Vue d'ensemble rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Matricule</p>
                  <p className="text-lg font-bold font-mono">{student.student_number || 'N/A'}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Niveau d'études</p>
                  <p className="text-lg font-bold">{student?.cirriculum?.study_level || 'N/A'}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Statut financier</p>
                  <p className="text-lg font-bold">{student.financial_status || 'N/A'}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Année académique</p>
                  <p className="text-lg font-bold">{student.academic_year_code || 'N/A'}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Informations personnelles */}
          <Card className="xl:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem icon={Mail} label="Email principal" value={student.email} />
              {student.other_email && (
                <InfoItem icon={Mail} label="Email secondaire" value={student.other_email} />
              )}
              <InfoItem icon={Phone} label="Téléphone" value={student.phone_number} />
              {student.other_phone && (
                <InfoItem icon={Phone} label="Téléphone secondaire" value={student.other_phone} />
              )}
              <InfoItem icon={Users} label="Genre" value={student.gender} />
              {student.date_of_birth && (
                <InfoItem icon={Calendar} label="Date de naissance" value={formatDateToText(student.date_of_birth)} />
              )}
              {student.place_of_birth && (
                <InfoItem icon={MapPin} label="Lieu de naissance" value={student.place_of_birth} />
              )}
              {student.marital_status_code && (
                <InfoItem icon={Users} label="Statut matrimonial" value={student.marital_status_code} />
              )}
            </CardContent>
          </Card>

          {/* Programme académique */}
          <Card className="xl:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-600" />
                Programme académique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem 
                icon={GraduationCap} 
                label="Programme" 
                value={student?.cirriculum?.program_name} 
              />
              <InfoItem 
                icon={FileText} 
                label="Code programme" 
                value={student?.cirriculum?.program_code} 
              />
              <InfoItem 
                icon={Award} 
                label="Curriculum" 
                value={student?.cirriculum?.curriculum_name} 
              />
              <InfoItem 
                icon={FileText} 
                label="Code curriculum" 
                value={student?.cirriculum?.curriculum_code} 
              />
              <InfoItem 
                icon={GraduationCap} 
                label="Niveau d'études" 
                value={student?.cirriculum?.study_level} 
              />
              <InfoItem 
                icon={FileText} 
                label="Niveau d'éducation" 
                value={student?.education_level_code} 
              />
            </CardContent>
          </Card>

          {/* Adresse et documents */}
          <Card className="xl:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                Adresse et documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.country && (
                <InfoItem icon={MapPin} label="Pays" value={student.country} />
              )}
              {student.city && (
                <InfoItem icon={MapPin} label="Ville" value={student.city} />
              )}
              {student.street && (
                <InfoItem icon={MapPin} label="Rue" value={student.street} />
              )}
              {student.address_details && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-1">Détails d'adresse</p>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{student.address_details}</p>
                </div>
              )}
              {student.cni_number && (
                <>
                  <InfoItem icon={CreditCard} label="Numéro CNI" value={student.cni_number} />
                  {student.cni_issue_date && (
                    <InfoItem 
                      icon={Calendar} 
                      label="Date d'émission CNI" 
                      value={formatDateToText(student.cni_issue_date)} 
                    />
                  )}
                  {student.cni_issue_location && (
                    <InfoItem icon={MapPin} label="Lieu d'émission CNI" value={student.cni_issue_location} />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Historique des inscriptions - Version Premium */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                Parcours académique
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {history?.length || 0} inscription(s)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucun historique d'inscription disponible</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
                
                <div className="space-y-6">
                  {history.map((h, idx) => (
                    <div key={h.enrollment_code} className="relative pl-16 pr-4">
                      {/* Timeline dot */}
                      <div className="absolute left-3 top-3 h-6 w-6 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                      </div>

                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-lg text-gray-900">
                                {h.academic_year.start_date} - {h.academic_year.end_date}
                              </h3>
                              <Badge className={getStatusColor(h.status_code)}>
                                {h.status_code}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Inscrit le {formatDateToText(h.enrollment_date)}
                            </p>
                          </div>
                        </div>

                        {/* Content grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                Programme
                              </p>
                              <p className="font-semibold text-sm">{h.cirriculum.program_name || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground mt-1">Code: {h.cirriculum?.program_code || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                Curriculum
                              </p>
                              <p className="font-semibold text-sm">{h.cirriculum.curriculum_name || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground mt-1">Code: {h.curriculum_code || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Niveau d'études
                              </p>
                              <p className="font-semibold text-sm">{h.cirriculum?.study_level || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Année académique
                              </p>
                              <p className="font-semibold text-sm">{h.academic_year.year_code || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Statut: {h.academic_year.status_code}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Notes section */}
                        {h.notes && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Notes importantes
                            </p>
                            <p className="text-sm text-amber-800 whitespace-pre-wrap">{h.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}