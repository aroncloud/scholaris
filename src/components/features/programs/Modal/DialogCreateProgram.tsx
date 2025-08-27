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
import { ICreateProgram } from "@/types/programTypes";

interface DialogCreateProgramProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (program: ICreateProgram) => Promise<void>;
}
export function DialogCreateProgram({
  open,
  onOpenChange,
  onSave,
}: DialogCreateProgramProps) {
  const [formData, setFormData] = useState<Partial<ICreateProgram>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation par champ
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.program_code) newErrors.program_code = "Code du programme requis";
    if (!formData.program_name) newErrors.program_name = "Nom du programme requis";
    if (!formData.internal_code) newErrors.internal_code = "Code interne requis";
    if (!formData.degree_name) newErrors.degree_name = "Nom du diplôme requis";
    if (!formData.degree_code) newErrors.degree_code = "Code du diplôme requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave(formData as ICreateProgram);
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

  const handleFieldChange = <K extends keyof ICreateProgram>(
    field: K,
    value: ICreateProgram[K]
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
          <DialogTitle>Créer un nouveau programme</DialogTitle>
          <DialogDescription>
            Remplissez les informations du programme
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Code programme */}
          <div className="space-y-1">
            <Label htmlFor="program_code">Code programme <span className="text-red-600">*</span></Label>
            <Input
              id="program_code"
              value={formData.program_code || ""}
              onChange={(e) => handleFieldChange("program_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.program_code ? "border-red-500" : ""}
            />
            {errors.program_code && <p className="text-red-600 text-sm">{errors.program_code}</p>}
          </div>

          {/* Nom programme */}
          <div className="space-y-1">
            <Label htmlFor="program_name">Nom programme <span className="text-red-600">*</span></Label>
            <Input
              id="program_name"
              value={formData.program_name || ""}
              onChange={(e) => handleFieldChange("program_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.program_name ? "border-red-500" : ""}
            />
            {errors.program_name && <p className="text-red-600 text-sm">{errors.program_name}</p>}
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

          {/* Nom diplôme */}
          <div className="space-y-1">
            <Label htmlFor="degree_name">Nom diplôme <span className="text-red-600">*</span></Label>
            <Input
              id="degree_name"
              value={formData.degree_name || ""}
              onChange={(e) => handleFieldChange("degree_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.degree_name ? "border-red-500" : ""}
            />
            {errors.degree_name && <p className="text-red-600 text-sm">{errors.degree_name}</p>}
          </div>

          {/* Code diplôme */}
          <div className="space-y-1">
            <Label htmlFor="degree_code">Code diplôme <span className="text-red-600">*</span></Label>
            <Input
              id="degree_code"
              value={formData.degree_code || ""}
              onChange={(e) => handleFieldChange("degree_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.degree_code ? "border-red-500" : ""}
            />
            {errors.degree_code && <p className="text-red-600 text-sm">{errors.degree_code}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input
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
            {isSubmitting ? "Création..." : "Créer le programme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
