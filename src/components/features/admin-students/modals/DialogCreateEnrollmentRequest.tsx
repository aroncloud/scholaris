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
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<IInitiateStudentApplication>({
    defaultValues: {
      curriculum_code: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      student_number: "",
      gender: "MALE",
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle demande d&apos;inscription</DialogTitle>
          <DialogDescription>
            Créer une nouvelle demande d&apos;inscription étudiant
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Prénom + Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                placeholder="Prénom"
                {...register("first_name", { required: "Le prénom est obligatoire" })}
              />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                placeholder="Nom de famille"
                {...register("last_name", { required: "Le nom est obligatoire" })}
              />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Matricule */}
            <div className="space-y-2">
              <Label htmlFor="student_number">Matricule *</Label>
              <Input
                id="student_number"
                placeholder="MA-2025-08-13-0008"
                {...register("student_number", { required: "Matricule obligatoire" })}
              />
              {errors.student_number && <p className="text-red-500 text-sm">{errors.student_number.message}</p>}
            </div>


            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                {...register("email", { required: "L'email est obligatoire" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </div>
          {/* Téléphone + Genre */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Téléphone *</Label>
              <Input
                id="phone_number"
                placeholder="+237..."
                {...register("phone_number", { required: "Le téléphone est obligatoire" })}
              />
              {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Genre *</Label>
              <Select
                defaultValue="MALE"
                onValueChange={(value) => setValue("gender", value as "MALE" | "FEMALE")}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Sélectionner le genre" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  <SelectItem value="MALE">Masculin</SelectItem>
                  <SelectItem value="FEMALE">Féminin</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>
          </div>
          {/* Curriculum */}
          <div >
            <div>
              <Label htmlFor="curriculum_code">Curriculum *</Label>
              <Controller
                  name="curriculum_code"
                  control={control}
                  render={({ field }) => (
                  <Combobox
                      options={curriculumList.map(item => {
                        return {
                          value: item.curriculum_code,
                          label: `${item.curriculum_name}`
                        }
                      })}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Sélectionner le statut"
                      className='py-5'
                  />
                )}
              />
              
              {errors.curriculum_code && <p className="text-red-500 text-sm">{errors.curriculum_code.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Création..." : "Créer la demande"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEnrollmentDialog;