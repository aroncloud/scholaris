"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, User, MapPin, Phone, Mail, Calendar, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { getStatusColor } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { showToast } from '@/components/ui/showToast';
import { getStudentApplication } from '@/actions/studentAction';
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
          variant: "success-solid",
          message: 'Erreur',
          description: `Erreur lors du chargement des détails`,
          position: 'top-center',
        });
        // router.push('/admin/students');
      }
    } catch (error) {
      showToast({
        variant: "success-solid",
        message: 'Erreur',
        description: `Une erreur s'est produite`,
        position: 'top-center',
      });
      // router.push('/admin/students');
    } finally {
      setLoading(false);
    }
  }, [applicationCode]);


  useEffect(() => {
    loadApplicationDetails();
  }, [applicationCode, loadApplicationDetails]);

  const handleApprove = async () => {
    setProcessing(true);
    // try {
    //   const result = await reviewStudentApplication(applicationCode, 'APPROVED');
    //   if (result.code === 'success') {
    //     toast.success("Demande approuvée avec succès");
    //     await loadApplicationDetails();
    //   } else {
    //     toast.error("Erreur lors de l'approbation", {
    //       description: result.error,
    //     });
    //   }
    // } catch (error) {
    //   toast.error("Erreur lors de l'approbation");
    // } finally {
    //   setProcessing(false);
    // }
  };

  const handleReject = async () => {
    // if (!rejectionReason.trim()) {
    //   toast.error("Veuillez saisir une raison de rejet");
    //   return;
    // }
    
    // setProcessing(true);
    // try {
    //   const result = await reviewStudentApplication(applicationCode, 'REJECTED', rejectionReason);
    //   if (result.code === 'success') {
    //     toast.success("Demande rejetée");
    //     setRejectDialogOpen(false);
    //     setRejectionReason("");
    //     await loadApplicationDetails();
    //   } else {
    //     toast.error("Erreur lors du rejet", {
    //       description: result.error,
    //     });
    //   }
    // } catch (error) {
    //   toast.error("Erreur lors du rejet");
    // } finally {
    //   setProcessing(false);
    // }
  };

  const handleConvert = async () => {
    // setConverting(true);
    // try {
    //   const result = await convertStudentApplication(applicationCode);
    //   if (result.code === 'success') {
    //     toast.success("Candidature convertie en étudiant avec succès");
    //     await loadApplicationDetails();
    //   } else {
    //     toast.error("Erreur lors de la conversion", {
    //       description: result.error,
    //     });
    //   }
    // } catch (error) {
    //   toast.error("Erreur lors de la conversion");
    // } finally {
    //   setConverting(false);
    // }
  };

  const handleBack = () => {
    // Navigation de retour - à implémenter selon votre routeur
    console.log('Retour à la liste des applications');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'CONVERTED':
        return 'default';
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      default:
        return 'outline';
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Détail de l&apos;Application
              </h1>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Aucune donnée d&apos;application trouvée.</p>
              <Button variant="outline" className="mt-4" onClick={() => loadApplicationDetails()}>
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Détail de l&apos;Application
              </h1>
              <p className="text-gray-500">{applicationData.application_code}</p>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(applicationData.application_status_code)}>
            {applicationData.application_status_code}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations Personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Prénom</label>
                  <p className="text-sm text-gray-900">{applicationData.first_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p className="text-sm text-gray-900">{applicationData.last_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                  <p className="text-sm text-gray-900">{formatDate(applicationData.date_of_birth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Lieu de naissance</label>
                  <p className="text-sm text-gray-900">{applicationData.place_of_birth}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Genre</label>
                  <p className="text-sm text-gray-900">{applicationData.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Village</label>
                  <p className="text-sm text-gray-900">{applicationData.village}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Niveau d&apos;éducation</label>
                <p className="text-sm text-gray-900">{applicationData.education_level_code}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{applicationData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="text-sm text-gray-900">{applicationData.phone_number || 'Non renseigné'}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">N° CNI</label>
                <p className="text-sm text-gray-900">{applicationData.cni_number || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date d&apos;émission CNI</label>
                <p className="text-sm text-gray-900">{formatDate(applicationData.cni_issue_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Lieu d&apos;émission CNI</label>
                <p className="text-sm text-gray-900">{applicationData.cni_issue_location || 'Non renseigné'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Programme d'études */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Programme d&apos;Études</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Code Programme</label>
                <p className="text-sm text-gray-900">{applicationData.cirriculum.program_code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nom du Programme</label>
                <p className="text-sm text-gray-900">{applicationData.cirriculum.program_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Curriculum</label>
                <p className="text-sm text-gray-900">{applicationData.cirriculum.curriculum_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Niveau d&apos;études</label>
                <p className="text-sm text-gray-900">{applicationData.cirriculum.study_level}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations de traitement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Traitement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Soumise le</label>
                <p className="text-sm text-gray-900">{formatDate(applicationData.submitted_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Traitée le</label>
                <p className="text-sm text-gray-900">{formatDate(applicationData.processed_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Traitée par</label>
                <p className="text-sm text-gray-900">{applicationData.processed_user_code}</p>
              </div>
              {applicationData.converted_to_user_code && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Convertie vers utilisateur</label>
                  <p className="text-sm text-gray-900">{applicationData.converted_to_user_code}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Proches */}
        {applicationData.relatives && applicationData.relatives.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Proches</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applicationData.relatives.map((relative, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {getRelationshipLabel(relative.relationship_type_code)}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">{relative.last_name} {relative.first_name}</p>
                      <p className="text-sm text-gray-500">{relative.phone_number}</p>
                      {relative.occupation && (
                        <p className="text-sm text-gray-500">{relative.occupation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicationData.documents.length === 0 ? (
              <p className="text-gray-500">Aucun document attaché</p>
            ) : (
              <div className="space-y-2">
                {applicationData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{doc.document_name || `Document ${index + 1}`}</span>
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