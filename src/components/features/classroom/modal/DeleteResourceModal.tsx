"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GenericModal from "../../../modal/GenericModal";
import { ICreateResource } from "@/types/classroomType";

interface DeleteResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: ICreateResource;
  deleteResource: (resource: ICreateResource) => void | Promise<void>;
}

export default function DeleteResourceModal({
  isOpen,
  onClose,
  resource,
  deleteResource,
}: DeleteResourceModalProps) {

  const handleConfirm = async () => {
    await deleteResource(resource);
    onClose();
  };

  return (
    <GenericModal
      open={isOpen}
      onOpenChange={onClose}
      title="Supprimer la ressource"
      description={`Êtes-vous sûr de vouloir supprimer la ressource "${resource.name}" ? Cette action est irréversible.`}
      confirmText="Supprimer"
      cancelText="Annuler"
      onCancel={onClose}
      onConfirm={handleConfirm}
      confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white"
    >
      <Card>
        <CardContent>
          <p className="text-sm text-gray-600">
            Cette ressource sera définitivement supprimée de votre liste.
          </p>
        </CardContent>
      </Card>
    </GenericModal>
  );
}
