"use client";

import React from "react";
import GenericModal from "../GenericModal";
import { ACTION } from "@/constant";

interface ModaleProps {
  isOpen: boolean;
  onClose: () => void;
  handleAction: () => void;
  action: ACTION
}

const ModaleDesactivateDeleteUser: React.FC<ModaleProps> = ({
  isOpen,
  onClose,
  handleAction,
  action
}) => {
  return (
    <GenericModal
      open={isOpen}
      onOpenChange={onClose}
      title="Confirmer l'action"
      onCancel={onClose}
      confirmText={action === 'DELETE' ? 'Supprimer' : action === 'DESACTIVATE' ? 'Désactiver' : action === 'ACTIVATE' ? 'Activer' : 'Action Inconnue'}
      onConfirm={handleAction}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          {
            (action == "ACTIVATE" || action =="DESACTIVATE" || action =="DELETE") ?
            <>
              Êtes-vous sûr de vouloir <strong>{action === 'DELETE' ? 'supprimer' : 'désactiver'}</strong> cet utilisateur ?
              {action == 'DELETE' && 'Cette action est irréversible.'}
            </>
            :
            <>
              Désolé, action inconne.
            </>
          }
        </p>
      </div>
    </GenericModal>
  );
};

export default ModaleDesactivateDeleteUser;
