'use client'

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  FileText,
  Calendar,
  CalendarDays,
  Bell,
  User,
  GraduationCap,
  MessageSquare,
  FileDown,
  Filter,
} from "lucide-react";

// Interfaces TypeScript
interface Absence {
  id: number;
  etudiantId: number;
  etudiantNom: string;
  etudiantEmail: string;
  programme: string;
  dateDebut: string;
  dateFin: string;
  duree: number;
  motif: string;
  typeAbsence: string;
  statut: "en_attente" | "approuve" | "refuse";
  justificatif?: {
    type: string;
    fichier: string;
    dateUpload: string;
  };
  commentaireAdmin?: string;
  dateTraitement?: string;
  cours: string;
  enseignant: string;
}

interface AbsenceStats {
  title: string;
  value: string;
  status: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down";
}

// Types d'absences
const typesAbsences = [
  { value: "maladie", label: "Maladie", color: "bg-red-100 text-red-800" },
  { value: "famille", label: "Raisons familiales", color: "bg-blue-100 text-blue-800" },
  { value: "stage", label: "Stage/Formation", color: "bg-green-100 text-green-800" },
  { value: "transport", label: "Problème transport", color: "bg-orange-100 text-orange-800" },
  { value: "personnel", label: "Raisons personnelles", color: "bg-purple-100 text-purple-800" },
  { value: "autre", label: "Autre", color: "bg-gray-100 text-gray-800" }
];

