'use client'

import React, { useState } from 'react';
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
import { Controller, useForm } from "react-hook-form";
import { showToast } from "@/components/ui/showToast";

import { initiateStudentApplication } from "@/actions/studentAction";
import { useFactorizedProgramStore } from '@/store/programStore';
import { IInitiateStudentApplication } from "@/types/staffType";
import { Combobox } from '@/components/ui/Combobox';
import { Save } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';

interface CreateEnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateEnrollmentDialog: React.FC<CreateEnrollmentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { factorizedPrograms } = useFactorizedProgramStore();
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

  // ✅ React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IInitiateStudentApplication>({
    defaultValues: {
      first_name: "",
      last_name: "",
      place_of_birth: "",
      date_of_birth: "",
      curriculum_code: "",
      email: "",
      phone_number: "",
      student_number: "",
      gender: undefined,
    },
  });

  const onSubmit = async (data: IInitiateStudentApplication) => {
    setIsLoading(true);
    try {
      const result = await initiateStudentApplication(data);

      if (result.code === 'success') {
        showToast({
          variant: 'success-solid',
          message: 'Succès',
          description: "Demande d'inscription créée avec succès"
        });
        onOpenChange(false);
        reset();
        onSuccess?.();
      } else {
        showToast({
          variant: 'error-solid',
          message: 'error',
          description: "Erreur lors de la création de la demande"
          // description: result.error
        });
      }
    } catch (error) {
      showToast({
        variant: 'error-solid',
        message: 'error',
        description: "Une erreur inattendue s'est produite"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900">Nouvelle demande d&apos;inscription</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Créer une nouvelle demande d&apos;inscription étudiant
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  placeholder="Prénom"
                  {...register("first_name", { required: "Le prénom est obligatoire" })}
                />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last_name"
                  placeholder="Nom de famille"
                  {...register("last_name", { required: "Le nom est obligatoire" })}
                />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Lieu de naissance + Date de naissance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="place_of_birth">
                  Lieu de naissance <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="place_of_birth"
                  placeholder="Ville de naissance"
                  {...register("place_of_birth", { required: "Le lieu de naissance est obligatoire" })}
                />
                {errors.place_of_birth && <p className="text-red-500 text-sm">{errors.place_of_birth.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">
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
                    />
                  )}
                />
                {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>}
              </div>
            </div>

            {/* Matricule + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_number">Matricule</Label>
                <Input
                  id="student_number"
                  placeholder="MA-2025-08-13-0008"
                  {...register("student_number")}
                />
                {errors.student_number && <p className="text-red-500 text-sm">{errors.student_number.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
            </div>

            {/* Téléphone + Genre */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Téléphone</Label>
                <Input
                  id="phone_number"
                  placeholder="+237..."
                  {...register("phone_number")}
                />
                {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Genre</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as "MALE" | "FEMALE")}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Sélectionner le genre" />
                      </SelectTrigger>
                      <SelectContent className='w-full'>
                        <SelectItem value="MALE">Masculin</SelectItem>
                        <SelectItem value="FEMALE">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-2">
              <Label htmlFor="curriculum_code">Curriculum</Label>
              <Controller
                name="curriculum_code"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={curriculumList.map(item => ({
                      value: item.curriculum_code,
                      label: `${item.curriculum_name} - ${item.study_level}`
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Sélectionner un curriculum"
                    className='py-5'
                  />
                )}
              />
              {errors.curriculum_code && <p className="text-red-500 text-sm">{errors.curriculum_code.message}</p>}
            </div>
          </form>
        </div>

        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Création..." : "Créer la demande"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEnrollmentDialog;