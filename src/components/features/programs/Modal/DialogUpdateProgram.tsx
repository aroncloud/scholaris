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
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface DialogUpdateProgramProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (program: ICreateProgram) => Promise<void>;
  program: ICreateProgram;
}

export default function DialogUpdateProgram({
  open,
  onOpenChange,
  onSave,
  program,
}: DialogUpdateProgramProps) {
  const [formData, setFormData] = useState<Partial<ICreateProgram>>(program);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation des champs requis
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.program_code) newErrors.program_code = "Code du programme requis";
    if (!formData.program_name) newErrors.program_name = "Nom du programme requis";
    if (!formData.internal_code) newErrors.internal_code = "Code interne requis";
    if (!formData.degree_name) newErrors.degree_name = "Nom du diplôme requis";
    if (!formData.degree_code) newErrors.degree_code = "Code du diplôme requis";
    if (!formData.description) newErrors.description = "Description requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarde après validation
  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave(formData as ICreateProgram);
      setErrors({});
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Annuler la mise à jour
  const handleCancel = () => {
    if (isSubmitting) return;
    setFormData(program);
    setErrors({});
    onOpenChange(false);
  };

  // Mise à jour des champs
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
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-left text-2xl font-bold text-slate-900">Modifier le programme</DialogTitle>
          <DialogDescription className="text-left text-sm text-slate-500 mt-1">Mettez à jour les informations du programme</DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code programme */}
            <div className="space-y-1">
              <Label htmlFor="program_code">Code Programme *</Label>
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
              <Label htmlFor="program_name">Nom du Programme *</Label>
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
              <Label htmlFor="internal_code">Code Interne *</Label>
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
              <Label htmlFor="degree_name">Nom du Diplôme *</Label>
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
              <Label htmlFor="degree_code">Code Diplôme *</Label>
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
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

        </div>

        <DialogFooter className="p-4 md:p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >

              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
