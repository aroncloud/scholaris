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
import { User, Briefcase, Lock, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { MARITAl_STATUS } from "@/constant";
import { DatePicker } from "@/components/DatePicker";

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

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm<IHireExistingStaff>();

  const onSubmit = async (data: IHireExistingStaff) => {
    console.log("-->data", data)
    setIsSubmitting(true);
    try {
      // Add default staff_number value
      const payload = {
        ...data,
        staff_number: "123"
      };
      const success = await onSave(payload as any);

      // Only close and reset if successful
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prénom <span className="text-red-500">*</span></Label>
              <Input {...register("first_name", { required: true })} placeholder="Jean" />
              {errors.first_name && <p className="text-xs text-red-500">Prénom requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Nom <span className="text-red-500">*</span></Label>
              <Input {...register("last_name", { required: true })} placeholder="Dupont" />
              {errors.last_name && <p className="text-xs text-red-500">Nom requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Genre <span className="text-red-500">*</span></Label>
              <Select onValueChange={(value) => setValue("gender", value as any)}>
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
                    selected={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date.toISOString().split('T')[0]);
                      } else {
                        field.onChange(undefined);
                      }
                    }}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input type="email" {...register("email", { required: true })} placeholder="user@efspa.edu" />
              {errors.email && <p className="text-xs text-red-500">Email requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Téléphone <span className="text-red-500">*</span></Label>
              <Input {...register("phone_number", { required: true })} placeholder="+237 6 77 12 34 00" />
              {errors.phone_number && <p className="text-xs text-red-500">Téléphone requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Statut marital</Label>
              <Select onValueChange={(value) => setValue("marital_status_code", value)}>
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
              <Input {...register("place_of_birth")} placeholder="Yaoundé" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Titre du poste <span className="text-red-500">*</span></Label>
              <Input {...register("job_title", { required: true })} placeholder="Administrateur système" />
              {errors.job_title && <p className="text-xs text-red-500">Titre requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Département</Label>
              <Input {...register("department")} placeholder="Ressources Humaines" />
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
                    selected={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date.toISOString().split('T')[0]);
                      } else {
                        field.onChange(undefined);
                      }
                    }}
                  />
                )}
              />
              {errors.hiring_date && <p className="text-xs text-red-500">{errors.hiring_date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Salaire mensuel (FCFA) <span className="text-red-500">*</span></Label>
              <Input type="number" {...register("salary", { required: true, valueAsNumber: true })} placeholder="150000" />
              {errors.salary && <p className="text-xs text-red-500">Salaire requis</p>}
            </div>

            <div className="space-y-2">
              <Label>Numéro CNI</Label>
              <Input {...register("cni_number")} placeholder="123456789" />
            </div>

            <div className="space-y-2">
              <Label>Ville</Label>
              <Input {...register("city")} placeholder="Yaoundé" />
            </div>

            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input {...register("address_details")} placeholder="Quartier Bastos" />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">Choisissez un mot de passe sécurisé. L&apos;utilisateur pourra le modifier après sa première connexion.</p>
            </div>
            <div className="space-y-2">
              <Label>Mot de passe <span className="text-red-500">*</span></Label>
              <Input type="password" {...register("password_plaintext", { required: true, minLength: 8 })} placeholder="Minimum 8 caractères" />
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          <DialogDescription>Étape {currentStep} sur {STEPS.length}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-between mb-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? "border-blue-600 bg-blue-600 text-white" : isCompleted ? "border-green-600 bg-green-600 text-white" : "border-gray-300"}`}>
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <p className={`text-xs mt-2 ${isActive ? "text-blue-600 font-medium" : "text-gray-600"}`}>{step.title}</p>
                </div>
                {index < STEPS.length - 1 && <div className={`h-0.5 w-full ${isCompleted ? "bg-green-600" : "bg-gray-300"}`} />}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">{renderStepContent()}</div>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 1}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Précédent
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={handleCancel}>Annuler</Button>
              {currentStep < STEPS.length ? (
                <Button type="button" onClick={() => setCurrentStep(currentStep + 1)} disabled={!validateStep()}>
                  Suivant <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "Créer"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}