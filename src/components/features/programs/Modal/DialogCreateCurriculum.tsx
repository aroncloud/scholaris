"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, GraduationCap } from "lucide-react";
import { ICreateCurriculum } from "@/types/programTypes";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useConfigStore } from "@/lib/store/configStore";
import { Combobox } from "@/components/ui/Combobox";

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
    control,
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
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Créer un nouveau curriculum
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Remplissez les informations du curriculum
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
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

                {/* Niveau d'étude */}
                <div className="space-y-2">
                  <Label>Niveau d&apos;étude</Label>
                  <Controller
                    name="study_level"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        options={educationLevels.map(level => ({
                          value: level.level_code,
                          label: level.title
                        }))}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Diplome minimal requis"
                        className='py-5'
                      />
                    )}
                  />
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
                {/* Statut */}
              <div className="space-y-2">
                <Label>Statut <span className="text-red-500">*</span></Label>
                <Select onValueChange={(value) => setValue("status_code", value as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                    <SelectItem value="ARCHIVED">Archivé</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status_code && (
                  <p className="text-xs text-red-500">Statut requis</p>
                )}
              </div>
              </div>
             
              {/* Code programme */}
                <div className="space-y-2 col-span-2">
                  <Label>Programme</Label>
                  <Controller
                    name="program_code"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        options={factorizedPrograms.map(item => ({
                          value: item.program.program_code,
                          label: item.program.program_name
                        }))}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Sélectionnez un programme"
                        className='py-5'
                      />
                    )}
                  />
                  {errors.program_code && (
                    <p className="text-red-500 text-xs">{errors.program_code.message}</p>
                  )}
                </div>

            </div>

          </form>
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
      </DialogContent>
    </Dialog>
  );
}