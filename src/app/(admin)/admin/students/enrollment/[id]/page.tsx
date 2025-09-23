"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, User, Phone, FileText, Users, Calendar, CheckCircle, XCircle, UserPlus, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { formatDateToText, getStatusColor } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useRouter } from "@bprogress/next/app";
import { showToast } from '@/components/ui/showToast';
import { convertStudentApplication, getStudentApplication, reviewStudentApplication } from '@/actions/studentAction';
import LoadingSpinner from '@/components/LoadingSpinner';
import { IGetApplicationDetail } from '@/types/userType';

const ApplicationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const applicationCode = params.id as string;
  
  const [applicationData, setApplicationData] = useState<IGetApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [converting, setConverting] = useState(false);

  const loadApplicationDetails = useCallback(async () => {
    try {
      const result = await getStudentApplication(applicationCode);
      console.log('-->result', result)
      if (result.code === 'success') {
        setApplicationData(result.data.body);
      } else {
        showToast({
          variant: "error-solid",
          message: 'Erreur',
          description: `Erreur lors du chargement des détails`,
          position: 'top-center',
        });
      }
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: `Une erreur s'est produite`,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }, [applicationCode]);

  useEffect(() => {
    loadApplicationDetails();
  }, [applicationCode, loadApplicationDetails]);

  const handleBack = () => {
    router.push('/admin/students');
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const result = await reviewStudentApplication(applicationCode, 'APPROVED');
      console.log('-->result', result)
      if(result.code === 'success') {
        showToast({
          variant: "success",
          message: 'Succès',
          description: 'Candidature approuvée avec succès',
          position: 'top-center',
        });
      }
      await loadApplicationDetails();
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: 'Erreur lors de l\'approbation',
        position: 'top-center',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      const result = await reviewStudentApplication(applicationCode, 'REJECTED', rejectionReason);
      if(result.code === 'success'){
        showToast({
          variant: "default",
          message: 'Succès',
          description: 'Candidature rejetée',
          position: 'top-center',
        });
      }
        
      setRejectDialogOpen(false);
      await loadApplicationDetails();
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: 'Erreur lors du rejet',
        position: 'top-center',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      const result = await convertStudentApplication(applicationCode);
      console.log('-->handleConverted.result', result);
      if(result.code === 'success') {
        showToast({
          variant: "success", // ← change from "default" to "success"
          message: 'Succès',
          description: 'Candidature convertie en étudiant avec succès',
          position: 'top-center',
        });
      }
      await loadApplicationDetails();
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: 'Erreur lors de la conversion',
        position: 'top-center',
      });
    } finally {
      setConverting(false);
    }
};





  const getRelationshipLabel = (code: string) => {
    const labels: { [key: string]: string } = {
      'FATHER': 'Père',
      'MOTHER': 'Mère',
      'SPOUSE': 'Conjoint(e)',
      'SIBLING': 'Frère/Sœur',
      'CHILD': 'Enfant'
    };
    return labels[code] || code;
  };

  const canApprove = () => (applicationData?.application_status_code == 'SUBMITTED');
  const canReject = () => (applicationData?.application_status_code == 'SUBMITTED');
  const canConvert = () => applicationData?.application_status_code === 'APPROVED';

  // Affichage du loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size={48} message="Chargement du contenu ..." />
      </div>
    );
  }

  // Affichage d'erreur si les données ne sont pas disponibles
  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Détail de la Candidature
              </h1>
            </div>
          </div>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">Aucune donnée trouvée</p>
                  <p className="text-gray-500">Les informations de cette candidature sont indisponibles.</p>
                </div>
                <Button variant="outline" onClick={() => loadApplicationDetails()}>
                  Réessayer
                </Button>
              </div>
            </CardContent>
          </Card>
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
                Candidatures
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Détail de la Candidature
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {applicationData.application_code} • Soumise le {formatDateToText(applicationData.submitted_at)}
                </p>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <Badge className={getStatusColor(applicationData.application_status_code)}>
                  {applicationData.application_status_code}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Action buttons */}
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-600" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Prénom</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{applicationData.first_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nom de famille</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{applicationData.last_name}</dd>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de naissance</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDateToText(applicationData.date_of_birth)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lieu de naissance</dt>
                  <dd className="mt-1 text-sm text-gray-900">{applicationData.place_of_birth}</dd>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Genre</dt>
                  <dd className="mt-1 text-sm text-gray-900">{applicationData.gender === 'MALE' ? 'Masculin' : 'Féminin'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Village/Localité</dt>
                  <dd className="mt-1 text-sm text-gray-900">{applicationData.village || 'Non renseigné'}</dd>
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Niveau d&apos;éducation</dt>
                <dd className="mt-1 text-sm text-gray-900">{applicationData.education_level_code}</dd>
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-600" />
                Coordonnées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Adresse e-mail</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{applicationData.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Numéro de téléphone</dt>
                <dd className="mt-1 text-sm text-gray-900">{applicationData.phone_number || 'Non renseigné'}</dd>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Pièce d&apos;identité</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">N° CNI</dt>
                    <dd className="mt-1 text-sm text-gray-900">{applicationData.cni_number || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date d&apos;émission</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDateToText(applicationData.cni_issue_date)}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lieu d&apos;émission</dt>
                  <dd className="mt-1 text-sm text-gray-900">{applicationData.cni_issue_location || 'Non renseigné'}</dd>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programme d'études */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-600" />
                Programme d&apos;études
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Programme</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{applicationData.cirriculum.program_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Curriculum</dt>
                <dd className="mt-1 text-sm text-gray-900">{applicationData.cirriculum.curriculum_name}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Code programme</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{applicationData.cirriculum.program_code}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Niveau d&apos;études</dt>
                  <dd className="mt-1 text-sm text-gray-900">{applicationData.cirriculum.study_level}</dd>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traitement */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                Informations de traitement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de soumission</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDateToText(applicationData.submitted_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de traitement</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDateToText(applicationData.processed_at)}</dd>
                </div>
              </div>
              {/* <div>
                <dt className="text-sm font-medium text-gray-500">Traitée par</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{applicationData.processed_user_code}</dd>
              </div> */}
              {applicationData.converted_to_user_code && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Convertie vers utilisateur</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{applicationData.converted_to_user_code}</dd>
                </div>
              )}
              {applicationData.rejection_reason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <dt className="text-sm font-medium text-red-800">Raison du rejet</dt>
                  <dd className="mt-1 text-sm text-red-700">{applicationData.rejection_reason}</dd>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Proches */}
        {applicationData.relatives && applicationData.relatives.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-600" />
                Personnes de référence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {applicationData.relatives.map((relative, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {getRelationshipLabel(relative.relationship_type_code)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        {relative.last_name} {relative.first_name}
                      </p>
                      {relative.phone_number && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {relative.phone_number}
                        </p>
                      )}
                      {relative.occupation && (
                        <p className="text-sm text-gray-600">{relative.occupation}</p>
                      )}
                      {relative.address && (
                        <p className="text-sm text-gray-600">{relative.address}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-600" />
              Documents joints
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicationData.documents.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucun document attaché</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applicationData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">
                        {doc.document_name || `Document ${index + 1}`}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;