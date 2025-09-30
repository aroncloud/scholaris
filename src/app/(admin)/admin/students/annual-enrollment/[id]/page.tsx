/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';

import BoxedSkeleton from '@/components/Skeletons/BoxedSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStudentDetails } from '@/hooks/feature/students/useStudentDetailsData';
import PageHeader from '@/layout/PageHeader';
import { formatDateToText, getStatusColor } from '@/lib/utils';
import { useRouter } from '@bprogress/next/app';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import  { v4 as uuidv4 } from "uuid"

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id;
  const router = useRouter();

  const { student, isLoading, history, isHistoryLoading } = useStudentDetails(studentId as string);
  if (isLoading && isHistoryLoading) {
    return <BoxedSkeleton />
  }

  const handleBack = () => {
    router.push('/admin/students');
  };

  if (!student) {
    return <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Etudiant introuvable</h2>
        <p className="text-gray-600 mt-2">L&apos;Etudiant demandé n&apos;existe pas ou a été supprimé.</p>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    </div>;
  }

  return (
    <div>
      <PageHeader
        backLabel='Etudiants'
        title={`Détail de l'étudiant`}
        description={`${student.first_name} • Inscript le ${formatDateToText(student.submitted_at)}`}
        backUrl='/admin/students'
        status={
          <Badge className={getStatusColor(student.application_status_code)}>
            {student.application_status_code}
          </Badge>
        }
      >

        <div className="flex items-center justify-end space-x-3">
          {canApprove() && (
            <Button 
              onClick={handleApprove}
              disabled={processing}
              variant={'success'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </Button>
          )}
          
          {canReject() && (
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="danger">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Rejeter la candidature</DialogTitle>
                  <DialogDescription>
                    Veuillez indiquer la raison du rejet. Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Raison du rejet..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleReject}
                    disabled={processing || !rejectionReason.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Confirmer le rejet
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {canConvert() && (
            <Button 
              onClick={handleConvert}
              disabled={converting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {converting ? 'Conversion...' : 'Convertir en Étudiant'}
            </Button>
          )}
        </div>
      </PageHeader>
    </div>
  );
}