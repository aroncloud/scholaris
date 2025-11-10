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
import { Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Combobox } from "@/components/ui/Combobox";

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
  const { control } = useForm<ICreateCurriculum>({
    defaultValues: initialData
  });



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
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900">Mise à jour du curriculum</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Modifiez les informations du curriculum
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code curriculum */}
            <div className="space-y-1">
              <Label htmlFor="curriculum_code">
                Code curriculum <span className="text-red-600">*</span>
              </Label>
              <Input
                id="curriculum_code"
                value={formData.curriculum_code || ""}
                onChange={(e) => handleFieldChange("curriculum_code", e.target.value)}
                disabled={loading}
                className={errors.curriculum_code ? "border-red-500" : ""}
              />
              {errors.curriculum_code && (
                <p className="text-red-600 text-sm">{errors.curriculum_code}</p>
              )}
            </div>

            {/* Code programme (Combobox) */}
            <div className="space-y-1">
              <Label>Code programme <span className="text-red-600">*</span></Label>
              <Controller
                name="program_code"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={factorizedPrograms.map(item => ({
                      value: item.program.program_code.toString(),
                      label: item.program.program_name
                    }))}
                    value={field.value?.toString() || ""}
                    onChange={field.onChange}
                    placeholder="Choisissez votre formation"
                    className={errors.program_code ? "border-red-500 py-2" : "py-2"}
                  />
                )}
              />

              {errors.program_code && (
                <p className="text-red-600 text-sm">{errors.program_code}</p>
              )}
            </div>

            {/* Niveau d'étude */}
            <div className="space-y-1">
              <Label htmlFor="study_level">
                Niveau d&apos;étude <span className="text-red-600">*</span>
              </Label>
              <Input
                id="study_level"
                value={formData.study_level || ""}
                onChange={(e) => handleFieldChange("study_level", e.target.value)}
                disabled={loading}
                className={errors.study_level ? "border-red-500" : ""}
              />
              {errors.study_level && (
                <p className="text-red-600 text-sm">{errors.study_level}</p>
              )}
            </div>

            {/* Nom curriculum */}
            <div className="space-y-1">
              <Label htmlFor="curriculum_name">
                Nom curriculum <span className="text-red-600">*</span>
              </Label>
              <Input
                id="curriculum_name"
                value={formData.curriculum_name || ""}
                onChange={(e) => handleFieldChange("curriculum_name", e.target.value)}
                disabled={loading}
                className={errors.curriculum_name ? "border-red-500" : ""}
              />
              {errors.curriculum_name && (
                <p className="text-red-600 text-sm">{errors.curriculum_name}</p>
              )}
            </div>
          </div>
        </div>


        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Mise à jour..." : "Mettre à jour le curriculum"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}