"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";
import { format } from "date-fns";
import { ICreateAcademicYearSchedules } from "@/types/planificationType";
import { IGetTrainingSequenceForCurriculum } from "@/types/programTypes";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { Save } from "lucide-react";

interface DialogCreateAcademicYearScheduleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateAcademicYearSchedules[]) => Promise<boolean>;
  sequenceList: IGetTrainingSequenceForCurriculum[];
}

// Type pour les données du formulaire gérées par react-hook-form
type FormValues = {
  schedules: {
    start_date?: Date;
    end_date?: Date;
  }[];
};

export function DialogCreateAcademicYearSchedule({
  open,
  onOpenChange,
  onSave,
  sequenceList,
}: DialogCreateAcademicYearScheduleProps) {
  const { selectedAcademicYear, academicYears } = useAcademicYearStore();

  const {
    control,
    handleSubmit,
    reset,
    getValues, // getValues est utilisé pour la validation croisée
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      schedules: [],
    },
  });

  // Utilisation de useFieldArray pour gérer une liste de champs de formulaire
  const { fields } = useFieldArray({
    control,
    name: "schedules",
  });

  // Réinitialiser et peupler le formulaire lorsque la liste des séquences change
  useEffect(() => {
    reset({
      schedules: sequenceList.map(() => ({
        start_date: undefined,
        end_date: undefined,
      })),
    });
  }, [sequenceList, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!selectedAcademicYear) {
      console.error("Aucune année académique n'a été sélectionnée.");
      return;
    }

    const payload: ICreateAcademicYearSchedules[] = data.schedules.map(
      (schedule, index) => ({
        academic_year_code: selectedAcademicYear,
        sequence_code: sequenceList[index].sequence_code,
        start_date: schedule.start_date ? format(schedule.start_date, "yyyy-MM-dd") : "",
        end_date: schedule.end_date ? format(schedule.end_date, "yyyy-MM-dd") : "",
        status_code: "ACTIVE",
      })
    );

    const result = await onSave(payload);
    if (result) {
      handleCancel(); // Ferme et réinitialise si la sauvegarde réussit
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
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Créer un Academic Year Schedule
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Configurez votre formulaire d&apos;un Academic Year Schedule
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2 border-b pb-2">
                <Label className="font-semibold mb-7 bg-blue-100 rounded p-2">
                  {sequenceList[index].sequence_name}
                </Label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="mb-4">Année académique</Label>
                    <Input
                      type="text"
                      disabled
                      value={academicYears.find(year => year.academic_year_code === selectedAcademicYear)?.year_code ?? ""}
                    />
                  </div>
                  {/* Date de début */}
                  <div>
                    <Label className="mb-4">Date de début</Label>
                    <Controller
                      name={`schedules.${index}.start_date`}
                      control={control}
                      rules={{ required: "La date de début est requise" }}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          label=""
                          minDate={new Date(1900, 0, 1)}
                          onChange={onChange}
                          selected={value}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                    {errors.schedules?.[index]?.start_date && (
                      <p className="text-red-600 text-sm">
                        {errors.schedules[index]?.start_date?.message}
                      </p>
                    )}
                  </div>

                  {/* Date de fin */}
                  <div>
                    <Label className="mb-4">Date de fin</Label>
                    <Controller
                      name={`schedules.${index}.end_date`}
                      control={control}
                      rules={{
                        required: "La date de fin est requise",
                        validate: (endDate) => {
                          const startDate = getValues(`schedules.${index}.start_date`);
                          if (!startDate || !endDate) return true;
                          return startDate <= endDate || "La date de fin doit être postérieure ou égale à la date de début";
                        },
                      }}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          label=""
                          minDate={new Date(1900, 0, 1)}
                          onChange={onChange}
                          selected={value}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                    {errors.schedules?.[index]?.end_date && (
                      <p className="text-red-600 text-sm">
                        {errors.schedules[index]?.end_date?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </form>
        </div>
        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
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
              {isSubmitting ? "Création..." : "Créer"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}