'use client'
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GenericModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText?: React.ReactNode; // <-- allow JSX
  cancelText?: string;
  size?: string; // ex: "max-w-2xl"
}


const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onOpenChange,
  title,
  children,
  onCancel,
  onConfirm,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  size = "max-w-2xl",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={size}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader >
        <div className="w-full mb-5 h-px bg-gray-200" />
        <div>{children}</div>


        <div className="mt-5 w-full h-px bg-gray-200" />
        <DialogFooter>
          <Button variant="outline" onClick={onCancel || (() => onOpenChange(false))}>
            {cancelText}
          </Button>
          {onConfirm && <Button onClick={onConfirm}>{confirmText}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenericModal;
