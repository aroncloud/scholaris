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
import { ICreateModule, ICreateUE } from "@/types/programTypes";

interface DialogCreateUEProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateUE) => Promise<boolean>;
  module: ICreateModule;
}

export function DialogCreateUE({
  open,
  onOpenChange,
  onSave,
  module,
}: DialogCreateUEProps) {
  const [formData, setFormData] = useState<Partial<ICreateUE>>({ module_code: module.module_code });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation des champs
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.course_unit_code) newErrors.course_unit_code = "Code UE requis";
    if (!formData.course_unit_name) newErrors.course_unit_name = "Nom UE requis";
    if (!formData.internal_code) newErrors.internal_code = "Code interne requis";
    if (formData.lecture_hours === undefined || formData.lecture_hours < 0) newErrors.lecture_hours = "Heures cours requises";
    if (formData.lab_tutorial_hours === undefined || formData.lab_tutorial_hours < 0) newErrors.lab_tutorial_hours = "Heures TP/TD requises";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarde
  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await onSave(formData as ICreateUE);
      if(!result) return;

      setFormData({ });
      setErrors({});
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    if (isSubmitting) return;
    setFormData({ });
    setErrors({});
    onOpenChange(false);
  };

  // Modification des champs
  const handleFieldChange = <K extends keyof ICreateUE>(
    field: K,
    value: ICreateUE[K]
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
          <DialogTitle>Créer une nouvelle UE</DialogTitle>
          <DialogDescription>
            Remplissez les informations de l&apos;unité d&apos;enseignement
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Module associé */}
          <div className="space-y-1">
            <Label htmlFor="module_code">Module</Label>
            <Input
              id="module_code"
              value={module.module_code}
              disabled={true}
            />
          </div>

          {/* Code UE */}
          <div className="space-y-1">
            <Label htmlFor="course_unit_code">Code UE <span className="text-red-600">*</span></Label>
            <Input
              id="course_unit_code"
              value={formData.course_unit_code || ""}
              onChange={(e) => handleFieldChange("course_unit_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.course_unit_code ? "border-red-500" : ""}
            />
            {errors.course_unit_code && <p className="text-red-600 text-sm">{errors.course_unit_code}</p>}
          </div>

          {/* Nom UE */}
          <div className="space-y-1">
            <Label htmlFor="course_unit_name">Nom UE <span className="text-red-600">*</span></Label>
            <Input
              id="course_unit_name"
              value={formData.course_unit_name || ""}
              onChange={(e) => handleFieldChange("course_unit_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.course_unit_name ? "border-red-500" : ""}
            />
            {errors.course_unit_name && <p className="text-red-600 text-sm">{errors.course_unit_name}</p>}
          </div>

          {/* Code interne */}
          <div className="space-y-1">
            <Label htmlFor="internal_code">Code interne <span className="text-red-600">*</span></Label>
            <Input
              id="internal_code"
              value={formData.internal_code || ""}
              onChange={(e) => handleFieldChange("internal_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.internal_code ? "border-red-500" : ""}
            />
            {errors.internal_code && <p className="text-red-600 text-sm">{errors.internal_code}</p>}
          </div>

          {/* Heures cours */}
          <div className="space-y-1">
            <Label htmlFor="lecture_hours">Heures cours <span className="text-red-600">*</span></Label>
            <Input
              id="lecture_hours"
              type="number"
              value={formData.lecture_hours || ""}
              onChange={(e) => handleFieldChange("lecture_hours", Number(e.target.value))}
              disabled={isSubmitting}
              className={errors.lecture_hours ? "border-red-500" : ""}
            />
            {errors.lecture_hours && <p className="text-red-600 text-sm">{errors.lecture_hours}</p>}
          </div>

          {/* Heures TP/TD */}
          <div className="space-y-1">
            <Label htmlFor="lab_tutorial_hours">Heures TP/TD <span className="text-red-600">*</span></Label>
            <Input
              id="lab_tutorial_hours"
              type="number"
              value={formData.lab_tutorial_hours || ""}
              onChange={(e) => handleFieldChange("lab_tutorial_hours", Number(e.target.value))}
              disabled={isSubmitting}
              className={errors.lab_tutorial_hours ? "border-red-500" : ""}
            />
            {errors.lab_tutorial_hours && <p className="text-red-600 text-sm">{errors.lab_tutorial_hours}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer l'UE"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
