"use client";

import { useForm, Controller } from "react-hook-form";
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
import { ICreateValidationRule } from "@/types/planificationType";
import { Save } from "lucide-react";

interface DialogCreateValidationRuleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateValidationRule) => Promise<boolean>;
  curriculum: { code: string; name: string };
  academicYear: { code: string; name: string };
}

export function DialogCreateValidationRule({
  open,
  onOpenChange,
  onSave,
  curriculum,
  academicYear,
}: DialogCreateValidationRuleProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ICreateValidationRule>({
    defaultValues: {
      curriculum_code: curriculum.code,
      academic_year_code: academicYear.code,
      rule_type: "CALCUL_MODULE_SEQUENTIEL",
      formula_json: {
        CONTROLE_CONTINU: 0.3,
        EXAMEN_SEQUENTIEL: 0.7,
      },
      validation_threshold: 12.0,
    },
  });

  const cc = watch("formula_json.CONTROLE_CONTINU");
  const sn = watch("formula_json.EXAMEN_SEQUENTIEL");

  const onSubmit = async (data: ICreateValidationRule) => {
    if (cc + sn !== 1) {
      alert("La somme des pourcentages CC et SN doit être égale à 100%");
      return;
    }

    const result = await onSave({
      ...data,
      validation_threshold: Number(data.validation_threshold)
    });
    if (!result) return;
    if (result) {
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
          <DialogTitle className="text-2xl font-bold text-slate-900">Planifier une règle de calcul</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Définissez les règles de calcul des notes pour valider les matières
            de cette filière.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Filière */}
            <div className="space-y-1">
              <Label>Filière</Label>
              <Input value={curriculum.name} disabled />
              <input type="hidden" {...register("curriculum_code")} />
            </div>

            {/* Année académique */}
            <div className="space-y-1">
              <Label>Année académique</Label>
              <Input value={academicYear.name} disabled />
              <input type="hidden" {...register("academic_year_code")} />
            </div>

            {/* Poids CC */}
            <div className="space-y-1">
              <Label>
                Poids du Contrôle Continu (%){" "}
                <span className="text-gray-500 text-sm">(ex: 30)</span>
              </Label>

              <Controller
                control={control}
                name="formula_json.CONTROLE_CONTINU"
                rules={{ required: "Champ requis" }}
                render={({ field }) => (
                  <Input
                    type="number"
                    step="0.01"
                    disabled={isSubmitting}
                    value={field.value * 100}
                    onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                  />
                )}
              />

              {errors.formula_json?.CONTROLE_CONTINU && (
                <p className="text-red-600 text-sm">
                  {errors.formula_json.CONTROLE_CONTINU.message}
                </p>
              )}
            </div>

            {/* Poids SN */}
            <div className="space-y-1">
              <Label>
                Poids de l’Examen Séquentiel (%){" "}
                <span className="text-gray-500 text-sm">(ex: 70)</span>
              </Label>

              <Controller
                control={control}
                name="formula_json.EXAMEN_SEQUENTIEL"
                rules={{ required: "Champ requis" }}
                render={({ field }) => (
                  <Input
                    type="number"
                    step="0.01"
                    disabled={isSubmitting}
                    value={field.value * 100}
                    onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                  />
                )}
              />

              {errors.formula_json?.EXAMEN_SEQUENTIEL && (
                <p className="text-red-600 text-sm">
                  {errors.formula_json.EXAMEN_SEQUENTIEL.message}
                </p>
              )}
            </div>

            {/* Note minimale */}
            <div className="space-y-1">
              <Label>
                Note minimale pour valider la matière{" "}
                <span className="text-gray-500 text-sm">(ex: 12)</span>
              </Label>

              <Input
                type="number"
                step="0.1"
                {...register("validation_threshold", {
                  required: "Champ requis",
                })}
                disabled={isSubmitting}
              />

              {errors.validation_threshold && (
                <p className="text-red-600 text-sm">
                  {errors.validation_threshold.message}
                </p>
              )}
            </div>

          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={'info'}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer la règle"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
