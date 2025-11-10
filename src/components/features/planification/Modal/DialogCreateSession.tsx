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
import { ICreateSession, IGetAcademicYearsSchedulesForCurriculum } from "@/types/planificationType";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useTeacherStore } from "@/store/useTeacherStore";
import { useClassroomStore } from "@/store/useClassroomStore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { useEffect, useState } from "react";
import { getListAcademicYearsSchedulesForCurriculum, getUEListPerCurriculum } from "@/actions/programsAction";
import { IGetUECurriculum } from "@/types/programTypes";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Save } from "lucide-react";

interface DialogCreateSessionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: ICreateSession) => Promise<boolean>;
    curriculum_code: string;
}

export function DialogCreateSession({
    open,
    onOpenChange,
    onSave,
    curriculum_code
}: DialogCreateSessionProps) {
    const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);
    const [UEList, setUEList] = useState<IGetUECurriculum[]>([]);
    const { factorizedPrograms } = useFactorizedProgramStore();
    const { teacherList } = useTeacherStore();
    const { classrooms } = useClassroomStore();
    const { getCurrentAcademicYear } = useAcademicYearStore();
    const currentAcademicYear = getCurrentAcademicYear();
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<ICreateSession>({
        defaultValues: {
            course_unit_code: "",
            curriculum_code: curriculum_code,
            teacher_user_code: "",
            schedule_code: "",
            resource_code: "",
            session_title: "",
            start_time: "",
            end_time: "",
            academic_year_code: currentAcademicYear ? currentAcademicYear.academic_year_code : "",
        },
    });

    // Pré-remplir le formulaire lorsque le dialog s'ouvre
    useEffect(() => {
        if (open && curriculum_code) {
            const currentAcademicYear = getCurrentAcademicYear();
            setValue("curriculum_code", curriculum_code);
            setValue(
                "academic_year_code",
                currentAcademicYear ? currentAcademicYear.academic_year_code : ""
            );
        }
    }, [open, curriculum_code, getCurrentAcademicYear, setValue]);
    // Watch curriculum_code pour filtrer UEs et séquences
    const selectedCurriculum = useWatch({
        control,
        name: "curriculum_code",
    });

    const selectedUE = useWatch({
        control,
        name: "course_unit_code",
    });
    // Watch curriculum_code pour filtrer UEs et séquences
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


    useEffect(() => {
        if (selectedCurriculum) {
            fetchUEListPerCurriculum(selectedCurriculum)
        }
    }, [selectedCurriculum]);


    useEffect(() => {
        if (selectedUE) {
            setValue('session_title', UEList.find(ue => ue.course_unit_code === selectedUE)?.course_unit_name ?? '')
        }
    }, [UEList, selectedUE, setValue]);


    useEffect(() => {
        if (selectedCurriculum && selectedAcademicYear) {
            fetchListAcademicYearsSchedulesForCurriculum(selectedCurriculum, selectedAcademicYear);
        }
    }, [selectedAcademicYear, selectedCurriculum]);

    // Synchroniser la date de fin avec la date de début
    useEffect(() => {
        if (startTime) {
            const [startDate] = startTime.split('T');
            if (endTime) {
                const [, endTimeOnly] = endTime.split('T');
                setValue('end_time', `${startDate}T${endTimeOnly || '11:30:00'}`);
            } else {
                setValue('end_time', `${startDate}T11:30:00`);
            }
        }
    }, [startTime, setValue, endTime]);

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

    const onSubmit = async (data: ICreateSession) => {
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

        const result = await onSave(data);
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

    const fetchListAcademicYearsSchedulesForCurriculum = async (curriculum_code: string, academic_year_code: string) => {
        const result = await getListAcademicYearsSchedulesForCurriculum(curriculum_code, academic_year_code);
        setScheduleList(result.data.body)
    }

    const fetchUEListPerCurriculum = async (curriculum_code: string) => {
        const result = await getUEListPerCurriculum(curriculum_code);
        setUEList(result.data.body)
    }

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
                    <DialogTitle className="text-2xl font-bold text-slate-900">Créer une nouvelle session</DialogTitle>
                    <DialogDescription className="text-sm text-slate-500 mt-1">
                        Remplissez les informations de la session
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        {/* Curriculum */}
                        <div className="space-y-1 col-span-2">
                            <Label>
                                Curriculum <span className="text-red-600">*</span>
                            </Label>
                            <Controller
                                name="curriculum_code"
                                control={control}
                                rules={{ required: "Curriculum requis" }}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || !!curriculum_code}>
                                        <SelectTrigger className={errors.curriculum_code ? "border-red-500 w-full" : "w-full"}>
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

                        {/* Unité d’enseignement */}
                        <div className="space-y-1 col-span-2">
                            <Label>
                                Unité d&apos;enseignement <span className="text-red-600">*</span>
                            </Label>
                            <Controller
                                name="course_unit_code"
                                control={control}
                                rules={{ required: "UE requise" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isSubmitting || UEList.length == 0}
                                    >
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
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || scheduleList.length == 0}>
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
                            <Label>Salle</Label>
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
                            variant={"info"}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? "Création..." : "Créer la session"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
