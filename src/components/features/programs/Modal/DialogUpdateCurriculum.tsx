"use client";

import { useState, useEffect } from "react";
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

interface DialogUpdateCurriculumProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ICreateCurriculum;
  onUpdate: (updated: ICreateCurriculum) => Promise<void>;
}

export function DialogUpdateCurriculum({
  open,
  onOpenChange,
  initialData,
  onUpdate,
}: DialogUpdateCurriculumProps) {
  const [formData, setFormData] = useState<Partial<ICreateCurriculum>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { factorizedPrograms } = useFactorizedProgramStore();

  // Si les données changent, on remet à jour le formulaire
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

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

  // Sauvegarde
  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onUpdate(formData as ICreateCurriculum);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    if (loading) return;
    setFormData(initialData);
    setErrors({});
    onOpenChange(false);
  };

  // Modification champ
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
          <DialogTitle>Mise à jour du curriculum</DialogTitle>
          <DialogDescription>
            Modifiez les informations du curriculum
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              className={errors.curriculum_name ? "border-red-500" : ""}
            />
            {errors.curriculum_name && <p className="text-red-600 text-sm">{errors.curriculum_name}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour le curriculum"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}