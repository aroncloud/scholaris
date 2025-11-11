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
import Input from "@/components/form/input/InputField";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICreateStudent } from "@/types/staffType";
import { useFactorizedProgramStore } from "@/store/programStore";
import { Combobox } from "@/components/ui/Combobox";
import { useState } from "react";
import { EyeClosedIcon, EyeIcon, Save } from "lucide-react";

interface DialogCreateStudentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateStudent) => Promise<boolean>;
}

export function DialogCreateStudent({
  open,
  onOpenChange,
  onSave,
}: DialogCreateStudentProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ICreateStudent>({
    // --- Valeurs par défaut pour un formulaire de création vierge ---
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password_plaintext: "",
      student_number: "",
      gender: "FEMALE",
      curriculum_code: "",
      education_level_code: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const { factorizedPrograms } = useFactorizedProgramStore();
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

  const onSubmit = async (data: ICreateStudent) => {
    console.log('Dialog.data', data)
    const isSuccess = await onSave(data);
    if (isSuccess) {
      reset(); // Réinitialise le formulaire
      onOpenChange(false); // Ferme la modale
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
          {/* --- Titre fixe pour la création --- */}
          <DialogTitle className="text-2xl font-bold text-slate-900">Créer un nouvel étudiant</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Remplissez les informations ci-dessous pour créer un nouveau profil étudiant.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* SECTION: Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Prénom */}
              <div className="space-y-1">
                <Label htmlFor="first_name" className="font-medium text-gray-700">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <SInput
                  id="first_name"
                  {...register("first_name", { required: "Le prénom est requis" })}
                  disabled={isSubmitting}
                  className={errors.first_name ? "border-red-500 h-10" : "h-10"}
                />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
              </div>

              {/* Nom */}
              <div className="space-y-1">
                <Label htmlFor="last_name" className="font-medium text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <SInput
                  id="last_name"
                  {...register("last_name", { required: "Le nom est requis" })}
                  disabled={isSubmitting}
                  className={errors.last_name ? "border-red-500 h-10" : "h-10"}
                />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
              </div>

              {/* Genre */}
              <div className="space-y-1">
                <Label className="font-medium text-gray-700">
                  Genre <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Le genre est requis" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                      <SelectTrigger className={errors.gender ? "border-red-500 h-10 w-full" : "h-10 w-full"}>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Masculin</SelectItem>
                        <SelectItem value="FEMALE">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>

              {/* Matricule */}
              <div className="space-y-1">
                <Label htmlFor="student_number" className="font-medium text-gray-700">
                  Matricule <span className="text-red-500">*</span>
                </Label>
                <SInput
                  id="student_number"
                  {...register("student_number", { required: "Le Matricule est requis" })}
                  disabled={isSubmitting}
                  className={errors.student_number ? "border-red-500 h-10" : "h-10"}
                />
                {errors.student_number && <p className="text-red-500 text-sm">{errors.student_number.message}</p>}
              </div>

            </div>

            {/* SECTION: Coordonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Email */}
              <div className="space-y-1">
                <Label>Email <span className="text-red-500">*</span></Label>
                <SInput
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email requis",
                    pattern: { value: /^\S+@\S+$/i, message: "Email invalide" }
                  })}
                  className={errors.email ? "border-red-500 h-10" : "h-10"}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/* Téléphone */}
              <div className="space-y-1">
                <Label>Téléphone</Label>
                <SInput id="phone_number" type="tel" {...register("phone_number")} className="h-10" />
              </div>

            </div>

            {/* SECTION: Informations académiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SECTION: Sécurité */}
              <div className="space-y-1">
                <Label htmlFor="password_plaintext" className="font-medium text-gray-700">
                  Mot de passe <span className="text-red-500">*</span>
                </Label>

                <div className="relative">
                  <Controller
                    name="password_plaintext"
                    control={control}
                    rules={{
                      required: "Le mot de passe est requis",
                      minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" }
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        error={!!errors.password_plaintext}
                        className="h-10"
                      />
                    )}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="text-gray-600 h-5" />
                    ) : (
                      <EyeClosedIcon className="text-gray-400 h-5" />
                    )}
                  </span>
                </div>

                {errors.password_plaintext && (
                  <p className="text-red-500 text-sm">{errors.password_plaintext.message}</p>
                )}
              </div>

              {/* Diplôme d'entrée */}
              <div className="space-y-1">
                <Label>Diplôme d'entrée <span className="text-red-500">*</span></Label>
                <Controller
                  name="education_level_code"
                  control={control}
                  rules={{ required: "Diplôme d'entrée requis" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BACCALAUREAT">Baccalauréat</SelectItem>
                        <SelectItem value="LICENCE">Licence</SelectItem>
                        <SelectItem value="MASTER">Master</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.education_level_code && <p className="text-red-500 text-sm">{errors.education_level_code.message}</p>}
              </div>

            </div>

            {/* Niveau — FULL WIDTH */}
            <div className="space-y-1 md:col-span-2">
              <Label>Niveau <span className="text-red-500">*</span></Label>
              <Controller
                name="curriculum_code"
                control={control}
                rules={{ required: "Le niveau est requis" }}
                render={({ field }) => (
                  <Combobox
                    options={curriculumList.map(item => ({
                      value: item.curriculum_code,
                      label: item.curriculum_name
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Sélectionner le niveau"
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
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            {/* --- Bouton fixe pour la création --- */}
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="info"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Création en cours..." : "Créer l'étudiant"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}