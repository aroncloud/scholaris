/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
import { FeedbackForm, ICreateCampaign } from "@/types/feedbackTypes";
import { showToast } from "@/components/ui/showToast";
import { Calendar, Users, Zap } from "lucide-react";

interface DialogCreateCampaignProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (campaignData: ICreateCampaign) => Promise<void>;
  forms: FeedbackForm[];
}

export function DialogCreateCampaign({
  open,
  onOpenChange,
  onSave,
  forms,
}: DialogCreateCampaignProps) {
  const [formData, setFormData] = useState<Partial<ICreateCampaign>>({
    name: '',
    formId: '',
    targetAudience: 0,
    startDate: new Date(),
    autoTrigger: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        formId: '',
        targetAudience: 0,
        startDate: new Date(),
        autoTrigger: false
      });
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Le nom de la campagne est requis";
    if (!formData.formId) newErrors.formId = "Veuillez sélectionner un formulaire";
    if (!formData.targetAudience || formData.targetAudience <= 0) {
      newErrors.targetAudience = "Le nombre d'étudiants doit être supérieur à 0";
    }
    if (!formData.startDate) newErrors.startDate = "La date de début est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast({
        variant: "error-solid",
        message: 'Erreur de validation',
        description: `Veuillez remplir tous les champs requis`,
        position: 'top-center',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave: ICreateCampaign = {
        name: formData.name!,
        formId: formData.formId!,
        targetAudience: formData.targetAudience!,
        startDate: formData.startDate!,
        endDate: formData.endDate,
        autoTrigger: formData.autoTrigger || false
      };

      await onSave(dataToSave);

      showToast({
        variant: "success-solid",
        message: 'Succès',
        description: `Campagne créée avec succès`,
        position: 'top-center',
      });

      onOpenChange(false);
    } catch (error) {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: `Une erreur est survenue lors de la création`,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleFieldChange = <K extends keyof ICreateCampaign>(
    field: K,
    value: ICreateCampaign[K]
  ) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as string]) {
      const newErrors = { ...errors };
      delete newErrors[field as string];
      setErrors(newErrors);
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl font-bold text-slate-900">
            Nouvelle campagne de feedback
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-slate-500 mt-1">
            Planifiez une nouvelle campagne d&apos;évaluation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nom de la campagne */}
          <div className="space-y-1">
            <Label htmlFor="campaign-name">
              Nom de la campagne <span className="text-red-500">*</span>
            </Label>
            <Input
              id="campaign-name"
              value={formData.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Ex: Feedback Session - Introduction à React"
              disabled={isSubmitting}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Formulaire */}
          <div className="space-y-1">
            <Label htmlFor="form">
              Formulaire <span className="text-red-500">*</span>
            </Label>
            <select
              id="form"
              value={formData.formId || ""}
              onChange={(e) => handleFieldChange("formId", e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.formId ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Sélectionnez un formulaire</option>
              {forms.filter(f => f.status === 'active').map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name} ({form.questions.length} questions)
                </option>
              ))}
            </select>
            {errors.formId && <p className="text-red-500 text-xs">{errors.formId}</p>}
          </div>

          {/* Audience cible */}
          <div className="space-y-1">
            <Label htmlFor="target-audience">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Nombre d&apos;étudiants ciblés <span className="text-red-500">*</span></span>
              </div>
            </Label>
            <Input
              id="target-audience"
              type="number"
              min="1"
              value={formData.targetAudience || ""}
              onChange={(e) => handleFieldChange("targetAudience", parseInt(e.target.value) || 0)}
              placeholder="Ex: 35"
              disabled={isSubmitting}
              className={errors.targetAudience ? "border-red-500" : ""}
            />
            {errors.targetAudience && <p className="text-red-500 text-xs">{errors.targetAudience}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="start-date">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date de début <span className="text-red-500">*</span></span>
                </div>
              </Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate ? formatDateForInput(formData.startDate) : ""}
                onChange={(e) => handleFieldChange("startDate", new Date(e.target.value))}
                disabled={isSubmitting}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="end-date">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date de fin (optionnelle)</span>
                </div>
              </Label>
              <Input
                id="end-date"
                type="date"
                value={formData.endDate ? formatDateForInput(formData.endDate) : ""}
                onChange={(e) => handleFieldChange("endDate", e.target.value ? new Date(e.target.value) : undefined)}
                disabled={isSubmitting}
                min={formData.startDate ? formatDateForInput(formData.startDate) : undefined}
              />
            </div>
          </div>

          {/* Déclenchement automatique */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoTrigger || false}
                onChange={(e) => handleFieldChange("autoTrigger", e.target.checked)}
                disabled={isSubmitting}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-slate-700">Déclenchement automatique</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Le formulaire sera automatiquement envoyé aux étudiants à la fin de la session
                </p>
              </div>
            </label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            variant="outline"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
          >
            Créer la campagne
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
