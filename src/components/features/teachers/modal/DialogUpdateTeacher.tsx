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
import { CreateTeacherRequest } from "../../../../types/teacherTypes";

interface DialogUpdateTeacherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (teacher: CreateTeacherRequest) => Promise<void>;
  teacher: CreateTeacherRequest
}

export function DialogUpdateTeacher({
  open,
  onOpenChange,
  onSave,
  teacher
}: DialogUpdateTeacherProps) {
  const [formData, setFormData] = useState<Partial<CreateTeacherRequest>>(teacher);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation par champ
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.first_name) newErrors.first_name = "Prénom requis";
    if (!formData.last_name) newErrors.last_name = "Nom requis";
    if (!formData.gender) newErrors.gender = "Genre requis";
    if (!formData.phone_number) newErrors.phone_number = "Téléphone requis";
    if (!formData.teacher_number) newErrors.teacher_number = "Numéro enseignant requis";
    if (!formData.specialty) newErrors.specialty = "Spécialité requise";
    if (!formData.hiring_date) newErrors.hiring_date = "Date d'embauche requise";
    if (!formData.salary) newErrors.salary = "Salaire requis";
    if (!formData.qualifications) newErrors.qualifications = "Qualifications requises";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData as CreateTeacherRequest);
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

  const handleFieldChange = <K extends keyof CreateTeacherRequest>(
    field: K,
    value: CreateTeacherRequest[K]
  ) => {
    // Met à jour la valeur
    setFormData({ ...formData, [field]: value });
    // Supprime l'erreur associée au champ
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
          <DialogTitle>Modifier l&apos;enseignant</DialogTitle>
          <DialogDescription>Remplissez les informations de l&apos;enseignant</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Prénom */}
          <div className="space-y-1">
            <Label htmlFor="first_name">Prénom <span className="text-red-600">*</span></Label>
            <Input
              id="first_name"
              value={formData.first_name || ""}
              onChange={(e) => handleFieldChange("first_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.first_name ? "border-red-500" : ""}
            />
            {errors.first_name && <p className="text-red-600 text-sm">{errors.first_name}</p>}
          </div>

          {/* Nom */}
          <div className="space-y-1">
            <Label htmlFor="last_name">Nom<span className="text-red-600">*</span></Label>
            <Input
              id="last_name"
              value={formData.last_name || ""}
              onChange={(e) => handleFieldChange("last_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.last_name ? "border-red-500" : ""}
            />
            {errors.last_name && <p className="text-red-600 text-sm">{errors.last_name}</p>}
          </div>

          {/* Numéro enseignant */}
          <div className="space-y-1">
            <Label htmlFor="teacher_number">Numéro enseignant<span className="text-red-600">*</span></Label>
            <Input
              id="teacher_number"
              value={formData.teacher_number || ""}
              onChange={(e) => handleFieldChange("teacher_number", e.target.value)}
              placeholder="TCH2024000"
              disabled={isSubmitting}
              className={errors.teacher_number ? "border-red-500" : ""}
            />
            {errors.teacher_number && <p className="text-red-600 text-sm">{errors.teacher_number}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email<span className="text-red-600">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="teacher@efspa.edu"
              disabled={isSubmitting}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <Label htmlFor="phone_number">Téléphone<span className="text-red-600">*</span></Label>
            <Input
              id="phone_number"
              value={formData.phone_number || ""}
              onChange={(e) => handleFieldChange("phone_number", e.target.value)}
              placeholder="+237677123400"
              disabled={isSubmitting}
              className={errors.phone_number ? "border-red-500" : ""}
            />
            {errors.phone_number && <p className="text-red-600 text-sm">{errors.phone_number}</p>}
          </div>

          {/* Genre */}
          <div className="space-y-1">
            <Label htmlFor="gender">Genre<span className="text-red-600">*</span></Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleFieldChange("gender", value as CreateTeacherRequest["gender"])}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner le genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Masculin</SelectItem>
                <SelectItem value="FEMALE">Féminin</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-600 text-sm">{errors.gender}</p>}
          </div>

          {/* Spécialité */}
          <div className="space-y-1">
            <Label htmlFor="specialty">Spécialité<span className="text-red-600">*</span></Label>
            <Input
              id="specialty"
              value={formData.specialty || ""}
              onChange={(e) => handleFieldChange("specialty", e.target.value)}
              placeholder="Biology"
              disabled={isSubmitting}
              className={errors.specialty ? "border-red-500" : ""}
            />
            {errors.specialty && <p className="text-red-600 text-sm">{errors.specialty}</p>}
          </div>

          {/* Qualifications */}
          <div className="space-y-1">
            <Label htmlFor="qualifications">Qualifications</Label>
            <Input
              id="qualifications"
              value={formData.qualifications || ""}
              onChange={(e) => handleFieldChange("qualifications", e.target.value)}
              placeholder="Master en Biologie"
              disabled={isSubmitting}
              className={errors.qualifications ? "border-red-500" : ""}
            />
            {errors.qualifications && <p className="text-red-600 text-sm">{errors.qualifications}</p>}
          </div>

          {/* Date d'embauche */}
          <div className="space-y-1">
            <Label htmlFor="hiring_date">Date d&apos;embauche<span className="text-red-600">*</span></Label>
            <Input
              id="hiring_date"
              type="date"
              value={formData.hiring_date || ""}
              onChange={(e) => handleFieldChange("hiring_date", e.target.value)}
              disabled={isSubmitting}
              className={errors.hiring_date ? "border-red-500" : ""}
            />
            {errors.hiring_date && <p className="text-red-600 text-sm">{errors.hiring_date}</p>}
          </div>

          {/* Salaire */}
          <div className="space-y-1">
            <Label htmlFor="salary">Salaire<span className="text-red-600">*</span></Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary || ""}
              onChange={(e) => handleFieldChange("salary", Number(e.target.value))}
              placeholder="70000"
              disabled={isSubmitting}
              className={errors.salary ? "border-red-500" : ""}
            />
            {errors.salary && <p className="text-red-600 text-sm">{errors.salary}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Modification..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
