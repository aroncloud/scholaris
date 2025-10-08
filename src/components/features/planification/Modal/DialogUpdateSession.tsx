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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IFullCalendarEvent } from "@/components/features/planification/Calendar/CalendarPlanification";
import { useClassroomStore } from "@/store/useClassroomStore";
import { useEffect, useState } from "react";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useTeacherStore } from "@/store/useTeacherStore";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { getListAcademicYearsSchedulesForCurriculum, getUEListPerCurriculum } from "@/actions/programsAction";
import { IGetAcademicYearsSchedulesForCurriculum } from "@/types/planificationType";
import { IGetUECurriculum } from "@/types/programTypes";
import { DateTimePicker } from "@/components/ui/DateTimePicker";

interface IUpdateSessionForm {
  curriculum_code: string;
  course_unit_code: string;
  schedule_code: string;
  teacher_user_code: string;
  resource_code: string;
  session_title: string;
  start_time: string;
  end_time: string;
  academic_year_code: string;
}

interface DialogUpdateSessionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { resource_code: string; session_title: string }) => Promise<boolean>;
  onCancelSession: () => Promise<boolean>;
  eventData: IFullCalendarEvent | null;
}

export function DialogUpdateSession({
  open,
  onOpenChange,
  onSave,
  onCancelSession,
  eventData,
}: DialogUpdateSessionProps) {
  const { classrooms } = useClassroomStore();
  const { factorizedPrograms } = useFactorizedProgramStore();
  const { teacherList } = useTeacherStore();
  const { getCurrentAcademicYear } = useAcademicYearStore();
  const currentAcademicYear = getCurrentAcademicYear();

  const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);
  const [UEList, setUEList] = useState<IGetUECurriculum[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IUpdateSessionForm>({
    defaultValues: {
      curriculum_code: "",
      course_unit_code: "",
      schedule_code: "",
      teacher_user_code: "",
      resource_code: "",
      session_title: "",
      start_time: "",
      end_time: "",
      academic_year_code: "",
    },
  });

  const selectedCurriculum = useWatch({
    control,
    name: "curriculum_code",
  });

  const selectedUE = useWatch({
    control,
    name: "course_unit_code",
  });

  const selectedAcademicYear = useWatch({
    control,
    name: "academic_year_code",
  });

  const startTime = useWatch({
    control,
    name: "start_time",
  });

  const endTime = useWatch({
    control,
    name: "end_time",
  });

  // Charger les données de l'événement
  useEffect(() => {
    if (open && eventData) {
      console.log('DialogUpdateSession - eventData:', eventData);
      console.log('DialogUpdateSession - extendedProps:', eventData.extendedProps);

      // Récupérer les codes depuis extendedProps
      const resourceCode = eventData.extendedProps?.resource_code ?? "";
      const teacherCode = eventData.extendedProps?.teacher_user_code ?? "";
      const curriculumCode = eventData.extendedProps?.curriculum_code ?? "";
      const courseUnitCode = eventData.extendedProps?.course_unit_code ?? "";
      const scheduleCode = eventData.extendedProps?.schedule_code ?? "";

      console.log('Codes extracted:', {
        resourceCode,
        teacherCode,
        curriculumCode,
        courseUnitCode,
        scheduleCode
      });

      // Pré-remplir tous les champs
      setValue("curriculum_code", curriculumCode);
      setValue("course_unit_code", courseUnitCode);
      setValue("schedule_code", scheduleCode);
      setValue("teacher_user_code", teacherCode);
      setValue("resource_code", resourceCode);
      setValue("session_title", eventData.title ?? "");
      setValue("start_time", eventData.start ?? "");
      setValue("end_time", eventData.end ?? "");
      setValue("academic_year_code", currentAcademicYear?.academic_year_code ?? "");
    }
  }, [open, eventData, setValue, currentAcademicYear]);

  // Charger les UE pour le curriculum
  useEffect(() => {
    if (selectedCurriculum && open) {
      fetchUEListPerCurriculum(selectedCurriculum);
    }
  }, [selectedCurriculum, open]);

  // Charger les séquences pour le curriculum et l'année académique
  useEffect(() => {
    if (selectedCurriculum && selectedAcademicYear && open) {
      fetchListAcademicYearsSchedulesForCurriculum(selectedCurriculum, selectedAcademicYear);
    }
  }, [selectedAcademicYear, selectedCurriculum, open]);

  // Synchroniser la date de fin avec la date de début (seulement après le chargement initial)
  useEffect(() => {
    if (startTime && open && eventData) {
      const [startDate] = startTime.split('T');
      if (endTime) {
        const currentEndDate = endTime.split('T')[0];
        // Ne synchroniser que si la date de début change
        if (startDate !== currentEndDate) {
          const [, endTimeOnly] = endTime.split('T');
          setValue('end_time', `${startDate}T${endTimeOnly || '11:30:00'}`, { shouldValidate: false });
        }
      }
    }
  }, [startTime]);

  // Validation: la date de fin doit être >= date de début
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end < start) {
        setError('end_time', {
          type: 'manual',
          message: 'La date/heure de fin doit être postérieure à la date/heure de début'
        });
      } else {
        clearErrors('end_time');
      }
    }
  }, [startTime, endTime, setError, clearErrors]);

  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

  const fetchListAcademicYearsSchedulesForCurriculum = async (curriculum_code: string, academic_year_code: string) => {
    const result = await getListAcademicYearsSchedulesForCurriculum(curriculum_code, academic_year_code);
    if (result.code === 'success') {
      setScheduleList(result.data.body);
    }
  };

  const fetchUEListPerCurriculum = async (curriculum_code: string) => {
    const result = await getUEListPerCurriculum(curriculum_code);
    if (result.code === 'success') {
      setUEList(result.data.body);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    reset();
    onOpenChange(false);
  };

  const handleSubmitForm = async (data: IUpdateSessionForm) => {
    // Validation finale avant soumission
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);

    if (end < start) {
      setError('end_time', {
        type: 'manual',
        message: 'La date/heure de fin doit être postérieure à la date/heure de début'
      });
      return;
    }

    const result = await onSave({ resource_code: data.resource_code, session_title: data.session_title });
    if (result) {
      reset();
      onOpenChange(false);
    }
  };

  const handleCancelSessionClick = async () => {
    await onCancelSession();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl md:min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2 mb-2">
          <DialogTitle>Mettre à jour la session</DialogTitle>
          <DialogDescription>Modifiez les informations de la session</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-2 gap-4">
          {/* Curriculum - READ ONLY */}
          <div className="space-y-1 col-span-2">
            <Label>
              Curriculum <span className="text-red-600">*</span>
            </Label>
            <Controller
              name="curriculum_code"
              control={control}
              rules={{ required: "Curriculum requis" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled>
                  <SelectTrigger className="w-full bg-muted">
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
              )}
            />
            {errors.curriculum_code && (
              <p className="text-red-600 text-sm">{errors.curriculum_code.message}</p>
            )}
          </div>

          {/* Unité d'enseignement */}
          <div className="space-y-1 col-span-2">
            <Label>
              Unité d&apos;enseignement <span className="text-red-600">*</span>
            </Label>
            <Controller
              name="course_unit_code"
              control={control}
              rules={{ required: "UE requise" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || UEList.length === 0}>
                  <SelectTrigger className={errors.course_unit_code ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Sélectionner une UE" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {UEList.map((ue) => (
                      <SelectItem key={ue.course_unit_code} value={ue.course_unit_code}>
                        {ue.course_unit_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.course_unit_code && (
              <p className="text-red-600 text-sm">{errors.course_unit_code.message}</p>
            )}
          </div>

          {/* Schedule code */}
          <div className="space-y-1">
            <Label>Semestre/Trimestre</Label>
            <Controller
              name="schedule_code"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || scheduleList.length === 0}>
                  <SelectTrigger className={errors.schedule_code ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Sélectionner une séquence" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {scheduleList.map((ays) => (
                      <SelectItem key={ays.schedule_code} value={ays.schedule_code}>
                        {ays.sequence_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Enseignant */}
          <div className="space-y-1">
            <Label>Enseignant</Label>
            <Controller
              name="teacher_user_code"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                  <SelectTrigger className={errors.teacher_user_code ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Sélectionner un enseignant" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {teacherList.map((t) => (
                      <SelectItem key={t.user_code} value={t.user_code}>
                        {t.first_name} {t.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Salle */}
          <div className="space-y-1">
            <Label>Salle <span className="text-red-600">*</span></Label>
            <Controller
              name="resource_code"
              control={control}
              rules={{ required: "Salle requise" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                  <SelectTrigger className={errors.resource_code ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Sélectionner une salle" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {classrooms.map((c) => (
                      <SelectItem key={c.resource_code} value={c.resource_code}>
                        {c.resource_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.resource_code && (
              <p className="text-red-600 text-sm">{errors.resource_code.message}</p>
            )}
          </div>

          {/* Titre */}
          <div className="space-y-1 col-span-2">
            <Label>Titre de la session <span className="text-red-600">*</span></Label>
            <Input
              {...register("session_title", { required: "Champ requis" })}
              disabled={isSubmitting}
              className={errors.session_title ? "border-red-500" : ""}
            />
            {errors.session_title && (
              <p className="text-red-600 text-sm">{errors.session_title.message}</p>
            )}
          </div>

          {/* Start / End Time */}
          <div className="space-y-1 col-span-2">
            <Label>Début de la session</Label>
            <Controller
              control={control}
              name="start_time"
              rules={{ required: "Heure de début requise" }}
              render={({ field }) => {
                const [date, time] = field.value
                  ? [new Date(field.value), field.value.split("T")[1]]
                  : [undefined, "10:30:00"];
                return (
                  <DateTimePicker
                    date={date}
                    time={time}
                    onDateChange={(d) => {
                      if (!d) return;
                      field.onChange(`${d.toISOString().split("T")[0]}T${time || "00:00:00"}`);
                    }}
                    onTimeChange={(t) => {
                      if (!date) return;
                      field.onChange(`${date.toISOString().split("T")[0]}T${t}`);
                    }}
                  />
                );
              }}
            />
            {errors.start_time && <p className="text-red-600 text-sm">{errors.start_time.message}</p>}
          </div>

          <div className="space-y-1 col-span-2">
            <Label>Fin de la session</Label>
            <Controller
              control={control}
              name="end_time"
              rules={{ required: "Heure de fin requise" }}
              render={({ field }) => {
                const [date, time] = field.value
                  ? [new Date(field.value), field.value.split("T")[1]]
                  : [undefined, "11:30:00"];
                return (
                  <DateTimePicker
                    date={date}
                    time={time}
                    onDateChange={(d) => {
                      if (!d) return;
                      field.onChange(`${d.toISOString().split("T")[0]}T${time || "00:00:00"}`);
                    }}
                    onTimeChange={(t) => {
                      if (!date) return;
                      field.onChange(`${date.toISOString().split("T")[0]}T${t}`);
                    }}
                  />
                );
              }}
            />
            {errors.end_time && <p className="text-red-600 text-sm">{errors.end_time.message}</p>}
          </div>

          {/* Footer */}
          <DialogFooter className="col-span-2 flex justify-between">
            <div className="space-x-2">
              <Button variant="outline" type="button" onClick={handleCancel} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} variant={'info'}>
                {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
            <Button variant={"secondary"} type="button" onClick={handleCancelSessionClick} disabled={isSubmitting}>
              Annuler la session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
