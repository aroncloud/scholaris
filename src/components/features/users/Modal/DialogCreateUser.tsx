/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IHireExistingStaff } from "@/types/userType";
import { User, Briefcase, Lock, ChevronRight, Save, ChevronLeft } from "lucide-react";
import { MARITAl_STATUS } from "@/constant";
import { DatePicker } from "@/components/DatePicker";
import { useConfigStore } from "@/lib/store/configStore";
import { Combobox } from "@/components/ui/Combobox";

interface DialogCreateUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: IHireExistingStaff) => Promise<boolean>;
}

const STEPS = [
  { id: 1, title: "Informations personnelles", icon: User },
  { id: 2, title: "Informations professionnelles", icon: Briefcase },
  { id: 3, title: "Sécurité", icon: Lock },
];

export function DialogCreateUser({ open, onOpenChange, onSave }: DialogCreateUserProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getEthnicities } = useConfigStore();
  const ethnicities = getEthnicities();

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm<IHireExistingStaff>();

  const onSubmit = async (data: IHireExistingStaff) => {
    console.log("-->data", data)
    setIsSubmitting(true);
    try {
      const success = await onSave(data);

      if (success) {
        reset();
        setCurrentStep(1);
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setCurrentStep(1);
    onOpenChange(false);
  };

  const validateStep = () => {
    const values = watch();
    if (currentStep === 1) {
      return values.first_name && values.last_name && values.gender && values.email && values.phone_number;
    }
    if (currentStep === 2) {
      return values.job_title && values.hiring_date && values.salary;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label>Prénom <span className="text-red-500">*</span></Label>
              <Input {...register("first_name", { required: true })} placeholder="Jean" disabled={isSubmitting} />
              {errors.first_name && <p className="text-xs text-red-500">Prénom requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Nom <span className="text-red-500">*</span></Label>
              <Input {...register("last_name", { required: true })} placeholder="Dupont" disabled={isSubmitting} />
              {errors.last_name && <p className="text-xs text-red-500">Nom requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Genre <span className="text-red-500">*</span></Label>
              <Select onValueChange={(value) => setValue("gender", value as any)} disabled={isSubmitting}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="MALE">Masculin</SelectItem>
                  <SelectItem value="FEMALE">Féminin</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-red-500">Genre requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Controller
                control={control}
                name="date_of_birth"
                render={({ field }) => (
                  <DatePicker
                    label=""
                    disabled={isSubmitting} 
                    selected={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        field.onChange(`${year}-${month}-${day}`);
                      } else {
                        field.onChange(undefined);
                      }
                    }}
                  />
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input type="email" {...register("email", { required: true })} placeholder="user@efspa.edu" disabled={isSubmitting} />
              {errors.email && <p className="text-xs text-red-500">Email requis</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Email secondaire</Label>
              <Input type="email" {...register("other_email")} placeholder="autre@email.com" disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label>Téléphone <span className="text-red-500">*</span></Label>
              <Input {...register("phone_number", { required: true })} placeholder="+237 6 77 12 34 00" disabled={isSubmitting} />
              {errors.phone_number && <p className="text-xs text-red-500">Téléphone requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Téléphone secondaire</Label>
              <Input {...register("other_phone")} placeholder="+237 6 99 88 77 66" disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label>Statut marital</Label>
              <Select onValueChange={(value) => setValue("marital_status_code", value)} disabled={isSubmitting}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {MARITAl_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lieu de naissance</Label>
              <Input {...register("place_of_birth")} placeholder="Yaoundé" disabled={isSubmitting} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label>Titre du poste <span className="text-red-500">*</span></Label>
              <Input {...register("job_title", { required: true })} placeholder="Administrateur système" disabled={isSubmitting} />
              {errors.job_title && <p className="text-xs text-red-500">Titre requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Département</Label>
              <Input {...register("department")} placeholder="Ressources Humaines" disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label>Date d&apos;embauche <span className="text-red-500">*</span></Label>
              <Controller
                control={control}
                name="hiring_date"
                rules={{ required: "Date d'embauche requise" }}
                render={({ field }) => (
                  <DatePicker
                    label=""
                    disabled={isSubmitting}
                    selected={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        field.onChange(`${year}-${month}-${day}`);
                      } else {
                        field.onChange(undefined);
                      }
                    }}
                  />
                )}
              />
              {errors.hiring_date && <p className="text-xs text-red-500">{errors.hiring_date.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Salaire mensuel (FCFA) <span className="text-red-500">*</span></Label>
              <Input type="number" {...register("salary", { required: true, valueAsNumber: true })} placeholder="150000" disabled={isSubmitting} />
              {errors.salary && <p className="text-xs text-red-500">Salaire requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Numéro CNI</Label>
              <Input {...register("cni_number")} placeholder="123456789" disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label>Date de délivrance CNI</Label>
              <Controller
                control={control}
                name="cni_issue_date"
                render={({ field }) => (
                  <DatePicker
                    label=""
                    selected={field.value ? new Date(field.value) : undefined}
                    disabled={isSubmitting}
                    onChange={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        field.onChange(`${year}-${month}-${day}`);
                      } else {
                        field.onChange(undefined);
                      }
                    }}
                  />
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Lieu de délivrance CNI</Label>
              <Input {...register("cni_issue_location")} placeholder="Yaoundé" disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label>Ethnie</Label>
              <Controller
                name="ethnicity_code"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={ethnicities.map(eth => ({
                      value: eth.ethnicity_code,
                      label: eth.ethnicity_name
                    }))}
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    placeholder="Sélectionner une ethnie"
                    className='py-5'
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Ville</Label>
              <Input {...register("city")} placeholder="Yaoundé" disabled={isSubmitting} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Adresse de résidence</Label>
              <Input {...register("address_details")} placeholder="Quartier Bastos" disabled={isSubmitting} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>URL Avatar</Label>
              <Input {...register("avatar_url")} placeholder="https://exemple.com/avatar.jpg" />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-800">Choisissez un mot de passe sécurisé. L&apos;utilisateur pourra le modifier après sa première connexion.</p>
            </div>
            <div className="space-y-2">
              <Label>Mot de passe <span className="text-red-500">*</span></Label>
              <Input type="password" {...register("password_plaintext", { required: true, minLength: 8 })} placeholder="Minimum 8 caractères" disabled={isSubmitting} />
              {errors.password_plaintext && <p className="text-xs text-red-500">Mot de passe requis (min. 8 caractères)</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-2xl lg:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* HEADER */}
        <DialogHeader className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 shrink-0">
          <DialogTitle className="text-left text-xl sm:text-2xl font-bold text-slate-900">
            Créer un nouvel utilisateur
          </DialogTitle>
          <DialogDescription className="text-left text-xs sm:text-sm text-slate-500 mt-1">
            Étape {currentStep} sur {STEPS.length}
          </DialogDescription>
        </DialogHeader>

        {/* MAIN CONTENT WITH SCROLL */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-2">
              {renderStepContent()}
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <DialogFooter className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 shrink-0">
          {/* Version Mobile */}
          <div className="sm:hidden w-full space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                variant="outline"
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex-1 text-center">
                <p className="text-xs text-slate-600">
                  Étape {currentStep}/{STEPS.length}
                </p>
              </div>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!validateStep()}
                  variant="outline-info"
                  className="flex-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  variant="info"
                  className="flex-1"
                >
                  <Save className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full"
            >
              Annuler
            </Button>
          </div>

          {/* Version Desktop */}
          <div className="hidden sm:flex items-center justify-between w-full">
            <p className="text-sm text-slate-600">
              Étape {currentStep}/{STEPS.length}
            </p>

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
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                variant="outline"
              >
                <ChevronLeft className="mr-2 w-4 h-4" />
                Précédent
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!validateStep()}
                  variant="outline-info"
                >
                  Suivant
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  variant="info"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Création..." : "Créer"}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}