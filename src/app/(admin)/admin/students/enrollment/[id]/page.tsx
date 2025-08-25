'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  UserPlus,
} from "lucide-react";
import { getStudentApplication, reviewStudentApplication, convertStudentApplication } from "@/actions/studentAction";
import { getStatusColor, formatDateToText } from "@/lib/utils";
import { toast } from "sonner";

interface ApplicationDetail {
  application_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  date_of_birth: string | null;
  place_of_birth: string | null;
  cni_number: string | null;
  cni_issue_date: string | null;
  cni_issue_location: string | null;
  curriculum_code: string;
  application_status_code: string;
  submitted_at: string | null;
  processed_at: string | null;
  rejection_reason: string | null;
  region_code: string | null;
  department_code: string | null;
  arrondissement_code: string | null;
  village: string | null;
  country: string | null;
  city: string | null;
  street: string | null;
  address_details: string | null;
  education_level_code: string | null;
  ethnicity_code: string | null;
  marital_status_code: string | null;
  cirriculum?: {
    curriculum_name: string;
    study_level: string;
    duration: string;
  };
}

export default function EnrollmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationCode = params.id as string;
  
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    loadApplicationDetails();
  }, [applicationCode]);

  const loadApplicationDetails = async () => {
    try {
      const result = await getStudentApplication(applicationCode);
      if (result.code === 'success') {
        setApplication(result.data.body);
      } else {
        toast.error("Erreur lors du chargement des détails");
        router.push('/admin/students');
      }
    } catch (error) {
      toast.error("Une erreur s'est produite");
      router.push('/admin/students');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const result = await reviewStudentApplication(applicationCode, 'APPROVED');
      if (result.code === 'success') {
        toast.success("Demande approuvée avec succès");
        await loadApplicationDetails();
      } else {
        toast.error("Erreur lors de l'approbation", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Erreur lors de l'approbation");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Veuillez saisir une raison de rejet");
      return;
    }
    
    setProcessing(true);
    try {
      const result = await reviewStudentApplication(applicationCode, 'REJECTED', rejectionReason);
      if (result.code === 'success') {
        toast.success("Demande rejetée");
        setRejectDialogOpen(false);
        setRejectionReason("");
        await loadApplicationDetails();
      } else {
        toast.error("Erreur lors du rejet", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Erreur lors du rejet");
    } finally {
      setProcessing(false);
    }
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      const result = await convertStudentApplication(applicationCode);
      if (result.code === 'success') {
        toast.success("Candidature convertie en étudiant avec succès");
        await loadApplicationDetails();
      } else {
        toast.error("Erreur lors de la conversion", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Erreur lors de la conversion");
    } finally {
      setConverting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      DRAFT: { label: "Brouillon", color: "bg-gray-100 text-gray-800" },
      SUBMITTED: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "Approuvé", color: "bg-green-100 text-green-800" },
      REJECTED: { label: "Rejeté", color: "bg-red-100 text-red-800" },
      CONVERTED: { label: "Converti", color: "bg-blue-100 text-blue-800" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.SUBMITTED;
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Demande d'inscription introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/students')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {application.first_name} {application.last_name}
            </h1>
            <p className="text-muted-foreground">
              Code: {application.application_code}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(application.application_status_code)}
          {console.log('Application status:', application.application_status_code)}
          {(application.application_status_code === 'DRAFT' || application.application_status_code === 'SUBMITTED') && (
            <div className="flex space-x-2">
              <Button
                onClick={handleApprove}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
              <Button
                variant="destructive"
                onClick={() => setRejectDialogOpen(true)}
                disabled={processing}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
            </div>
          )}
          {application.application_status_code === 'APPROVED' && (
            <Button
              onClick={handleConvert}
              disabled={converting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {converting ? "Conversion..." : "Convertir en étudiant"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Prénom</Label>
                <p>{application.first_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                <p>{application.last_name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {application.email}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {application.phone_number}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Genre</Label>
                <p>{application.gender === 'MALE' ? 'Masculin' : 'Féminin'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date de naissance</Label>
                <p>{application.date_of_birth ? formatDateToText(application.date_of_birth) : 'Non renseignée'}</p>
              </div>
            </div>

            {application.cni_number && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">CNI</Label>
                  <p>{application.cni_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Lieu d'émission CNI</Label>
                  <p>{application.cni_issue_location || 'Non renseigné'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Curriculum et statut */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Programme</Label>
                  <p className="font-medium">{application.cirriculum?.curriculum_name || 'Non défini'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Niveau</Label>
                  <p>{application.cirriculum?.study_level || 'Non défini'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Durée</Label>
                  <p>{application.cirriculum?.duration || 'Non définie'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Chronologie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date de soumission</Label>
                  <p>{application.submitted_at ? formatDateToText(application.submitted_at) : 'Non soumise'}</p>
                </div>
                {application.processed_at && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Date de traitement</Label>
                    <p>{formatDateToText(application.processed_at)}</p>
                  </div>
                )}
                {application.converted_to_user_code && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Code étudiant créé</Label>
                    <p className="text-green-600 font-medium">{application.converted_to_user_code}</p>
                  </div>
                )}
                {application.rejection_reason && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Raison du rejet</Label>
                    <p className="text-red-600">{application.rejection_reason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Adresse */}
      {(application.country || application.city || application.street) && (
        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Pays</Label>
                <p>{application.country || 'Non renseigné'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Ville</Label>
                <p>{application.city || 'Non renseignée'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Rue</Label>
                <p>{application.street || 'Non renseignée'}</p>
              </div>
            </div>
            {application.address_details && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-muted-foreground">Détails de l'adresse</Label>
                <p>{application.address_details}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog de rejet */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet de cette demande d'inscription.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Raison du rejet *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Expliquez pourquoi cette demande est rejetée..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={processing}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing}
            >
              {processing ? "Rejet..." : "Rejeter la demande"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}