"use client";

import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { IFullCalendarEvent } from "@/components/features/planification/Calendar/CalendarPlanification";
import { useClassroomStore } from "@/store/useClassroomStore";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useTeacherStore } from "@/store/useTeacherStore";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { getListAcademicYearsSchedulesForCurriculum, getUEListPerCurriculum } from "@/actions/programsAction";
import { IGetAcademicYearsSchedulesForCurriculum } from "@/types/planificationType";
import { IGetUECurriculum, IUpdateSessionForm } from "@/types/programTypes";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Combobox } from "@/components/ui/Combobox";


interface DialogUpdateSessionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: IUpdateSessionForm) => Promise<boolean>;
  onCancelSession: () => Promise<boolean>;
  eventData: IFullCalendarEvent | null;
}

// Helper: Parse ISO datetime to time string (HH:mm:ss)
const parseTime = (isoString: string | undefined, defaultTime: string): string => {
  if (!isoString) return defaultTime;
  const timePart = isoString.split("T")[1];
  return timePart ? timePart.replace(/\..*$/, '') : defaultTime;
};

// Helper: Create datetime string from date and time
const createDateTime = (date: Date | undefined, time: string): string => {
  if (!date) return "";
  return `${date.toISOString().split("T")[0]}T${time || "00:00:00"}`;
};

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

  const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);
  const [UEList, setUEList] = useState<IGetUECurriculum[]>([]);
  const [isCanceling, setIsCanceling] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IUpdateSessionForm>();

  const [curriculumCode, startTime, endTime] = watch(["curriculum_code", "start_time", "end_time"]);
  const isDisabled = isSubmitting || isCanceling;
  const currentAcademicYear = getCurrentAcademicYear();

  // Memoize curriculum list
  const curriculumList = useMemo(() =>
    factorizedPrograms.flatMap((fp) => fp.curriculums),
    [factorizedPrograms]
  );

  // Fetch functions with useCallback
  const fetchSchedules = useCallback(async (curriculum: string, academicYear: string) => {
    const result = await getListAcademicYearsSchedulesForCurriculum(curriculum, academicYear);
    if (result.code === 'success') setScheduleList(result.data.body);
  }, []);

  const fetchUEList = useCallback(async (curriculum: string) => {
    const result = await getUEListPerCurriculum(curriculum);
    if (result.code === 'success') setUEList(result.data.body);
  }, []);

  // Load event data
  useEffect(() => {
    if (!open || !eventData) return;

    const props = eventData.extendedProps || {};
    reset({
      curriculum_code: props.curriculum_code ?? "",
      course_unit_code: props.course_unit_code ?? "",
      schedule_code: props.schedule_code ?? "",
      teacher_user_code: props.teacher_user_code ?? "",
      resource_code: props.resource_code ?? "",
      session_title: eventData.title ?? "",
      start_time: eventData.start ?? "",
      end_time: eventData.end ?? "",
      academic_year_code: currentAcademicYear?.academic_year_code ?? "",
    });
  }, [open, eventData, reset, currentAcademicYear]);

  // Load dependent data
  useEffect(() => {
    if (open && curriculumCode) {
      fetchUEList(curriculumCode);
      if (currentAcademicYear?.academic_year_code) {
        fetchSchedules(curriculumCode, currentAcademicYear.academic_year_code);
      }
    }
  }, [open, curriculumCode, currentAcademicYear, fetchUEList, fetchSchedules]);

  // Validate time range
  useEffect(() => {
    if (!startTime || !endTime) return;

    if (new Date(endTime) < new Date(startTime)) {
      setError('end_time', {
        type: 'manual',
        message: 'La date/heure de fin doit être postérieure à la date/heure de début'
      });
    } else {
      clearErrors('end_time');
    }
  }, [startTime, endTime, setError, clearErrors]);

  const handleCancel = useCallback(() => {
    if (isDisabled) return;
    reset();
    setIsCanceling(false);
    onOpenChange(false);
  }, [isDisabled, reset, onOpenChange]);

  const handleSubmitForm = useCallback(async (data: IUpdateSessionForm) => {
    if (new Date(data.end_time) < new Date(data.start_time)) {
      setError('end_time', {
        type: 'manual',
        message: 'La date/heure de fin doit être postérieure à la date/heure de début'
      });
      return;
    }

    const success = await onSave(data);

    if (success) {
      reset();
      onOpenChange(false);
    }
  }, [onSave, reset, onOpenChange, setError]);

  const handleCancelSessionClick = useCallback(async () => {
    setIsCanceling(true);
    try {
      const success = await onCancelSession();
      if (success) {
        reset();
        onOpenChange(false);
      }
    } finally {
      setIsCanceling(false);
    }
  }, [onCancelSession, reset, onOpenChange]);

  // Reusable field wrapper
  const FieldWrapper = ({ label, required, children, error }: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    error?: string;
  }) => (
    <div className="space-y-1">
      <Label>
        {label} {required && <span className="text-red-600">*</span>}
      </Label>
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl md:min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2 mb-2">
          <DialogTitle>Mettre à jour la session</DialogTitle>
          <DialogDescription>Modifiez les informations de la session</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-2 gap-4 relative">
          {isCanceling && (
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-50 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Annulation de la session...
                </p>
              </div>
            </div>
          )}

          {/* Curriculum (READ ONLY) */}
          <div className="col-span-2">
            <FieldWrapper label="Curriculum" required error={errors.curriculum_code?.message}>
              <Controller
                name="curriculum_code"
                control={control}
                rules={{ required: "Curriculum requis" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled>
                    <SelectTrigger className="w-full bg-muted">
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
                )}
              />
            </FieldWrapper>
          </div>

          {/* UE */}
          <div className="col-span-2">
            <FieldWrapper label="Unité d'enseignement" required error={errors.course_unit_code?.message}>
              <Controller
                name="course_unit_code"
                control={control}
                rules={{ required: "UE requise" }}
                render={({ field }) => (
                  <Combobox
                    options={UEList.map(ue => ({ 
                        value: ue.course_unit_code, 
                        label: ue.course_unit_name
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Sélectionner un cours"
                    className='py-5'
                  />
                )}
              />
            </FieldWrapper>
          </div>

          {/* Schedule & Teacher */}
          <FieldWrapper label="Semestre/Trimestre">
            <Controller
              name="schedule_code"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isDisabled || !scheduleList.length}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une séquence" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {scheduleList.map((s) => (
                      <SelectItem key={s.schedule_code} value={s.schedule_code}>
                        {s.sequence_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldWrapper>

          <FieldWrapper label="Enseignant">
            <Controller
              name="teacher_user_code"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isDisabled}>
                  <SelectTrigger className="w-full">
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
          </FieldWrapper>

          {/* Classroom */}
          <FieldWrapper label="Salle" required error={errors.resource_code?.message}>
            <Controller
              name="resource_code"
              control={control}
              rules={{ required: "Salle requise" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isDisabled}>
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
          </FieldWrapper>

          {/* Title */}
          <div>
            <FieldWrapper label="Titre de la session" required error={errors.session_title?.message}>
              <Input
                {...register("session_title", { required: "Champ requis" })}
                disabled={isDisabled}
                className={errors.session_title ? "border-red-500" : ""}
              />
            </FieldWrapper>
          </div>

          {/* Date/Time fields */}
          {["start_time", "end_time"].map((fieldName, idx) => (
            <div key={fieldName} className="col-span-2">
              <FieldWrapper
                label={idx === 0 ? "Début de la session" : "Fin de la session"}
                error={errors[fieldName as keyof typeof errors]?.message}
              >
                <Controller
                  control={control}
                  name={fieldName as "start_time" | "end_time"}
                  rules={{ required: `Heure de ${idx === 0 ? 'début' : 'fin'} requise` }}
                  render={({ field }) => {
                    const date = field.value ? new Date(field.value) : undefined;
                    const time = parseTime(field.value, idx === 0 ? "10:30:00" : "11:30:00");

                    return (
                      <DateTimePicker
                        date={date}
                        time={time}
                        disabled={isDisabled}
                        onDateChange={(d) => d && field.onChange(createDateTime(d, time))}
                        onTimeChange={(t) => date && field.onChange(createDateTime(date, t))}
                      />
                    );
                  }}
                />
              </FieldWrapper>
            </div>
          ))}

          {/* Footer */}
          <DialogFooter className="col-span-2 flex justify-between border-t pt-5 mt-1">
            <div className="space-x-2">
              <Button variant="outline" type="button" onClick={handleCancel} disabled={isDisabled}>
                Annuler
              </Button>
              <Button type="submit" disabled={isDisabled} variant="info">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
            <Button variant="danger" type="button" onClick={handleCancelSessionClick} disabled={isDisabled}>
               {isCanceling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCanceling ? "Annulation..." : "Annuler la session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
