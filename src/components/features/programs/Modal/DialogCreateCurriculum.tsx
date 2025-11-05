"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Save, GraduationCap } from "lucide-react";
import { ICreateCurriculum } from "@/types/programTypes";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useConfigStore } from "@/lib/store/configStore";

// Schéma de validation Zod
const curriculumSchema = z.object({
  curriculum_code: z
    .string()
    .min(1, "Le code curriculum est requis")
    .trim(),
  program_code: z
    .string()
    .min(1, "Le programme est requis"),
  study_level: z
    .string()
    .min(1, "Le niveau d'étude est requis")
    .trim(),
  curriculum_name: z
    .string()
    .min(1, "Le nom du curriculum est requis")
    .trim(),
  status_code: z
    .string()
    .min(1, "Le statut est requis"),
});

type CurriculumFormData = z.infer<typeof curriculumSchema>;

export interface DialogCurriculumProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateCurriculum) => Promise<boolean>;
}

export function DialogCreateCurriculum({
  open,
  onOpenChange,
  onSave,
}: DialogCurriculumProps) {
  const { factorizedPrograms } = useFactorizedProgramStore();
  const { getEducationLevels } = useConfigStore();
  const educationLevels = getEducationLevels();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: {
      curriculum_code: "",
      program_code: "",
      study_level: "",
      curriculum_name: "",
      status_code: "ACTIVE",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset();
    } else {
      // Pre-select first program if available
      if (factorizedPrograms.length > 0) {
        setValue("program_code", factorizedPrograms[0].program.program_code);
      }
    }
  }, [open, factorizedPrograms, reset, setValue]);

  const onSubmit = async (data: CurriculumFormData) => {
    const success = await onSave(data as ICreateCurriculum);

    if (success) {
      reset();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Créer un nouveau curriculum
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Remplissez les informations du curriculum
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-5 max-h-[calc(90vh-180px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Code curriculum */}
              <div className="space-y-1">
                <Label htmlFor="curriculum_code" className="text-sm font-semibold text-slate-700">
                  Code curriculum <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="curriculum_code"
                  {...register("curriculum_code")}
                  disabled={isSubmitting}
                  placeholder="Ex: IDE"
                  className={errors.curriculum_code ? "border-red-500" : ""}
                />
                {errors.curriculum_code && (
                  <p className="text-red-500 text-xs">{errors.curriculum_code.message}</p>
                )}
              </div>

              {/* Code programme */}
              <div className="space-y-1">
                <Label htmlFor="program_code" className="text-sm font-semibold text-slate-700">
                  Programme <span className="text-red-500">*</span>
                </Label>
                <select
                  id="program_code"
                  {...register("program_code")}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.program_code ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Sélectionnez un programme</option>
                  {factorizedPrograms.map((item) => (
                    <option key={item.program.program_code} value={item.program.program_code}>
                      {item.program.program_name}
                    </option>
                  ))}
                </select>
                {errors.program_code && (
                  <p className="text-red-500 text-xs">{errors.program_code.message}</p>
                )}
              </div>

              {/* Niveau d'étude */}
              <div className="space-y-1">
                <Label htmlFor="study_level" className="text-sm font-semibold text-slate-700">
                  Niveau d&apos;étude <span className="text-red-500">*</span>
                </Label>
                <select
                  id="study_level"
                  {...register("study_level")}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.study_level ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Diplome minimal requis</option>
                  {educationLevels.map((item) => (
                    <option key={item.level_code} value={item.level_code}>
                      {item.title}
                    </option>
                  ))}
                </select>
                {errors.study_level && (
                  <p className="text-red-500 text-xs">{errors.study_level.message}</p>
                )}
              </div>

              {/* Nom curriculum */}
              <div className="space-y-1">
                <Label htmlFor="curriculum_name" className="text-sm font-semibold text-slate-700">
                  Nom du curriculum <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="curriculum_name"
                  {...register("curriculum_name")}
                  disabled={isSubmitting}
                  placeholder="Ex: Informatique L1"
                  className={errors.curriculum_name ? "border-red-500" : ""}
                />
                {errors.curriculum_name && (
                  <p className="text-red-500 text-xs">{errors.curriculum_name.message}</p>
                )}
              </div>
            </div>

            {/* Statut */}
            <div className="space-y-1">
              <Label htmlFor="status_code" className="text-sm font-semibold text-slate-700">
                Statut <span className="text-red-500">*</span>
              </Label>
              <select
                id="status_code"
                {...register("status_code")}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.status_code ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
              {errors.status_code && (
                <p className="text-red-500 text-xs">{errors.status_code.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-end w-full space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Création..." : "Créer le curriculum"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}