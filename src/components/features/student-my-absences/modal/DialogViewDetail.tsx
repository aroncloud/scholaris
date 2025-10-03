'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface Absence {
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
  motif?: string;
  justificatifId?: number;
}

interface DialogViewDetailProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  absence: Absence | null;
  getTypeColor: (type: string) => string;
  getStatutColor: (statut: string) => string;
  getStatutLabel: (statut: string) => string;
}

export function DialogViewDetail({
  isOpen,
  onOpenChange,
  absence,
  getTypeColor,
  getStatutColor,
  getStatutLabel,
}: DialogViewDetailProps) {
  if (!absence) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de l'absence</DialogTitle>
          <DialogDescription>
            Informations détaillées sur cette absence
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="mt-1">{new Date(absence.dateAbsence).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Horaires</p>
              <p className="mt-1">{absence.heureDebut} - {absence.heureFin}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">UE</p>
              <p className="mt-1">{absence.ue}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <div className="mt-1">
                <Badge className={getTypeColor(absence.type)}>
                  {absence.type.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cours</p>
            <p className="mt-1">{absence.cours}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Enseignant</p>
            <p className="mt-1">{absence.enseignant}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Durée</p>
              <p className="mt-1">{absence.dureeHeures} heure{absence.dureeHeures > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <div className="mt-1">
                <Badge className={getStatutColor(absence.statut)}>
                  {getStatutLabel(absence.statut)}
                </Badge>
              </div>
            </div>
          </div>
          {absence.motif && (
            <div>
              <p className="text-sm font-medium text-gray-500">Motif</p>
              <p className="mt-1 p-3 bg-gray-50 rounded-lg">{absence.motif}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}