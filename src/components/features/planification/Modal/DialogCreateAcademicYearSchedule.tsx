"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICreateAcademicYearSchedules } from "@/types/planificationType";
import { IGetTrainingSequenceForCurriculum } from "@/types/programTypes";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DialogCreateAcademicYearScheduleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateAcademicYearSchedules[]) => Promise<boolean>;
  sequenceList: IGetTrainingSequenceForCurriculum[];
}

export function DialogCreateAcademicYearSchedule({
  open,
  onOpenChange,
  onSave,
  sequenceList,
}: DialogCreateAcademicYearScheduleProps) {
  const [formData, setFormData] = useState<
    Record<string, { start_date?: Date; end_date?: Date }>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { academicYears } = useAcademicYearStore();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedAcademicYear) {
        newErrors["academic_year"] = "Sélectionnez une année académique";
    }

    sequenceList.forEach((seq) => {
        const data = formData[seq.sequence_code];

        if (!data?.start_date) {
        newErrors[`${seq.sequence_code}-start`] = "Date de début requise";
        }
        if (!data?.end_date) {
        newErrors[`${seq.sequence_code}-end`] = "Date de fin requise";
        }

        if (data?.start_date && data?.end_date) {
        const start = data.start_date.getTime();
        const end = data.end_date.getTime();
        if (start > end) {
            const msg = "La date de début doit être antérieure ou égale à la date de fin";
            newErrors[`${seq.sequence_code}-start`] = msg;
            newErrors[`${seq.sequence_code}-end`] = msg;
        }
        }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload: ICreateAcademicYearSchedules[] = sequenceList.map((seq) => ({
        academic_year_code: selectedAcademicYear,
        sequence_code: seq.sequence_code,
        start_date: formData[seq.sequence_code]?.start_date
          ? format(formData[seq.sequence_code]!.start_date!, "yyyy-MM-dd")
          : "",
        end_date: formData[seq.sequence_code]?.end_date
          ? format(formData[seq.sequence_code]!.end_date!, "yyyy-MM-dd")
          : "",
        status_code: "ACTIVE",
      }));

      const result = await onSave(payload);
      if (!result) return;

      setFormData({});
      setErrors({});
      setSelectedAcademicYear("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    setFormData({});
    setErrors({});
    setSelectedAcademicYear("");
    onOpenChange(false);
  };

  const handleDateChange = (
    sequenceCode: string,
    field: "start_date" | "end_date",
    date: Date | undefined
  ) => {
    setFormData({
      ...formData,
      [sequenceCode]: {
        ...formData[sequenceCode],
        [field]: date,
      },
    });
    const errorKey = `${sequenceCode}-${field === "start_date" ? "start" : "end"}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un Academic Year Schedule</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélecteur d'année académique */}
          <div className="space-y-2">
                <Label>Année académique</Label>
                <Select
                    value={selectedAcademicYear}
                    onValueChange={(value) => {
                    setSelectedAcademicYear(value);
                    if (errors["academic_year"]) {
                        const newErrors = { ...errors };
                        delete newErrors["academic_year"];
                        setErrors(newErrors);
                    }
                    }}
                >
                    <SelectTrigger
                    className={cn(
                        "w-full",
                        errors["academic_year"] && "border-red-500"
                    )}
                    >
                    <SelectValue placeholder="Choisir une année académique" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                    {academicYears.map((ay) => (
                        <SelectItem key={ay.academic_year_code} value={ay.academic_year_code}>
                        {ay.year_code}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                {errors["academic_year"] && (
                    <p className="text-red-600 text-sm">{errors["academic_year"]}</p>
                )}
            </div>

          {/* Dates des séquences */}
          {sequenceList.map((seq) => (
            <div key={seq.sequence_code} className="space-y-2 border-b pb-7">
              <Label className="font-semibold">{seq.sequence_name}</Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Date de début */}
                <div>
                  <Label className="mb-4">Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData[seq.sequence_code]?.start_date && "text-muted-foreground",
                          errors[`${seq.sequence_code}-start`] && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData[seq.sequence_code]?.start_date
                          ? format(formData[seq.sequence_code]?.start_date as Date, "dd/MM/yyyy")
                          : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData[seq.sequence_code]?.start_date}
                        onSelect={(date) => handleDateChange(seq.sequence_code, "start_date", date)}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors[`${seq.sequence_code}-start`] && (
                    <p className="text-red-600 text-sm">
                      {errors[`${seq.sequence_code}-start`]}
                    </p>
                  )}
                </div>

                {/* Date de fin */}
                <div>
                  <Label className="mb-4">Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData[seq.sequence_code]?.end_date && "text-muted-foreground",
                          errors[`${seq.sequence_code}-end`] && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData[seq.sequence_code]?.end_date
                          ? format(formData[seq.sequence_code]?.end_date as Date, "dd/MM/yyyy")
                          : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData[seq.sequence_code]?.end_date}
                        onSelect={(date) => handleDateChange(seq.sequence_code, "end_date", date)}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors[`${seq.sequence_code}-end`] && (
                    <p className="text-red-600 text-sm">
                      {errors[`${seq.sequence_code}-end`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
