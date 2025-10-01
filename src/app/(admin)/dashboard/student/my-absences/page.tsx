'use client'

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Progress
} from "@/components/ui/progress";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Upload,
  RefreshCw,
  Search,
  MoreHorizontal,
  Eye,
  Plus,
  FileText,
  FileUp,
  Link2,
  AlertCircle,
} from "lucide-react";

// Interfaces TypeScript
interface Absence {
  id: number;
  dateAbsence: string;
  heureDebut: string;
  heureFin: string;
  dureeHeures: number;
  ue: string;
  cours: string;
  enseignant: string;
  type: "cours" | "tp" | "td" | "examen";
  statut: "non_justifiee" | "justifiee" | "en_attente";
  justificatifId?: number;
  motif?: string;
}

interface Justificatif {
  id: number;
  type: string;
  description: string;
  fichier: string;
  dateUpload: string;
  statut: "en_attente" | "approuve" | "refuse";
  commentaireAdmin?: string;
  absencesLiees: number[];
}

interface UEStats {
  ue: string;
  totalHeures: number;
  heuresJustifiees: number;
  heuresNonJustifiees: number;
  seuilCritique: number;
  pourcentageAbsence: number;
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

// Données mock pour les statistiques
const absenceStats: AbsenceStats[] = [
  {
    title: "Total heures d'absence",
    value: "24h",
    status: "warning",
    description: "Ce semestre",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Heures justifiées",
    value: "18h",
    status: "excellent",
    description: "75% du total",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    title: "En attente de validation",
    value: "4h",
    status: "normal",
    description: "2 justificatifs",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    title: "Taux d'assiduité",
    value: "92%",
    status: "excellent",
    description: "Objectif: 85%",
    icon: <TrendingUp className="h-4 w-4" />,
  },
];

// Données mock pour les UE
const ueStats: UEStats[] = [
  {
    ue: "Anatomie Générale",
    totalHeures: 60,
    heuresJustifiees: 6,
    heuresNonJustifiees: 2,
    seuilCritique: 12,
    pourcentageAbsence: 13.3
  },
  {
    ue: "Physiologie",
    totalHeures: 45,
    heuresJustifiees: 4,
    heuresNonJustifiees: 0,
    seuilCritique: 9,
    pourcentageAbsence: 8.9
  },
  {
    ue: "Pharmacologie",
    totalHeures: 50,
    heuresJustifiees: 5,
    heuresNonJustifiees: 3,
    seuilCritique: 10,
    pourcentageAbsence: 16.0
  },
  {
    ue: "Pathologie",
    totalHeures: 40,
    heuresJustifiees: 3,
    heuresNonJustifiees: 1,
    seuilCritique: 8,
    pourcentageAbsence: 10.0
  }
];

// Données mock pour les absences
const absencesData: Absence[] = [
  {
    id: 1,
    dateAbsence: "2024-01-22",
    heureDebut: "08:00",
    heureFin: "10:00",
    dureeHeures: 2,
    ue: "Anatomie Générale",
    cours: "Anatomie du système nerveux",
    enseignant: "Dr. Assi Marie",
    type: "cours",
    statut: "justifiee",
    justificatifId: 1,
    motif: "Consultation médicale"
  },
  {
    id: 2,
    dateAbsence: "2024-01-21",
    heureDebut: "14:00",
    heureFin: "16:00",
    dureeHeures: 2,
    ue: "Physiologie",
    cours: "TP Physiologie cardiaque",
    enseignant: "Prof. Kone David",
    type: "tp",
    statut: "en_attente",
    justificatifId: 2,
    motif: "Problème familial"
  },
  {
    id: 3,
    dateAbsence: "2024-01-20",
    heureDebut: "10:00",
    heureFin: "12:00",
    dureeHeures: 2,
    ue: "Pharmacologie",
    cours: "Pharmacocinétique",
    enseignant: "Dr. Traore Fatou",
    type: "cours",
    statut: "non_justifiee"
  },
  {
    id: 4,
    dateAbsence: "2024-01-19",
    heureDebut: "08:00",
    heureFin: "12:00",
    dureeHeures: 4,
    ue: "Anatomie Générale",
    cours: "TD Anatomie digestive",
    enseignant: "Dr. Assi Marie",
    type: "td",
    statut: "justifiee",
    justificatifId: 1,
    motif: "Consultation médicale"
  },
  {
    id: 5,
    dateAbsence: "2024-01-18",
    heureDebut: "14:00",
    heureFin: "17:00",
    dureeHeures: 3,
    ue: "Pathologie",
    cours: "Pathologie infectieuse",
    enseignant: "Prof. Bernard Claire",
    type: "cours",
    statut: "non_justifiee"
  }
];

// Données mock pour les justificatifs
const justificatifsData: Justificatif[] = [
  {
    id: 1,
    type: "Certificat médical",
    description: "Consultation pour grippe saisonnière",
    fichier: "certificat_medical_janvier.pdf",
    dateUpload: "2024-01-22",
    statut: "approuve",
    commentaireAdmin: "Justificatif valide",
    absencesLiees: [1, 4]
  },
  {
    id: 2,
    type: "Justificatif familial",
    description: "Décès dans la famille proche",
    fichier: "acte_deces_famille.pdf",
    dateUpload: "2024-01-21",
    statut: "en_attente",
    absencesLiees: [2]
  }
];

export default function MyAbsencesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSubmitJustificatifOpen, setIsSubmitJustificatifOpen] = useState(false);
  const [selectedAbsences, setSelectedAbsences] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "justifiee":
        return "bg-green-100 text-green-800";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "non_justifiee":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "justifiee":
        return "Justifiée";
      case "en_attente":
        return "En attente";
      case "non_justifiee":
        return "Non justifiée";
      default:
        return statut;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cours":
        return "bg-blue-100 text-blue-800";
      case "tp":
        return "bg-green-100 text-green-800";
      case "td":
        return "bg-orange-100 text-orange-800";
      case "examen":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const handleSubmitJustificatif = () => {
    setIsSubmitJustificatifOpen(true);
  };

  const handleAbsenceSelection = (absenceId: number, checked: boolean) => {
    if (checked) {
      setSelectedAbsences([...selectedAbsences, absenceId]);
    } else {
      setSelectedAbsences(selectedAbsences.filter(id => id !== absenceId));
    }
  };

  const filteredAbsences = absencesData.filter(absence => {
    const matchesSearch = absence.ue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         absence.cours.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         absence.enseignant.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Mes Absences
          </h2>
          <p className="text-muted-foreground">
            Tableau de bord d&apos;assiduité et gestion de vos justificatifs
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleSubmitJustificatif}>
            <Plus className="h-4 w-4 mr-2" />
            Soumettre un justificatif
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="absences">Historique des absences</TabsTrigger>
          <TabsTrigger value="justificatifs">Mes justificatifs</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
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
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* UE Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Décompte d&apos;absences par UE</CardTitle>
              <CardDescription>
                Suivi détaillé de vos heures d&apos;absence par unité d&apos;enseignement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ueStats.map((ue, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{ue.ue}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ue.heuresJustifiees + ue.heuresNonJustifiees}h / {ue.totalHeures}h ({ue.pourcentageAbsence.toFixed(1)}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="text-green-600">{ue.heuresJustifiees}h justifiées</span>
                          {ue.heuresNonJustifiees > 0 && (
                            <span className="text-red-600 ml-2">{ue.heuresNonJustifiees}h non justifiées</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Seuil critique: {ue.seuilCritique}h
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progression vers le seuil critique</span>
                        <span>{((ue.heuresJustifiees + ue.heuresNonJustifiees) / ue.seuilCritique * 100).toFixed(0)}%</span>
                      </div>
                      <Progress
                        value={(ue.heuresJustifiees + ue.heuresNonJustifiees) / ue.seuilCritique * 100}
                        className="h-2"
                      />
                      {((ue.heuresJustifiees + ue.heuresNonJustifiees) / ue.seuilCritique * 100) >= 80 && (
                        <div className="flex items-center text-red-600 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Proche du seuil critique
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Absences Tab */}
        <TabsContent value="absences" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historique des Absences</CardTitle>
                  <CardDescription>
                    Liste complète de vos absences par chronologie
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>UE / Cours</TableHead>
                    <TableHead>Horaires</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(absence.dateAbsence).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{absence.ue}</div>
                          <div className="text-sm text-muted-foreground">
                            {absence.cours}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {absence.enseignant}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {absence.heureDebut} - {absence.heureFin}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getTypeColor(absence.type)}
                        >
                          {absence.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {absence.dureeHeures}h
                        </div>
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
                            {absence.statut === "non_justifiee" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSubmitJustificatif}>
                                  <FileUp className="mr-2 h-4 w-4" />
                                  Soumettre justificatif
                                </DropdownMenuItem>
                              </>
                            )}
                            {absence.justificatifId && (
                              <DropdownMenuItem>
                                <Link2 className="mr-2 h-4 w-4" />
                                Voir justificatif lié
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Justificatifs Tab */}
        <TabsContent value="justificatifs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes Justificatifs</CardTitle>
                  <CardDescription>
                    Liste de tous vos justificatifs soumis et leur statut
                  </CardDescription>
                </div>
                <Button onClick={handleSubmitJustificatif}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau justificatif
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {justificatifsData.map((justificatif) => (
                  <div key={justificatif.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{justificatif.type}</span>
                          <Badge
                            variant="secondary"
                            className={getStatutColor(
                              justificatif.statut === "approuve" ? "justifiee" :
                              justificatif.statut === "refuse" ? "non_justifiee" : "en_attente"
                            )}
                          >
                            {justificatif.statut === "approuve" ? "Approuvé" :
                             justificatif.statut === "refuse" ? "Refusé" : "En attente"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {justificatif.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Soumis le {new Date(justificatif.dateUpload).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Absences liées: </span>
                          <span className="font-medium">{justificatif.absencesLiees.length}</span>
                        </div>
                        {justificatif.commentaireAdmin && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <span className="font-medium">Commentaire: </span>
                            {justificatif.commentaireAdmin}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        {justificatif.statut === "en_attente" && (
                          <Button variant="outline" size="sm">
                            <Link2 className="h-4 w-4 mr-1" />
                            Lier
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Absence Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l&apos;Absence</DialogTitle>
            <DialogDescription>
              Informations complètes sur cette absence
            </DialogDescription>
          </DialogHeader>
          {selectedAbsence && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">{new Date(selectedAbsence.dateAbsence).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Horaires</Label>
                  <p className="text-sm">{selectedAbsence.heureDebut} - {selectedAbsence.heureFin}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">UE</Label>
                  <p className="text-sm">{selectedAbsence.ue}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Badge className={getTypeColor(selectedAbsence.type)}>
                    {selectedAbsence.type.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Cours</Label>
                <p className="text-sm">{selectedAbsence.cours}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Enseignant</Label>
                <p className="text-sm">{selectedAbsence.enseignant}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Durée</Label>
                  <p className="text-sm">{selectedAbsence.dureeHeures} heures</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Statut</Label>
                  <Badge className={getStatutColor(selectedAbsence.statut)}>
                    {getStatutLabel(selectedAbsence.statut)}
                  </Badge>
                </div>
              </div>

              {selectedAbsence.motif && (
                <div>
                  <Label className="text-sm font-medium">Motif</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedAbsence.motif}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Fermer
            </Button>
            {selectedAbsence?.statut === "non_justifiee" && (
              <Button onClick={handleSubmitJustificatif}>
                <FileUp className="h-4 w-4 mr-2" />
                Soumettre justificatif
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Justificatif Dialog */}
      <Dialog open={isSubmitJustificatifOpen} onOpenChange={setIsSubmitJustificatifOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Soumettre un Justificatif</DialogTitle>
            <DialogDescription>
              Uploadez votre justificatif et liez-le à vos absences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type de justificatif</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Certificat médical</SelectItem>
                  <SelectItem value="famille">Justificatif familial</SelectItem>
                  <SelectItem value="transport">Problème de transport</SelectItem>
                  <SelectItem value="stage">Convention de stage</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fichier">Fichier justificatif</Label>
              <div className="mt-1 flex items-center space-x-2">
                <Input id="fichier" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Parcourir
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Formats acceptés: PDF, JPG, PNG (max 5MB)
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez brièvement le motif de vos absences..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Lier aux absences non justifiées</Label>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded p-3">
                {absencesData
                  .filter(a => a.statut === "non_justifiee")
                  .map((absence) => (
                    <div key={absence.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`absence-${absence.id}`}
                        checked={selectedAbsences.includes(absence.id)}
                        onCheckedChange={(checked) =>
                          handleAbsenceSelection(absence.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`absence-${absence.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        <span className="font-medium">{absence.ue}</span> -
                        {new Date(absence.dateAbsence).toLocaleDateString('fr-FR')}
                        ({absence.dureeHeures}h)
                      </label>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Sélectionnez les absences que ce justificatif couvre
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitJustificatifOpen(false)}>
              Annuler
            </Button>
            <Button disabled={selectedAbsences.length === 0}>
              <FileUp className="h-4 w-4 mr-2" />
              Soumettre justificatif
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}