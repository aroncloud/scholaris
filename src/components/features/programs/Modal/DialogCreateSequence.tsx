"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICreateSemester } from "@/types/programTypes";
import { Textarea } from "@/components/ui/textarea";

export interface DialogSequenceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateSemester) => Promise<void>;
  curriculumCode: string;
  curriculumName: string;
}

export function DialogCreateSequence({
  open,
  onOpenChange,
  onSave,
  curriculumCode,
  curriculumName,
}: DialogSequenceProps) {
  const [formData, setFormData] = useState<Partial<ICreateSemester>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.sequence_code) newErrors.sequence_code = "Code séquence requis";
    if (!formData.sequence_name) newErrors.sequence_name = "Nom séquence requis";
    if (!formData.sequence_number) newErrors.sequence_number = "Numéro séquence requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {console.log('errors', errors); return;}
    setIsSubmitting(true);
    try {
      await onSave({... formData, curriculum_code: curriculumCode} as ICreateSemester);
      setFormData({});
      setErrors({});
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    setFormData({});
    setErrors({});
    onOpenChange(false);
  };

  const handleFieldChange = <K extends keyof ICreateSemester>(
    field: K,
    value: ICreateSemester[K]
  ) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as string]) {
      const newErrors = { ...errors };
      delete newErrors[field as string];
      setErrors(newErrors);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle séquence</DialogTitle>
          <DialogDescription>
            Remplissez les informations de la séquence
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Curriculum */}
          <div className="space-y-1">
            <Label htmlFor="curriculum_code">Code curriculum <span className="text-red-600">*</span></Label>
            <Input
              id={curriculumCode}
              value={curriculumName}
              disabled={true}
            />
          </div>

          {/* Code séquence */}
          <div className="space-y-1">
            <Label htmlFor="sequence_code">Code séquence <span className="text-red-600">*</span></Label>
            <Input
              id="sequence_code"
              value={formData.sequence_code || ""}
              onChange={(e) => handleFieldChange("sequence_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.sequence_code ? "border-red-500" : ""}
            />
            {errors.sequence_code && <p className="text-red-600 text-sm">{errors.sequence_code}</p>}
          </div>

          {/* Nom séquence */}
          <div className="space-y-1">
            <Label htmlFor="sequence_name">Nom séquence <span className="text-red-600">*</span></Label>
            <Input
              id="sequence_name"
              value={formData.sequence_name || ""}
              onChange={(e) => handleFieldChange("sequence_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.sequence_name ? "border-red-500" : ""}
            />
            {errors.sequence_name && <p className="text-red-600 text-sm">{errors.sequence_name}</p>}
          </div>

          {/* Numéro séquence */}
          <div className="space-y-1">
            <Label htmlFor="sequence_number">Numéro séquence <span className="text-red-600">*</span></Label>
            <Input
              id="sequence_number"
              value={formData.sequence_number || ""}
              onChange={(e) => handleFieldChange("sequence_number", e.target.value)}
              disabled={isSubmitting}
              className={errors.sequence_number ? "border-red-500" : ""}
            />
            {errors.sequence_number && <p className="text-red-600 text-sm">{errors.sequence_number}</p>}
          </div>

          {/* Description (optionnel) */}
          <div className="space-y-1 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer la séquence"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
