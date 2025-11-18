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
import { Input as SInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUpdateStudentApplication } from "@/types/staffType";
import { useFactorizedProgramStore } from "@/store/programStore";
import { Combobox } from "@/components/ui/Combobox";
import { useEffect } from "react";
import { Save } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";

interface IApplicationWithCode extends IUpdateStudentApplication {
  application_code: string;
}

interface DialogUpdateEnrollmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: IApplicationWithCode | null;
  onSave: (data: IUpdateStudentApplication, application_code: string) => Promise<boolean>;
}

export function DialogUpdateEnrollment({
  open,
  onOpenChange,
  application,
  onSave,
}: DialogUpdateEnrollmentProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IUpdateStudentApplication>({
    defaultValues: {
      first_name: "",
      last_name: "",
      place_of_birth: "",
      date_of_birth: "",
      phone_number: "",
      student_number: "",
      gender: undefined,
      curriculum_code: "",
    },
  });

  const { factorizedPrograms } = useFactorizedProgramStore();
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

  // Update form values when application changes
  useEffect(() => {
    if (application) {
      reset({
        first_name: application.first_name,
        last_name: application.last_name,
        place_of_birth: application.place_of_birth,
        date_of_birth: application.date_of_birth,
        phone_number: application.phone_number,
        student_number: application.student_number,
        gender: application.gender,
        curriculum_code: application.curriculum_code,
      });
    }
  }, [application, reset]);

  const onSubmit = async (data: IUpdateStudentApplication) => {
    if (!application) return;

    const isSuccess = await onSave(data, application.application_code);
    if (isSuccess) {
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-left text-2xl font-bold text-slate-900">Modifier l&apos;inscription</DialogTitle>
          <DialogDescription className="text-left text-sm text-slate-500 mt-1">
            Modifiez les informations de l&apos;étudiant ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
            {/* Section: Informations personnelles */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Prénom */}
                <div className="space-y-1.5">
                  <Label htmlFor="first_name" className="font-medium text-gray-600">
                    Prénom <span className="text-red-500">*</span>
                  </Label>
                  <SInput
                    id="first_name"
                    {...register("first_name", { required: "Le prénom est requis" })}
                    disabled={isSubmitting}
                    className={errors.first_name ? "border-red-500 h-9" : "h-9"}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                  )}
                </div>

                {/* Nom */}
                <div className="space-y-1.5">
                  <Label htmlFor="last_name" className="font-medium text-gray-600">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <SInput
                    id="last_name"
                    {...register("last_name", { required: "Le nom est requis" })}
                    disabled={isSubmitting}
                    className={errors.last_name ? "border-red-500 h-9" : "h-9"}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                  )}
                </div>

                {/* Genre */}
                <div className="space-y-1.5">
                  <Label className="font-medium text-gray-600">
                    Genre <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Le genre est requis" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                        <SelectTrigger className={errors.gender ? "border-red-500 h-9 w-full" : "h-9 w-full"}>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Masculin</SelectItem>
                          <SelectItem value="FEMALE">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender.message}</p>
                  )}
                </div>

                {/* Matricule */}
                <div className="space-y-1.5">
                  <Label htmlFor="student_number" className="font-medium text-gray-600">
                    Matricule <span className="text-red-500">*</span>
                  </Label>
                  <SInput
                    id="student_number"
                    {...register("student_number", { required: "Le Matricule est requis" })}
                    disabled={isSubmitting}
                    className={errors.student_number ? "border-red-500 h-9" : "h-9"}
                  />
                  {errors.student_number && (
                    <p className="text-red-500 text-sm">{errors.student_number.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Lieu et date de naissance */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="place_of_birth" className="font-medium text-gray-600">
                    Lieu de naissance <span className="text-red-500">*</span>
                  </Label>
                  <SInput
                    id="place_of_birth"
                    placeholder="Ville de naissance"
                    {...register("place_of_birth", { required: "Le lieu de naissance est obligatoire" })}
                    disabled={isSubmitting}
                    className={errors.place_of_birth ? "border-red-500 h-9" : "h-9"}
                  />
                  {errors.place_of_birth && (
                    <p className="text-red-500 text-sm">{errors.place_of_birth.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="font-medium text-gray-600">
                    Date de naissance <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="date_of_birth"
                    control={control}
                    rules={{ required: "La date de naissance est obligatoire" }}
                    render={({ field }) => (
                      <DatePicker
                        label=""
                        selected={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          if (date) {
                            // Format to ISO string (YYYY-MM-DD)
                            const isoDate = date.toISOString().split('T')[0];
                            field.onChange(isoDate);
                          } else {
                            field.onChange("");
                          }
                        }}
                        maxDate={new Date()}
                        minDate={new Date(1900, 0, 1)}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Coordonnées */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone_number" className="font-medium text-gray-600">
                    Téléphone
                  </Label>
                  <SInput
                    id="phone_number"
                    type="tel"
                    placeholder="+237..."
                    {...register("phone_number")}
                    disabled={isSubmitting}
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Section: Informations académiques */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-medium text-gray-600">
                    Curriculum <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="curriculum_code"
                    control={control}
                    rules={{ required: "Le Curriculum est requis" }}
                    render={({ field }) => (
                      <Combobox
                        options={curriculumList.map(item => ({
                          value: item.curriculum_code,
                          label: item.curriculum_name
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Sélectionner le Curriculum"
                      />
                    )}
                  />
                  {errors.curriculum_code && (
                    <p className="text-red-500 text-sm">{errors.curriculum_code.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 md:p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-3 justify-between">
              <Button
                variant="outline"
                type="button" onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="info"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
