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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useAcademicYearSchedules } from "@/hooks/feature/planifincation/useAcademicYearSchedules";
import { useCallback, useEffect, useState } from "react";
import { ICreateEvaluation } from "@/types/examTypes";
import { IGetModulePerCurriculum } from "@/types/programTypes";
import { getModuleListPerCurriculum } from "@/actions/programsAction";
import { showToast } from "@/components/ui/showToast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";

interface DialogCreateEvaluationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateEvaluation) => Promise<boolean>;
  examType?: "CC" | "EXAM_SEQ";
  curriculum_code?: string;
}

export default function DialogCreateExam({
  open,
  onOpenChange,
  onSave,
  examType,
  curriculum_code
}: DialogCreateEvaluationProps) {
  const { factorizedPrograms, UEPerCurriculumList } = useFactorizedProgramStore();
  const { academicYearSchedule, loading } = useAcademicYearSchedules();
  const { } = useAcademicYearStore();

  const [moduleList, setModuleList] = useState<IGetModulePerCurriculum[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ICreateEvaluation>({
    defaultValues: {
      target_code: "",
      target_level: examType === "CC" ? "COURSE_UNIT" : "MODULE",
      schedule_code: "",
      evaluation_type_code: examType,
      title: "",
      evaluation_date: "",
      max_score: 20,
      coefficient: 1,
      status: "DRAFT",
      curriculum_code: curriculum_code ?? "",
    },
  });

  // Watchers
  const selectedCurriculum = useWatch({ control, name: "curriculum_code" });
  const evaluationType = useWatch({ control, name: "evaluation_type_code" });

  // const fetchCurrentSemesters = useCallback(async () => {
  //   console.log('-->academicYears', academicYears);
  //   const currentYear = academicYears.find(acy => acy.status_code === 'IN_PROGRESS');
  //   console.log('-->currentYear', currentYear);
  //   console.log('-->academicYears', academicYears);
  //   if (currentYear) {
  //     await refresh(currentYear.academic_year_code);
  //   }
  // }, [academicYears, refresh]);

  // Récupération schedule selon année
  // useEffect(() => {
  //   // fetchCurrentSemesters();
  // }, [fetchCurrentSemesters]);

  // Récupération UE
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);
  const ueList = selectedCurriculum ? UEPerCurriculumList[selectedCurriculum] || [] : [];

  // Récupération module quand EXAM_SEQ
  useEffect(() => {
    if (evaluationType === "EXAM_SEQ" && selectedCurriculum) {
      const fetchModules = async () => {
        const result = await getModuleListPerCurriculum(selectedCurriculum);
        if (result.code === "success") {
          setModuleList(result.data.body);
        } else {
          showToast({
            variant: "error-solid",
            message: "Erreur lors de la récupération des modules",
            description: result.code,
            position: "top-center",
          });
        }
      };
      fetchModules();
    }
  }, [evaluationType, selectedCurriculum]);

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
    const title = data.evaluation_type_code === "CC" ?
        ueList.find(ue => ue.course_unit_code === data.target_code)?.course_unit_name :
        moduleList.find(m => m.module_code === data.target_code)?.module_name;

    console.log('-->title', title)
    const result = await onSave({...data, title: title ?? data.target_code});
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
          <DialogTitle>Créer une nouvelle évaluation</DialogTitle>
          <DialogDescription>
            Remplissez les informations de l&apos;évaluation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
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
                    <SelectContent className="w-full">
                      {curriculumList.map((c) => (
                        <SelectItem key={c.curriculum_code} value={c.curriculum_code}>
                          {c.curriculum_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-red-600 text-sm">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Type d’évaluation */}
          <div className="space-y-1 col-span-2">
            <Label>Type d&apos;évaluation</Label>
            <Controller
              name="evaluation_type_code"
              control={control}
              rules={{ required: "Type requis" }}
              render={({ field, fieldState }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="CC">Contrôle Continu</SelectItem>
                      <SelectItem value="EXAM_SEQ">Examen de Séquence</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-red-600 text-sm">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          {/* Target code (UE ou Module) */}
          {evaluationType === "CC" && (
            <div className="space-y-1 col-span-2">
              <Label>Unité d&apos;enseignement</Label>
              <Controller
                name="target_code"
                control={control}
                rules={{ required: "UE requise" }}
                render={({ field, fieldState }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange} disabled={!selectedCurriculum}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une UE" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {ueList.map((ue) => (
                          <SelectItem key={ue.course_unit_code} value={ue.course_unit_code}>
                            {ue.course_unit_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-red-600 text-sm">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
          )}

          {evaluationType === "EXAM_SEQ" && (
            <div className="space-y-1 col-span-2">
              <Label>Module</Label>
              <Controller
                name="target_code"
                control={control}
                rules={{ required: "Module requis" }}
                render={({ field, fieldState }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange} disabled={!selectedCurriculum}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un module" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {moduleList.map((m) => (
                          <SelectItem key={m.module_code} value={m.module_code}>
                            {m.module_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-red-600 text-sm">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
          )}

          {/* Schedule */}
          <div className="space-y-1 col-span-2">
            <Label>Semestre/Trimestre</Label>
            <Controller
              name="schedule_code"
              control={control}
              rules={{ required: "Séquence requise" }}
              render={({ field, fieldState }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une séquence" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {academicYearSchedule.map((ays) => (
                        <SelectItem key={ays.schedule_code} value={ays.schedule_code}>
                          {ays.sequence_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <p className="text-red-600 text-sm">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>

          {/* Date */}
          <div className="space-y-1 col-span-2">
            <Label>Date</Label>
            <Controller
              name="evaluation_date"
              control={control}
              rules={{ required: "Date requise" }}
              render={({ field, fieldState }) => (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && <p className="text-red-600 text-sm">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>

          {/* Max Score */}
          <div className="space-y-1">
            <Label>Note maximale</Label>
            <Input
              type="number"
              {...register("max_score", { required: "Note requise", valueAsNumber: true })}
            />
            {errors.max_score && <p className="text-red-600 text-sm">{errors.max_score.message}</p>}
          </div>

          {/* Coefficient */}
          <div className="space-y-1">
            <Label>Coefficient</Label>
            <Input
              type="number"
              {...register("coefficient", { required: "Coefficient requis", valueAsNumber: true })}
            />
            {errors.coefficient && <p className="text-red-600 text-sm">{errors.coefficient.message}</p>}
          </div>

          {/* Footer */}
          <DialogFooter className="col-span-2 mt-5">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer l'évaluation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
