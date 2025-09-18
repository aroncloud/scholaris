"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ICreateUser } from "@/types/staffType";
import { Loader2, CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ModalUserProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ICreateUser | null;
  action: "CREATE" | "UPDATE";
  roles?: { label: string; value: string }[];
  onSave: (formData: ICreateUser) => Promise<number | boolean | { code: string; [key: string]: any } | undefined>;
}

export default function ModalUser({ isOpen, onClose, initialData, action, onSave }: ModalUserProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [hiringDateOpen, setHiringDateOpen] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ICreateUser>({
    defaultValues: initialData || {
      user_code: "",
      password_plaintext: "",
      email: "",
      first_name: "",
      last_name: "",
      gender: "MALE",
      phone_number: "",
      staff_number: "",
      job_title: "",
      department: "",
      hiring_date: "",
      salary: 0,
      profiles: []
    },
  });

  useEffect(() => {
    reset(initialData || {
      user_code: "",
      password_plaintext: "",
      email: "",
      first_name: "",
      last_name: "",
      gender: "MALE",
      phone_number: "",
      staff_number: "",
      job_title: "",
      department: "",
      hiring_date: "",
      salary: 0,
      profiles: []
    });
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: ICreateUser) => {
    try {
      const result = await onSave(data);
      const isSuccess =
        result === 1 ||
        (typeof result === "object" && (result.code === "success" || result.status === 1 || result.status === "success"));

      if (isSuccess) {
        toast.success(action === "CREATE" ? "Utilisateur créé avec succès" : "Utilisateur mis à jour avec succès");
        onClose();
      } else {
        const errorMessage =
          typeof result === "object"
            ? result.message || result.error || "Une erreur est survenue"
            : typeof result === "string"
            ? result
            : "L'opération a échoué";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error(action === "CREATE" ? "Erreur lors de la création" : "Erreur lors de la mise à jour");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{action === "CREATE" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}</DialogTitle>
          <DialogDescription>
            {action === "CREATE" ? "Remplissez les champs pour créer un utilisateur." : "Modifiez les informations de l'utilisateur."}
          </DialogDescription>
        </DialogHeader>

        <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Informations personnelles */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Prénom <span className="text-red-500">*</span></Label>
                <Input {...register("first_name", { required: "Le prénom est requis" })} disabled={isSubmitting} />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Nom <span className="text-red-500">*</span></Label>
                <Input {...register("last_name", { required: "Le nom est requis" })} disabled={isSubmitting} />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Email <span className="text-red-500">*</span></Label>
                <Input {...register("email", { required: "Email requis", pattern: { value: /\S+@\S+\.\S+/, message: "Email invalide" } })} disabled={isSubmitting} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Genre</Label>
                <select {...register("gender")} disabled={isSubmitting} className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300">
                  <option value="MALE">Masculin</option>
                  <option value="FEMALE">Féminin</option>
                </select>
              </div>
              {action === "CREATE" && (
                <div className="space-y-1 relative">
                  <Label>Mot de passe <span className="text-red-500">*</span></Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password_plaintext", { required: "Mot de passe requis", minLength: { value: 8, message: "Au moins 8 caractères" } })}
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                  {errors.password_plaintext && <p className="text-red-500 text-sm">{errors.password_plaintext.message}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Informations professionnelles */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Informations professionnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Numéro de staff <span className="text-red-500">*</span></Label>
                <Input {...register("staff_number", { required: "Le numéro de staff est requis" })} disabled={isSubmitting} />
                {errors.staff_number && <p className="text-red-500 text-sm">{errors.staff_number.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Poste <span className="text-red-500">*</span></Label>
                <select {...register("job_title", { required: "Le poste est requis" })} disabled={isSubmitting} className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300">
                  <option value="">Sélectionnez un poste</option>
                  <option value="Formateur Clinique">Formateur Clinique</option>
                  <option value="Professeur de Sciences Infirmières">Professeur de Sciences Infirmières</option>
                  <option value="Chargé de Cours en Santé Publique">Chargé de Cours en Santé Publique</option>
                  <option value="Responsable Pédagogique">Responsable Pédagogique</option>
                  <option value="Coordinateur des Stages">Coordinateur des Stages</option>
                  <option value="Assistant de Recherche">Assistant de Recherche</option>
                </select>
                {errors.job_title && <p className="text-red-500 text-sm">{errors.job_title.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Département <span className="text-red-500">*</span></Label>
                <select {...register("department", { required: "Le département est requis" })} disabled={isSubmitting} className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300">
                  <option value="">Sélectionnez un département</option>
                  <option value="Sciences Infirmières">Sciences Infirmières</option>
                  <option value="Formation Clinique">Formation Clinique</option>
                  <option value="Techniques et Procédures Médicales">Techniques et Procédures Médicales</option>
                  <option value="Sciences Fondamentales">Sciences Fondamentales</option>
                  <option value="Santé Publique et Prévention">Santé Publique et Prévention</option>
                </select>
                {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
              </div>

              {/* Date d'embauche */}
              <div className="space-y-1">
                <Label>Date d&apos;embauche <span className="text-red-500">*</span></Label>
                <Controller
                  control={control}
                  name="hiring_date"
                  rules={{ required: "La date d'embauche est requise" }}
                  render={({ field }) => (
                    <Popover open={hiringDateOpen} onOpenChange={setHiringDateOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left" disabled={isSubmitting}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? new Date(field.value).toLocaleDateString("en-US") : "Sélectionner la date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (!date) return;
                            field.onChange(date.toISOString().split("T")[0]);
                            setHiringDateOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.hiring_date && <p className="text-red-500 text-sm">{errors.hiring_date.message}</p>}
              </div>

              {/* Salaire */}
              <div className="space-y-1">
                <Label>Salaire (FCFA) <span className="text-red-500">*</span></Label>
                <Input type="number" step={1000} {...register("salary", { required: "Salaire requis", min: { value: 1, message: "Doit être > 0" } })} disabled={isSubmitting} />
                {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> : null}
              {action === "CREATE" ? "Créer" : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
