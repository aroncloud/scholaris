/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useCallback, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Send,
  Upload,
  Eye,
  MapPin,
  User,
  Filter,
  Search,
  BookOpen,
} from "lucide-react";
// import { formatDateToText } from "@/lib/utils";
import { showToast } from "@/components/ui/showToast";

// Types pour les données d'absence
interface IAbsenceRecord {
  absence_id: string;
  session_id: string;
  session_code: string;
  course_name: string;
  group_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room: string;
  instructor_name: string;
  justification_status: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  justification_reason?: string;
  justification_details?: string;
  justification_document?: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewer_comment?: string;
  created_at: string;
}

interface IJustificationSubmission {
  absence_id: string;
  reason: string;
  details: string;
  document?: File;
}

export default function StudentAbsencesPage() {
  const [absences, setAbsences] = useState<IAbsenceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJustificationDialogOpen, setIsJustificationDialogOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<IAbsenceRecord | null>(null);
  const [justificationData, setJustificationData] = useState({
    reason: '',
    details: '',
    document: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const mockAbsences: IAbsenceRecord[] = [
    {
      absence_id: "ABS001",
      session_id: "SES001",
      session_code: "MATH101-A1-S001",
      course_name: "Mathématiques 101",
      group_name: "Groupe A1",
      session_date: "2025-09-15",
      start_time: "08:00",
      end_time: "10:00",
      room: "Salle 204",
      instructor_name: "Dr. Martin Dubois",
      justification_status: "NOT_SUBMITTED",
      created_at: "2025-09-15T10:00:00Z"
    },
    {
      absence_id: "ABS002",
      session_id: "SES002",
      session_code: "PHY201-B2-S005",
      course_name: "Physique 201",
      group_name: "Groupe B2",
      session_date: "2025-09-12",
      start_time: "14:00",
      end_time: "16:00",
      room: "Labo A",
      instructor_name: "Dr. Sophie Bernard",
      justification_status: "PENDING",
      justification_reason: "Maladie",
      justification_details: "Grippe avec fièvre, consultation médicale",
      submitted_at: "2025-09-13T09:00:00Z",
      created_at: "2025-09-12T16:00:00Z"
    },
    {
      absence_id: "ABS003",
      session_id: "SES003",
      session_code: "INFO301-C1-S012",
      course_name: "Algorithmique 301",
      group_name: "Groupe C1",
      session_date: "2025-09-10",
      start_time: "10:00",
      end_time: "12:00",
      room: "Salle 105",
      instructor_name: "Prof. Jean Martin",
      justification_status: "APPROVED",
      justification_reason: "Urgence familiale",
      justification_details: "Hospitalisation d'un proche nécessitant ma présence",
      submitted_at: "2025-09-11T08:00:00Z",
      reviewed_at: "2025-09-11T14:00:00Z",
      reviewer_comment: "Justification acceptée. Certificat médical valide.",
      created_at: "2025-09-10T12:00:00Z"
    },
    {
      absence_id: "ABS004",
      session_id: "SES004", 
      session_code: "STAT201-A1-S008",
      course_name: "Statistiques 201",
      group_name: "Groupe A1",
      session_date: "2025-09-08",
      start_time: "16:00",
      end_time: "18:00",
      room: "Salle 301",
      instructor_name: "Dr. Emma Petit",
      justification_status: "REJECTED",
      justification_reason: "Transport",
      justification_details: "Panne de transport en commun",
      submitted_at: "2025-09-09T10:00:00Z",
      reviewed_at: "2025-09-09T16:00:00Z",
      reviewer_comment: "Justification non recevable. Les problèmes de transport ne constituent pas une excuse valable sauf cas exceptionnels.",
      created_at: "2025-09-08T18:00:00Z"
    },
    {
      absence_id: "ABS005",
      session_id: "SES005",
      session_code: "ALGO201-A1-S015",
      course_name: "Algorithmique avancée",
      group_name: "Groupe A1",
      session_date: "2025-09-20",
      start_time: "09:00",
      end_time: "11:00",
      room: "Salle 107",
      instructor_name: "Prof. Lucas Moreau",
      justification_status: "NOT_SUBMITTED",
      created_at: "2025-09-20T11:00:00Z"
    }
  ];

  const loadAbsences = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAbsences(mockAbsences);
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: "Erreur lors du chargement",
        description: "Une erreur est survenue lors du chargement de vos absences",
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openJustificationDialog = (absence: IAbsenceRecord) => {
    setSelectedAbsence(absence);
    if (absence.justification_status !== 'NOT_SUBMITTED') {
      setJustificationData({
        reason: absence.justification_reason || '',
        details: absence.justification_details || '',
        document: null
      });
    } else {
      setJustificationData({
        reason: '',
        details: '',
        document: null
      });
    }
    setIsJustificationDialogOpen(true);
  };

  const handleSubmitJustification = async () => {
    if (!selectedAbsence || !justificationData.reason.trim() || !justificationData.details.trim()) {
      showToast({
        variant: "error-solid",
        message: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        position: 'top-center',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData: IJustificationSubmission = {
        absence_id: selectedAbsence.absence_id,
        reason: justificationData.reason,
        details: justificationData.details,
        document: justificationData.document || undefined
      };

      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Submitting justification:', submissionData);

      // Mettre à jour l'état local
      setAbsences(prev => prev.map(absence => 
        absence.absence_id === selectedAbsence.absence_id
          ? {
              ...absence,
              justification_status: 'PENDING',
              justification_reason: justificationData.reason,
              justification_details: justificationData.details,
              submitted_at: new Date().toISOString()
            }
          : absence
      ));

      setIsJustificationDialogOpen(false);
      setSelectedAbsence(null);
      setJustificationData({ reason: '', details: '', document: null });

      showToast({
        variant: "success-solid",
        message: "Justification envoyée",
        description: "Votre justification a été soumise et sera examinée prochainement",
        position: 'top-center',
      });

    } catch (error) {
      showToast({
        variant: "error-solid",
        message: "Erreur lors de l'envoi",
        description: "Une erreur est survenue lors de l'envoi de la justification",
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setJustificationData(prev => ({ ...prev, document: file }));
    }
  };

  const getJustificationStatusBadge = (status: string) => {
    switch (status) {
      case 'NOT_SUBMITTED':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 ">À justifier</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 ">En attente</Badge>;
      case 'APPROVED':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 ">Justifiée</Badge>;
      case 'REJECTED':
        return <Badge variant="secondary" className="bg-red-100 text-red-700 ">Refusée</Badge>;
      default:
        return <Badge variant="secondary" className="">Inconnu</Badge>;
    }
  };

  // Filtrage et recherche
  const filteredAbsences = absences.filter(absence => {
    const matchesFilter = filterStatus === 'all' || absence.justification_status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      absence.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.session_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Statistiques
  const stats = {
    total: absences.length,
    notSubmitted: absences.filter(a => a.justification_status === 'NOT_SUBMITTED').length,
    pending: absences.filter(a => a.justification_status === 'PENDING').length,
    approved: absences.filter(a => a.justification_status === 'APPROVED').length,
    rejected: absences.filter(a => a.justification_status === 'REJECTED').length,
  };

  useEffect(() => {
    loadAbsences();
  }, [loadAbsences]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className=" mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto space-y-6">
        {/* Header compact */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Mes Absences</h1>
          <p className=" text-gray-600">
            Consultez vos absences et soumettez des justifications
          </p>
        </div>

        {/* Statistiques compactes */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-700' },
            { label: 'À justifier', value: stats.notSubmitted, color: 'text-orange-600' },
            { label: 'En attente', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Justifiées', value: stats.approved, color: 'text-green-600' },
            { label: 'Refusées', value: stats.rejected, color: 'text-red-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-3 rounded-lg border text-center">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className=" text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contrôles */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="NOT_SUBMITTED">À justifier</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="APPROVED">Justifiées</SelectItem>
                <SelectItem value="REJECTED">Refusées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Liste des absences - Format tableau compact */}
        <div>
          <div className="space-y-4">
            {filteredAbsences.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className=" font-medium text-gray-900">Aucune absence</h3>
                <p className=" text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Aucun résultat pour ces critères'
                    : 'Vous n\'avez pas d\'absences enregistrées'
                  }
                </p>
              </div>
            ) : (
              filteredAbsences.map((absence) => (
                  <AbsenceCard 
                    key={absence.absence_id}
                    formatDateToText={formatDateToText}
                    absence={absence} 
                    onOpenJustification={(a) =>
                        alert("Ouvrir justification pour " + a.course_name)
                    }
                    onViewJustification={(a) =>
                        alert("Voir détails de " + a.course_name)
                    }
                  />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dialog de justification */}
      <Dialog open={isJustificationDialogOpen} onOpenChange={setIsJustificationDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectedAbsence?.justification_status === 'NOT_SUBMITTED' 
                ? 'Justifier l\'absence' 
                : 'Justification soumise'
              }
            </DialogTitle>
            <DialogDescription className="">
              {selectedAbsence && (
                <>
                  {selectedAbsence.course_name} • {formatDateToText(selectedAbsence.session_date)} • {selectedAbsence.start_time}-{selectedAbsence.end_time}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className=" font-medium">Motif *</Label>
              <Select 
                value={justificationData.reason} 
                onValueChange={(value) => setJustificationData(prev => ({ ...prev, reason: value }))}
                disabled={selectedAbsence?.justification_status !== 'NOT_SUBMITTED'}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez un motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maladie">Maladie</SelectItem>
                  <SelectItem value="Urgence familiale">Urgence familiale</SelectItem>
                  <SelectItem value="Rendez-vous médical">Rendez-vous médical</SelectItem>
                  <SelectItem value="Problème de transport">Problème de transport</SelectItem>
                  <SelectItem value="Stage/Emploi">Stage/Emploi</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className=" font-medium">Explication *</Label>
              <Textarea
                placeholder="Expliquez les circonstances..."
                value={justificationData.details}
                onChange={(e) => setJustificationData(prev => ({ ...prev, details: e.target.value }))}
                className="mt-1"
                rows={3}
                disabled={selectedAbsence?.justification_status !== 'NOT_SUBMITTED'}
              />
            </div>

            {selectedAbsence?.justification_status === 'NOT_SUBMITTED' && (
              <div>
                <Label className=" font-medium">Document (optionnel)</Label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className=" text-gray-500 mt-1">
                  PDF, JPG, PNG, DOC, DOCX (max 5MB)
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsJustificationDialogOpen(false)}
              disabled={isSubmitting}
              size="sm"
            >
              {selectedAbsence?.justification_status === 'NOT_SUBMITTED' ? 'Annuler' : 'Fermer'}
            </Button>
            {selectedAbsence?.justification_status === 'NOT_SUBMITTED' && (
              <Button
                onClick={handleSubmitJustification}
                disabled={isSubmitting || !justificationData.reason || !justificationData.details}
                size="sm"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Send className="h-3 w-3 mr-1" />
                )}
                {isSubmitting ? 'Envoi...' : 'Envoyer'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


import {
  ChevronsDown,
  ChevronsUp,
} from "lucide-react";

type JustificationStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

export interface Absence {
  absence_id: string;
  course_name: string;
  group_name?: string;
  session_code?: string;
  session_date: string;
  start_time?: string;
  end_time?: string;
  room?: string;
  instructor_name?: string;
  justification_status: JustificationStatus;
  justification_reason?: string;
  justification_details?: string;
  submitted_at?: string;
  reviewer_comment?: string;
}

interface AbsenceCardProps {
  absence: Absence;
  onOpenJustification: (a: Absence) => void; // ouvre modal de justification / édition
  onViewJustification: (a: Absence) => void; // voir seulement
  formatDateToText: (d: string) => string;
}

function StatusBadge({ status }: { status: JustificationStatus }) {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-50 text-green-800 px-2 py-0.5 text-sm">Approuvé</Badge>;
    case "REJECTED":
      return <Badge className="bg-red-50 text-red-800 px-2 py-0.5 text-sm">Refusé</Badge>;
    case "PENDING":
      return <Badge className="bg-yellow-50 text-yellow-800 px-2 py-0.5 text-sm">En attente</Badge>;
    default:
      return <Badge className="bg-gray-50 text-gray-700 px-2 py-0.5 text-sm">Non soumis</Badge>;
  }
}

export function AbsenceCard({
  absence,
  onOpenJustification,
  onViewJustification,
  formatDateToText,
}: AbsenceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className=" shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* LEFT: contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-9 w-9 rounded-md bg-slate-50 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className=" font-semibold text-slate-900 truncate">
                        {absence.course_name}
                      </h4>
                      <span className="text-sm text-slate-500 truncate">
                        {absence.group_name ? `· ${absence.group_name}` : ""}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 truncate">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateToText(absence.session_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {absence.start_time ?? "—"} • {absence.end_time ?? "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {absence.room ?? "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {absence.instructor_name ?? "—"}
                      </span>
                      {/* Statut intégré dans la meta */}
                      <StatusBadge status={absence.justification_status} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Justification */}
            {absence.justification_status !== "NOT_SUBMITTED" && (
              <div
                className={`mt-3 pl-3 border-l-2 border-slate-100 ${
                  expanded ? "pb-3" : "pb-0"
                }`}
              >
                <div className="min-w-0">
                  <div className=" text-slate-700 font-medium truncate">
                    {absence.justification_reason ?? "Motif non spécifié"}
                  </div>
                  <div className=" text-slate-600 mt-1 line-clamp-3">
                    {absence.justification_details ?? "Aucun détail fourni."}
                  </div>
                  {absence.submitted_at && (
                    <div className="text-sm text-slate-400 mt-1">
                      Soumise le {formatDateToText(absence.submitted_at)}
                    </div>
                  )}
                </div>

                {/* réponse (approbation/rejet) */}
                {absence.reviewer_comment && (
                  <div
                    className={`mt-3 p-3 rounded-md  ${
                      absence.justification_status === "APPROVED"
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    <span className="font-medium">Réponse :</span>
                    <p className="mt-1">{absence.reviewer_comment}</p>
                  </div>
                )}

                {/* expand toggle */}
                {/* <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setExpanded((s) => !s)}
                    className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    aria-expanded={expanded}
                  >
                    {expanded ? (
                      <>
                        <ChevronsUp className="h-3 w-3" /> Masquer
                      </>
                    ) : (
                      <>
                        <ChevronsDown className="h-3 w-3" /> Lire la suite
                      </>
                    )}
                  </button>
                </div> */}
              </div>
            )}
          </div>

          {/* RIGHT: actions */}
          <div className="grid grid-cols-2 items-end gap-2 shrink-0">
            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={() => onOpenJustification(absence)}
              variant={
                absence.justification_status === "NOT_SUBMITTED"
                  ? "default"
                  : "outline"
              }
            >
              <Send className="h-4 w-4" />
              {absence.justification_status === "NOT_SUBMITTED"
                ? "Justifier"
                : "Modifier"}
            </Button>

            <Button
              size="sm"
              className="flex items-center gap-2"
              variant="secondary"
              onClick={() => onViewJustification(absence)}
            >
              <Eye className="h-4 w-4" />
              Détails
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



function formatDateToText(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}