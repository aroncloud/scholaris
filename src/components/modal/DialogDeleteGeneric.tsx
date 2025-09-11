"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogDeleteGenericProps {
  title?: string;
  detail?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => Promise<void>;
}

const DialogDeleteGeneric: React.FC<DialogDeleteGenericProps> = ({
  title = "Supprimer cet élément",
  detail = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
  isOpen,
  onOpenChange,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      onOpenChange(false);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (isDeleting) return;
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{detail}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>
            Annuler
          </Button>
          <Button onClick={handleDelete} disabled={isDeleting} variant="destructive">
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteGeneric;