// Données mock pour les statistiques
const absenceStats: AbsenceStats[] = [
  {
    title: "Justificatifs en attente",
    value: "12",
    status: "warning",
    description: "À traiter",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Justificatifs traités",
    value: "45",
    status: "normal",
    description: "Cette semaine",
    icon: <CheckCircle className="h-4 w-4" />,
    trend: "+8.2%",
    trendDirection: "up"
  },
  {
    title: "Taux d'approbation",
    value: "78%",
    status: "excellent",
    description: "Justificatifs validés",
    icon: <TrendingUp className="h-4 w-4" />,
    trend: "+5.1%",
    trendDirection: "up"
  },
  {
    title: "Alertes seuil critique",
    value: "3",
    status: "alert",
    description: "Étudiants à risque",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
];

// Données mock pour les absences
const absencesData: Absence[] = [
  {
    id: 1,
    etudiantId: 1001,
    etudiantNom: "Jean-Baptiste Kouame",
    etudiantEmail: "jean.kouame@student.univ.fr",
    programme: "Médecine - 3ème année",
    dateDebut: "2024-01-22",
    dateFin: "2024-01-24",
    duree: 3,
    motif: "Grippe saisonnière avec fièvre",
    typeAbsence: "maladie",
    statut: "en_attente",
    justificatif: {
      type: "Certificat médical",
      fichier: "certificat_medical_kouame.pdf",
      dateUpload: "2024-01-22"
    },
    cours: "Anatomie Générale",
    enseignant: "Dr. Assi Marie"
  },
  {
    id: 2,
    etudiantId: 1002,
    etudiantNom: "Marie-Claire Assi",
    etudiantEmail: "marie.assi@student.univ.fr",
    programme: "Pharmacie - 2ème année",
    dateDebut: "2024-01-20",
    dateFin: "2024-01-20",
    duree: 1,
    motif: "Décès grand-parent",
    typeAbsence: "famille",
    statut: "approuve",
    justificatif: {
      type: "Acte de décès",
      fichier: "acte_deces_assi.pdf",
      dateUpload: "2024-01-20"
    },
    commentaireAdmin: "Justificatif valide, toutes mes condoléances",
    dateTraitement: "2024-01-21",
    cours: "Pharmacologie",
    enseignant: "Prof. Kone David"
  },
  {
    id: 3,
    etudiantId: 1003,
    etudiantNom: "Kofi Mensah",
    etudiantEmail: "kofi.mensah@student.univ.fr",
    programme: "Dentaire - 4ème année",
    dateDebut: "2024-01-19",
    dateFin: "2024-01-21",
    duree: 3,
    motif: "Stage pratique en clinique externe",
    typeAbsence: "stage",
    statut: "approuve",
    justificatif: {
      type: "Convention de stage",
      fichier: "convention_stage_mensah.pdf",
      dateUpload: "2024-01-18"
    },
    commentaireAdmin: "Stage validé par le département",
    dateTraitement: "2024-01-19",
    cours: "Chirurgie Dentaire",
    enseignant: "Dr. Traore Fatou"
  },
  {
    id: 4,
    etudiantId: 1004,
    etudiantNom: "Fatou Traore",
    etudiantEmail: "fatou.traore@student.univ.fr",
    programme: "Kinésithérapie - 1ère année",
    dateDebut: "2024-01-18",
    dateFin: "2024-01-18",
    duree: 1,
    motif: "Problème de transport public",
    typeAbsence: "transport",
    statut: "refuse",
    commentaireAdmin: "Justificatif insuffisant, prévoir des alternatives",
    dateTraitement: "2024-01-19",
    cours: "Anatomie",
    enseignant: "Dr. Kone Paul"
  },
  {
    id: 5,
    etudiantId: 1005,
    etudiantNom: "David Kone",
    etudiantEmail: "david.kone@student.univ.fr",
    programme: "Médecine - 5ème année",
    dateDebut: "2024-01-25",
    dateFin: "2024-01-26",
    duree: 2,
    motif: "Consultation médicale spécialisée",
    typeAbsence: "maladie",
    statut: "en_attente",
    justificatif: {
      type: "Convocation médicale",
      fichier: "convocation_kone.pdf",
      dateUpload: "2024-01-24"
    },
    cours: "Stage Hospitalier",
    enseignant: "Prof. Bernard Claire"
  },
  {
    id: 6,
    etudiantId: 1006,
    etudiantNom: "Aminata Diallo",
    etudiantEmail: "aminata.diallo@student.univ.fr",
    programme: "Infirmerie - 3ème année",
    dateDebut: "2024-01-23",
    dateFin: "2024-01-25",
    duree: 3,
    motif: "Formation continue certifiante",
    typeAbsence: "stage",
    statut: "en_attente",
    justificatif: {
      type: "Attestation de formation",
      fichier: "formation_diallo.pdf",
      dateUpload: "2024-01-22"
    },
    cours: "Soins Infirmiers",
    enseignant: "Mme. Petit Anne"
  }
];

export default function AbsenceManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false);
  const [validationAction, setValidationAction] = useState<"approve" | "reject">("approve");
  const [commentaire, setCommentaire] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "approuve":
        return "bg-green-100 text-green-800";
      case "refuse":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return "En attente";
      case "approuve":
        return "Approuvé";
      case "refuse":
        return "Refusé";
      default:
        return statut;
    }
  };

  const getTypeAbsenceColor = (type: string) => {
    const typeObj = typesAbsences.find(t => t.value === type);
    return typeObj?.color || "bg-gray-100 text-gray-800";
  };

  const getTypeAbsenceLabel = (type: string) => {
    const typeObj = typesAbsences.find(t => t.value === type);
    return typeObj?.label || type;
  };

  const getStatColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-blue-600";
      case "warning":
        return "text-orange-600";
      case "alert":
        return "text-red-600";
      case "excellent":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const handleViewDetails = (absence: Absence) => {
    setSelectedAbsence(absence);
    setIsDetailsDialogOpen(true);
  };

  const handleValidation = (absence: Absence, action: "approve" | "reject") => {
    setSelectedAbsence(absence);
    setValidationAction(action);
    setCommentaire("");
    setIsValidationDialogOpen(true);
  };

  const confirmValidation = () => {
    if (selectedAbsence) {
      // Ici on ferait l'appel API pour valider/refuser
      console.log(`${validationAction} absence ${selectedAbsence.id} avec commentaire: ${commentaire}`);
      setIsValidationDialogOpen(false);
      setSelectedAbsence(null);
      setCommentaire("");
    }
  };

  const generateReport = () => {
    // Ici on génèrerait le rapport d'assiduité
    console.log("Génération du rapport d'assiduité");
  };

  const filteredAbsences = absencesData.filter(absence => {
    const matchesSearch = absence.etudiantNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         absence.programme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         absence.cours.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         absence.motif.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" ||
                      (activeTab === "pending" && absence.statut === "en_attente") ||
                      (activeTab === "approved" && absence.statut === "approuve") ||
                      (activeTab === "rejected" && absence.statut === "refuse");

    const matchesType = filterType === "all" || absence.typeAbsence === filterType;

    return matchesSearch && matchesTab && matchesType;
  });

  // Compter les nouveaux justificatifs (simulé)
  const nouveauxJustificatifs = absencesData.filter(a => a.statut === "en_attente").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestion des Absences
          </h2>
          <p className="text-muted-foreground">
            Tableau de bord centralisé des justificatifs et gestion des absences étudiantes
          </p>
        </div>

        <div className="flex space-x-2">
          {nouveauxJustificatifs > 0 && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
              <Bell className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600 font-medium">
                {nouveauxJustificatifs} nouveau{nouveauxJustificatifs > 1 ? 'x' : ''} justificatif{nouveauxJustificatifs > 1 ? 's' : ''}
              </span>
            </div>
          )}
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Rapport d'assiduité
          </Button>
        </div>
      </div>

      {/* Absence Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {absenceStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={getStatColor(stat.status)}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                {stat.trend && (
                  <div className={`flex items-center text-xs ${
                    stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trendDirection === 'up' ?
                      <TrendingUp className="h-3 w-3 mr-1" /> :
                      <TrendingDown className="h-3 w-3 mr-1" />
                    }
                    {stat.trend}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Absences Table with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Absences et Justificatifs</CardTitle>
              <CardDescription>
                Gestion centralisée des demandes de justification d'absence
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {typesAbsences.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Toutes ({absencesData.length})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({absencesData.filter(a => a.statut === "en_attente").length})</TabsTrigger>
              <TabsTrigger value="approved">Approuvées ({absencesData.filter(a => a.statut === "approuve").length})</TabsTrigger>
              <TabsTrigger value="rejected">Refusées ({absencesData.filter(a => a.statut === "refuse").length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Cours</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Justificatif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{absence.etudiantNom}</div>
                          <div className="text-sm text-muted-foreground">
                            {absence.programme}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{absence.cours}</div>
                          <div className="text-sm text-muted-foreground">
                            {absence.enseignant}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {new Date(absence.dateDebut).toLocaleDateString('fr-FR')}
                            {absence.dateDebut !== absence.dateFin &&
                              ` - ${new Date(absence.dateFin).toLocaleDateString('fr-FR')}`
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {absence.duree} jour{absence.duree > 1 ? 's' : ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getTypeAbsenceColor(absence.typeAbsence)}
                        >
                          {getTypeAbsenceLabel(absence.typeAbsence)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {absence.justificatif ? (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{absence.justificatif.type}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatutColor(absence.statut)}
                        >
                          {getStatutLabel(absence.statut)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(absence)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            {absence.justificatif && (
                              <DropdownMenuItem>
                                <FileDown className="mr-2 h-4 w-4" />
                                Télécharger justificatif
                              </DropdownMenuItem>
                            )}
                            {absence.statut === "en_attente" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleValidation(absence, "approve")}
                                  className="text-green-600"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Approuver
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleValidation(absence, "reject")}
                                  className="text-red-600"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Refuser
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Contacter étudiant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Absence Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'Absence</DialogTitle>
            <DialogDescription>
              Informations complètes sur la demande de justification
            </DialogDescription>
          </DialogHeader>
          {selectedAbsence && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Étudiant</Label>
                  <div>
                    <p className="text-sm font-medium">{selectedAbsence.etudiantNom}</p>
                    <p className="text-xs text-muted-foreground">{selectedAbsence.etudiantEmail}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Programme</Label>
                  <p className="text-sm">{selectedAbsence.programme}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cours</Label>
                  <div>
                    <p className="text-sm font-medium">{selectedAbsence.cours}</p>
                    <p className="text-xs text-muted-foreground">{selectedAbsence.enseignant}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type d'absence</Label>
                  <Badge className={getTypeAbsenceColor(selectedAbsence.typeAbsence)}>
                    {getTypeAbsenceLabel(selectedAbsence.typeAbsence)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Date début</p>
                  <p className="text-sm font-bold">{new Date(selectedAbsence.dateDebut).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Date fin</p>
                  <p className="text-sm font-bold">{new Date(selectedAbsence.dateFin).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="text-sm font-bold">{selectedAbsence.duree} jour{selectedAbsence.duree > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Motif</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedAbsence.motif}</p>
              </div>

              {selectedAbsence.justificatif && (
                <div>
                  <Label className="text-sm font-medium">Justificatif</Label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">{selectedAbsence.justificatif.type}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploadé le {new Date(selectedAbsence.justificatif.dateUpload).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Statut</Label>
                  <Badge className={getStatutColor(selectedAbsence.statut)}>
                    {getStatutLabel(selectedAbsence.statut)}
                  </Badge>
                </div>
                {selectedAbsence.dateTraitement && (
                  <div>
                    <Label className="text-sm font-medium">Date de traitement</Label>
                    <p className="text-sm">{new Date(selectedAbsence.dateTraitement).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>

              {selectedAbsence.commentaireAdmin && (
                <div>
                  <Label className="text-sm font-medium">Commentaire administratif</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedAbsence.commentaireAdmin}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Fermer
            </Button>
            {selectedAbsence?.statut === "en_attente" && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleValidation(selectedAbsence, "reject")}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Refuser
                </Button>
                <Button
                  onClick={() => handleValidation(selectedAbsence, "approve")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validation Dialog */}
      <AlertDialog open={isValidationDialogOpen} onOpenChange={setIsValidationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {validationAction === "approve" ? "Approuver" : "Refuser"} la demande
            </AlertDialogTitle>
            <AlertDialogDescription>
              {validationAction === "approve"
                ? "Vous êtes sur le point d'approuver cette demande de justification d'absence."
                : "Vous êtes sur le point de refuser cette demande de justification d'absence."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="commentaire">Commentaire {validationAction === "reject" ? "(obligatoire)" : "(optionnel)"}</Label>
              <Textarea
                id="commentaire"
                placeholder={validationAction === "approve"
                  ? "Commentaire optionnel..."
                  : "Motif du refus..."
                }
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmValidation}
              className={validationAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              disabled={validationAction === "reject" && !commentaire.trim()}
            >
              {validationAction === "approve" ? "Approuver" : "Refuser"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}