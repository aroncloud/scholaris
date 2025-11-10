/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";
import { ICreateAcademicYear } from "@/types/planificationType";
import { DatePicker } from "@/components/DatePicker";

interface DialogCreateAcademicYearProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateAcademicYear) => Promise<boolean>;
}

export default function DialogCreateAcademicYear({
  open,
  onOpenChange,
  onSave,
}: DialogCreateAcademicYearProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ICreateAcademicYear>({
    defaultValues: {
      year_code: "",
      start_date: "",
      end_date: "",
      status_code: "PLANNED",
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  // Génération automatique des codes
  useEffect(() => {
    if (startDate && endDate) {
      const startYear = new Date(startDate).getFullYear();
      const endYear = new Date(endDate).getFullYear();
      const yearCode = `${startYear}-${endYear}`;
      setValue("year_code", yearCode);
    }
  }, [startDate, endDate, setValue]);

  const onSubmit = async (data: ICreateAcademicYear) => {
    if (new Date(data.end_date) <= new Date(data.start_date)) {
      alert("La date de fin doit être postérieure à la date de début.");
      return;
    }
    const result = await onSave(data);
    if (!result) return;
    reset();
    onOpenChange(false);
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
          <DialogTitle className="text-2xl font-bold text-slate-900">Créer une nouvelle année académique</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Remplissez les informations pour définir une nouvelle année académique.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {/* Dates */}
            <div className="space-y-1">
              <Label>Date de début</Label>
              <Controller
                name="start_date"
                control={control}
                rules={{ required: "Date de début requise" }}
                render={({ field }) => (
                  <DatePicker
                    label=""
                    minDate={new Date(1900, 0, 1)}
                    onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.start_date && <p className="text-red-600 text-sm">{errors.start_date.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Date de fin</Label>
              <Controller
                name="end_date"
                control={control}
                rules={{ required: "Date de fin requise" }}
                render={({ field }) => (
                  <DatePicker
                    label=""
                    minDate={new Date(1900, 0, 1)}
                    onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Code Année</Label>
              <Input {...register("year_code")} />
            </div>
          </form>

        </div>
        {/* Footer */}
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
              {isSubmitting ? "Création..." : "Créer l'année académique"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
