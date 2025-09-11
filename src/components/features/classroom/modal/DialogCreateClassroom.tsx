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
import { ICreateClassroom } from "@/types/classroomType";

interface DialogCreateClassroomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateClassroom) => Promise<boolean>;
}

export function DialogCreateClassroom({
  open,
  onOpenChange,
  onSave,
}: DialogCreateClassroomProps) {
  const [formData, setFormData] = useState<Partial<ICreateClassroom>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.resource_name) newErrors.resource_name = "Nom de la salle requis";
    if (formData.capacity === undefined || formData.capacity <= 0) newErrors.capacity = "Capacité requise";
    if (!formData.location) newErrors.location = "Localisation requise";
    if (formData.is_available === undefined) newErrors.is_available = "Disponibilité requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await onSave(formData as ICreateClassroom);
      if (!result) return;

      setFormData({});
      setErrors({});
      onOpenChange(false);
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

  const handleFieldChange = <K extends keyof ICreateClassroom>(
    field: K,
    value: ICreateClassroom[K]
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
          <DialogTitle>Créer une nouvelle salle</DialogTitle>
          <DialogDescription>
            Remplissez les informations de la salle de classe
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="resource_name">Nom de la salle <span className="text-red-600">*</span></Label>
            <Input
              id="resource_name"
              value={formData.resource_name || ""}
              onChange={(e) => handleFieldChange("resource_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.resource_name ? "border-red-500" : ""}
            />
            {errors.resource_name && <p className="text-red-600 text-sm">{errors.resource_name}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="capacity">Capacité <span className="text-red-600">*</span></Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity || ""}
              onChange={(e) => handleFieldChange("capacity", Number(e.target.value))}
              disabled={isSubmitting}
              className={errors.capacity ? "border-red-500" : ""}
            />
            {errors.capacity && <p className="text-red-600 text-sm">{errors.capacity}</p>}
          </div>

          <div className="space-y-1 col-span-2">
            <Label htmlFor="location">Localisation </Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              disabled={isSubmitting}
              className={errors.location ? "border-red-500" : ""}
            />
            {/* {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>} */}
          </div>

          <div className="space-y-1 col-span-2">
            <Label htmlFor="is_available">Disponibilité</Label>
            <select
              id="is_available"
              value={formData.is_available !== undefined ? String(formData.is_available) : ""}
              onChange={(e) => handleFieldChange("is_available", Number(e.target.value) as 0 | 1)}
              disabled={isSubmitting}
              className={`w-full border rounded-md px-2 py-1 ${errors.is_available ? "border-red-500" : ""}`}
            >
              <option value="">-- Sélectionnez --</option>
              <option value="1">Disponible</option>
              <option value="0">Non disponible</option>
            </select>
            {/* {errors.is_available && <p className="text-red-600 text-sm">{errors.is_available}</p>} */}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer la salle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}