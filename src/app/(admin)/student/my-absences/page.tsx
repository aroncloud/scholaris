'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Upload,
  RefreshCw,
  Plus,
  FileUp,
} from "lucide-react";
import MyAbsencesListTab from "@/components/features/student-my-absences/MyAbsencesListTab";
import { Absence } from "@/components/features/student-my-absences/MyAbsencesListTab";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Info absences */}
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Mes Absences
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                 Tableau de bord d&apos;assiduité et gestion de vos justificatifs
                </p>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center space-x-3">
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
        </div>
      </div>

    <MyAbsencesListTab
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filteredAbsences={filteredAbsences}
      getTypeColor={getTypeColor}
      getStatutColor={getStatutColor}
      getStatutLabel={getStatutLabel}
      handleViewDetails={handleViewDetails}
      handleSubmitJustificatif={handleSubmitJustificatif}
    />
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