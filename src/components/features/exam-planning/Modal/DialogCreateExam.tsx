/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useEffect, useState } from "react";
import { ICreateEvaluation } from "@/types/examTypes";
import { getListAcademicYearsSchedulesForCurriculum } from "@/actions/programsAction";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { IGetAcademicYearsSchedulesForCurriculum } from "@/types/planificationType";

interface DialogCreateEvaluationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateEvaluation) => Promise<boolean>;
  curriculum_code?: string;
  academic_year_code?: string | null;
}

export default function DialogCreateExam({
  open,
  onOpenChange,
  onSave,
  curriculum_code,
}: DialogCreateEvaluationProps) {
  const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);

  const { factorizedPrograms } = useFactorizedProgramStore();
  const { selectedAcademicYear } = useAcademicYearStore();
  const { } = useAcademicYearStore();


  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ICreateEvaluation>({
    defaultValues: {
      target_level: "COURSE_UNIT",
      schedule_code: "",
      evaluation_type_code: "CC",
      title: "",
      status_code: "READY_FOR_GRADING",
      curriculum_code: curriculum_code ?? "",
      deadline: "",
      academic_year_code: selectedAcademicYear ?? "",
    },
  });

  // Watchers
  const selectedCurriculum = useWatch({ control, name: "curriculum_code" });
  const evaluationType = useWatch({ control, name: "evaluation_type_code" });


  // Récupération des curriculum
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);




  useEffect(() => {
    if (curriculum_code) {
      setValue("curriculum_code", curriculum_code);
    }
  }, [curriculum_code, setValue]);


  useEffect(() => {
    if (selectedCurriculum && selectedAcademicYear) {
      fetchListAcademicYearsSchedulesForCurriculum(selectedCurriculum, selectedAcademicYear);
    }
  }, [setValue, selectedAcademicYear, selectedCurriculum]);




  // Fixer target_level selon type
  useEffect(() => {
    if (evaluationType === "CC") {
      setValue("target_level", "COURSE_UNIT");
    } else if (evaluationType === "EXAM_SEQ") {
      setValue("target_level", "MODULE");
    } else {
      setValue("target_level", "");
    }
  }, [evaluationType, setValue]);



  const onSubmit = async (data: ICreateEvaluation) => {
    console.log('-->data', data)
    const title = data.evaluation_type_code + ' ' + data.curriculum_code;

    const result = await onSave({ ...data, title });
    if (!result) return;

    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    reset();
    onOpenChange(false);
  };



  const fetchListAcademicYearsSchedulesForCurriculum = async (curriculum_code: string, academic_year_code: string) => {
    const result = await getListAcademicYearsSchedulesForCurriculum(curriculum_code, academic_year_code);
    setScheduleList(result.data.body)
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-left text-2xl font-bold text-slate-900">Créer une nouvelle évaluation</DialogTitle>
          <DialogDescription className="text-left text-sm text-slate-500 mt-1">
            Remplissez les informations de l&apos;évaluation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">

            {/* Schedule */}
            <div className="space-y-1">
              <Label>Semestre / Séquence</Label>
              <Controller
                name="schedule_code"
                control={control}
                rules={{ required: "Séquence requise" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une séquence" />
                    </SelectTrigger>
                    <SelectContent>
                      {scheduleList.map((s) => (
                        <SelectItem key={s.schedule_code} value={s.schedule_code}>
                          {s.sequence_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Type d’évaluation */}
            <div className="space-y-1">
              <Label>Type d’évaluation</Label>
              <Controller
                name="evaluation_type_code"
                control={control}
                rules={{ required: "Type requis" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Contrôle Continu</SelectItem>
                      <SelectItem value="EXAM_SEQ">Examen de Séquence</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>


            {/* Deadline */}
            <div className="space-y-1">
              <Label>Date limite de depot des notes</Label>
              <Controller
                name="deadline"
                control={control}
                rules={{ required: "Date limite requise" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Sélectionner une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {/* Curriculum */}
            <div className="space-y-1 col-span-2">
              <Label>Curriculum</Label>
              <Controller
                name="curriculum_code"
                control={control}
                rules={{ required: "Curriculum requis" }}
                render={({ field, fieldState }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un curriculum" />
                      </SelectTrigger>
                      <SelectContent>
                        {curriculumList.map((c) => (
                          <SelectItem key={c.curriculum_code} value={c.curriculum_code}>
                            {c.curriculum_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-red-600 text-sm">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>

            </div>
          </div>

          {/* Footer */}
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
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Création..." : "Créer l'évaluation"}
              </Button>
            </div>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}
