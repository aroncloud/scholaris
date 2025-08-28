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
import { ICreateCurriculum } from "@/types/programTypes";
import { useFactorizedProgramStore } from "@/store/programStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface DialogCurriculumProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateCurriculum) => Promise<void>;
}

export function DialogCreateCurriculum({
  open,
  onOpenChange,
  onSave,
}: DialogCurriculumProps) {
  const [formData, setFormData] = useState<Partial<ICreateCurriculum>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { factorizedPrograms } = useFactorizedProgramStore();

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.curriculum_code) newErrors.curriculum_code = "Code curriculum requis";
    if (!formData.program_code) newErrors.program_code = "Code programme requis";
    if (!formData.study_level) newErrors.study_level = "Niveau d'étude requis";
    if (!formData.curriculum_name) newErrors.curriculum_name = "Nom curriculum requis";
    if (!formData.status_code) newErrors.status_code = "Code statut requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave(formData as ICreateCurriculum);
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

  const handleFieldChange = <K extends keyof ICreateCurriculum>(
    field: K,
    value: ICreateCurriculum[K]
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
          <DialogTitle>Créer un nouveau curriculum</DialogTitle>
          <DialogDescription>
            Remplissez les informations du curriculum
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Code curriculum */}
          <div className="space-y-1">
            <Label htmlFor="curriculum_code">Code curriculum <span className="text-red-600">*</span></Label>
            <Input
              id="curriculum_code"
              value={formData.curriculum_code || ""}
              onChange={(e) => handleFieldChange("curriculum_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.curriculum_code ? "border-red-500" : ""}
            />
            {errors.curriculum_code && <p className="text-red-600 text-sm">{errors.curriculum_code}</p>}
          </div>

          {/* Code programme */}
          <div className="space-y-1">
            <Label htmlFor="program_code">Code programme <span className="text-red-600">*</span></Label>
            <Select
              value={formData.program_code || ""}
              onValueChange={(value) => handleFieldChange("program_code", value)}
            >
              <SelectTrigger className={`w-full ${errors.program_code ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Choisissez votre formation" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {factorizedPrograms.map(item => (
                  <SelectItem
                    key={item.program.program_code}
                    value={item.program.program_code}
                  >
                    {item.program.program_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.program_code && <p className="text-red-600 text-sm">{errors.program_code}</p>}
          </div>

          {/* Niveau d'étude */}
          <div className="space-y-1">
            <Label htmlFor="study_level">Niveau d&apos;étude <span className="text-red-600">*</span></Label>
            <Input
              id="study_level"
              value={formData.study_level || ""}
              onChange={(e) => handleFieldChange("study_level", e.target.value)}
              disabled={isSubmitting}
              className={errors.study_level ? "border-red-500" : ""}
            />
            {errors.study_level && <p className="text-red-600 text-sm">{errors.study_level}</p>}
          </div>

          {/* Nom curriculum */}
          <div className="space-y-1">
            <Label htmlFor="curriculum_name">Nom curriculum <span className="text-red-600">*</span></Label>
            <Input
              id="curriculum_name"
              value={formData.curriculum_name || ""}
              onChange={(e) => handleFieldChange("curriculum_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.curriculum_name ? "border-red-500" : ""}
            />
            {errors.curriculum_name && <p className="text-red-600 text-sm">{errors.curriculum_name}</p>}
          </div>

          {/* Code statut */}
          <div className="space-y-1">
            <Label htmlFor="status_code">Code statut <span className="text-red-600">*</span></Label>
            <Input
              id="status_code"
              value={formData.status_code || ""}
              onChange={(e) => handleFieldChange("status_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.status_code ? "border-red-500" : ""}
            />
            {errors.status_code && <p className="text-red-600 text-sm">{errors.status_code}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer le curriculum"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
