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
import { Save } from "lucide-react";

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
    if (!validate()) { console.log('errors', errors); return; }
    setIsSubmitting(true);
    try {
      await onSave({ ...formData, curriculum_code: curriculumCode } as ICreateSemester);
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
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">

        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-left text-2xl font-bold text-slate-900 flex items-center gap-2">Créer une nouvelle séquence</DialogTitle>
          <DialogDescription className="text-left text-sm text-slate-500 mt-1">
            Remplissez les informations de la séquence
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Curriculum */}
            <div className="space-y-1">
              <Label htmlFor="curriculum_code">
                Code curriculum <span className="text-red-600">*</span>
              </Label>
              <Input
                id={curriculumCode}
                value={curriculumName}
                disabled={true}
              />
            </div>

            {/* Code séquence */}
            <div className="space-y-1">
              <Label htmlFor="sequence_code">
                Code séquence <span className="text-red-600">*</span>
              </Label>
              <Input
                id="sequence_code"
                value={formData.sequence_code || ""}
                onChange={(e) => handleFieldChange("sequence_code", e.target.value)}
                disabled={isSubmitting}
                className={errors.sequence_code ? "border-red-500" : ""}
              />
              {errors.sequence_code && (
                <p className="text-red-600 text-sm">{errors.sequence_code}</p>
              )}
            </div>

            {/* Nom séquence */}
            <div className="space-y-1">
              <Label htmlFor="sequence_name">
                Nom séquence <span className="text-red-600">*</span>
              </Label>
              <Input
                id="sequence_name"
                value={formData.sequence_name || ""}
                onChange={(e) => handleFieldChange("sequence_name", e.target.value)}
                disabled={isSubmitting}
                className={errors.sequence_name ? "border-red-500" : ""}
              />
              {errors.sequence_name && (
                <p className="text-red-600 text-sm">{errors.sequence_name}</p>
              )}
            </div>

            {/* Numéro séquence */}
            <div className="space-y-1">
              <Label htmlFor="sequence_number">
                Numéro séquence <span className="text-red-600">*</span>
              </Label>
              <Input
                id="sequence_number"
                value={formData.sequence_number || ""}
                onChange={(e) => handleFieldChange("sequence_number", e.target.value)}
                disabled={isSubmitting}
                className={errors.sequence_number ? "border-red-500" : ""}
              />
              {errors.sequence_number && (
                <p className="text-red-600 text-sm">{errors.sequence_number}</p>
              )}
            </div>
            {/* Description (optionnel) */}
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
              onClick={handleCancel}
              disabled={isSubmitting}
              variant="outline"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Création..." : "Créer la séquence"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}