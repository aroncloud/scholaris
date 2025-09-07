'use client';

import React from 'react';
import GenericModal from '../GenericModal';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DeleteGradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  studentName: string;
  courseName: string;
  evaluation: string;
  grade: number;
  maxGrade: number;
  date: string;
}

const DeleteGradeModal: React.FC<DeleteGradeModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  studentName,
  courseName,
  evaluation,
  grade,
  maxGrade,
  date
}) => {
  const evaluationLabels: Record<string, string> = {
    'TP': 'Travaux Pratiques',
    'CC': 'Contrôle Continu',
    'SN': 'Session Normale'
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onConfirm();
    onOpenChange(false);
  };

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title="Supprimer la note"
      description="Êtes-vous sûr de vouloir supprimer cette note ?"
      titleClassName="bg-red-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-lg"
      onConfirm={handleConfirm}
      confirmText={
        <span className="flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          Oui, supprimer
        </span>
      }
      confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white"
      cancelText="Annuler"
      size="max-w-md"
    >
      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Cette action est irréversible. La note sera définitivement supprimée.
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-2">
          <p className="font-medium">Détails de la note :</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Étudiant :</span>
            <span className="font-medium">{studentName}</span>
            
            <span className="text-muted-foreground">Matière :</span>
            <span className="font-medium">{courseName}</span>
            
            <span className="text-muted-foreground">Type :</span>
            <span className="font-medium">{evaluationLabels[evaluation] || evaluation}</span>
            
            <span className="text-muted-foreground">Note :</span>
            <span className="font-medium">{grade} / {maxGrade}</span>
            
            <span className="text-muted-foreground">Date :</span>
            <span className="font-medium">{date}</span>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default DeleteGradeModal;
