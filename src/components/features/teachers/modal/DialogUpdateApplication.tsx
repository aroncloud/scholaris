"use client";
import { useState } from "react";
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
import { CreateTeacherApplication } from "@/types/teacherTypes"; 

interface DialogUpdateApplicationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (application: CreateTeacherApplication) => Promise<void>;
  application: CreateTeacherApplication;
}

export default function DialogUpdateApplication({
  open,
  onOpenChange,
  onSave,
  application,
}: DialogUpdateApplicationProps) {
  const [formData, setFormData] = useState<Partial<CreateTeacherApplication>>(application);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.job_offer_code) newErrors.job_offer_code = "Code de l'offre requis";
    if (!formData.applicant_email) newErrors.applicant_email = "Email requis";
    if (!formData.applicant_first_name) newErrors.applicant_first_name = "Prénom requis";
    if (!formData.applicant_last_name) newErrors.applicant_last_name = "Nom requis";
    if (formData.years_experience == null) newErrors.years_experience = "Expérience requise";
    if (!formData.phone_number) newErrors.phone_number = "Téléphone requis";
    if (!formData.specialty) newErrors.specialty = "Spécialité requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave(formData as CreateTeacherApplication);
      setFormData({});
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    setFormData({});
    setErrors({});
    onOpenChange(false);
  };

  const handleFieldChange = <K extends keyof CreateTeacherApplication>(
    field: K,
    value: CreateTeacherApplication[K]
  ) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as string]) {
      const newErrors = { ...errors };
      delete newErrors[field as string];
      setErrors(newErrors);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la candidature</DialogTitle>
          <DialogDescription>Mettre à jour les informations de la candidature</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Code offre */}
          <div className="space-y-1">
            <Label htmlFor="job_offer_code">Code Offre *</Label>
            <Input
              id="job_offer_code"
              value={formData.job_offer_code || ""}
              onChange={(e) => handleFieldChange("job_offer_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.job_offer_code ? "border-red-500" : ""}
            />
            {errors.job_offer_code && <p className="text-red-600 text-sm">{errors.job_offer_code}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="applicant_email">Email *</Label>
            <Input
              id="applicant_email"
              type="email"
              value={formData.applicant_email || ""}
              onChange={(e) => handleFieldChange("applicant_email", e.target.value)}
              disabled={isSubmitting}
              className={errors.applicant_email ? "border-red-500" : ""}
            />
            {errors.applicant_email && <p className="text-red-600 text-sm">{errors.applicant_email}</p>}
          </div>

          {/* Prénom */}
          <div className="space-y-1">
            <Label htmlFor="applicant_first_name">Prénom *</Label>
            <Input
              id="applicant_first_name"
              value={formData.applicant_first_name || ""}
              onChange={(e) => handleFieldChange("applicant_first_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.applicant_first_name ? "border-red-500" : ""}
            />
            {errors.applicant_first_name && <p className="text-red-600 text-sm">{errors.applicant_first_name}</p>}
          </div>

          {/* Nom */}
          <div className="space-y-1">
            <Label htmlFor="applicant_last_name">Nom *</Label>
            <Input
              id="applicant_last_name"
              value={formData.applicant_last_name || ""}
              onChange={(e) => handleFieldChange("applicant_last_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.applicant_last_name ? "border-red-500" : ""}
            />
            {errors.applicant_last_name && <p className="text-red-600 text-sm">{errors.applicant_last_name}</p>}
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <Label htmlFor="phone_number">Téléphone *</Label>
            <Input
              id="phone_number"
              value={formData.phone_number || ""}
              onChange={(e) => handleFieldChange("phone_number", e.target.value)}
              disabled={isSubmitting}
              className={errors.phone_number ? "border-red-500" : ""}
            />
            {errors.phone_number && <p className="text-red-600 text-sm">{errors.phone_number}</p>}
          </div>

          {/* Spécialité */}
          <div className="space-y-1">
            <Label htmlFor="specialty">Spécialité *</Label>
            <Input
              id="specialty"
              value={formData.specialty || ""}
              onChange={(e) => handleFieldChange("specialty", e.target.value)}
              disabled={isSubmitting}
              className={errors.specialty ? "border-red-500" : ""}
            />
            {errors.specialty && <p className="text-red-600 text-sm">{errors.specialty}</p>}
          </div>

          {/* Ancienne institution */}
          <div className="space-y-1">
            <Label htmlFor="is_from_previous_institution">De l&apos;ancienne institution ?</Label>
            <Select
              value={formData.is_from_previous_institution ? "yes" : "no"}
              onValueChange={(value) => handleFieldChange("is_from_previous_institution", value === "yes")}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Années d'expérience */}
          <div className="space-y-1">
            <Label htmlFor="years_experience">Années d&apos;expérience *</Label>
            <Input
              id="years_experience"
              type="number"
              value={formData.years_experience || ""}
              onChange={(e) => handleFieldChange("years_experience", Number(e.target.value))}
              disabled={isSubmitting}
              className={errors.years_experience ? "border-red-500" : ""}
            />
            {errors.years_experience && <p className="text-red-600 text-sm">{errors.years_experience}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Mise à jour..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
