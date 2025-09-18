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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";
import { ICreateAcademicYear } from "@/types/planificationType";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle année académique</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour définir une nouvelle année académique.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {/* Dates */}
          <div className="space-y-1">
            <Label>Date de début</Label>
            <Controller
              name="start_date"
              control={control}
              rules={{ required: "Date de début requise" }}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Sélectionner</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                      disabled={isSubmitting}
                    />
                  </PopoverContent>
                </Popover>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Sélectionner</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                      disabled={isSubmitting}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Code Année</Label>
            <Input {...register("year_code")} disabled />
          </div>


          {/* Footer */}
          <DialogFooter className="col-span-2 mt-5">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer l'année académique"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
