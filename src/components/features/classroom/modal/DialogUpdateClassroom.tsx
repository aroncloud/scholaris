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

interface DialogUpdateClassroomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (classroom: ICreateClassroom) => Promise<void>;
  classroom: ICreateClassroom;
}

export default function DialogUpdateClassroom({
  open,
  onOpenChange,
  onSave,
  classroom,
}: DialogUpdateClassroomProps) {
  const [formData, setFormData] = useState<Partial<ICreateClassroom>>(classroom);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.resource_name) newErrors.resource_name = "Nom de la salle requis";
    if (!formData.capacity || formData.capacity <= 0)
      newErrors.capacity = "Capacité requise";
    if (!formData.location) newErrors.location = "Localisation requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave(formData as ICreateClassroom);
      setErrors({});
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    setFormData(classroom);
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
          <DialogTitle>Modifier la salle de classe</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de la salle
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Nom de la salle */}
          <div className="space-y-1 col-span-2">
            <Label htmlFor="resource_name">Nom de la salle *</Label>
            <Input
              id="resource_name"
              value={formData.resource_name || ""}
              onChange={(e) => handleFieldChange("resource_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.resource_name ? "border-red-500" : ""}
            />
            {errors.resource_name && (
              <p className="text-red-600 text-sm">{errors.resource_name}</p>
            )}
          </div>

          {/* Capacité */}
          <div className="space-y-1">
            <Label htmlFor="capacity">Capacité *</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity || ""}
              onChange={(e) =>
                handleFieldChange("capacity", Number(e.target.value))
              }
              disabled={isSubmitting}
              className={errors.capacity ? "border-red-500" : ""}
            />
            {errors.capacity && (
              <p className="text-red-600 text-sm">{errors.capacity}</p>
            )}
          </div>

          {/* Localisation */}
          <div className="space-y-1">
            <Label htmlFor="location">Localisation *</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              disabled={isSubmitting}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-red-600 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Disponibilité */}
          <div className="space-y-1 col-span-2">
            <Label htmlFor="is_available">Disponible *</Label>
            <select
              id="is_available"
              value={formData.is_available ? "1" : "0"}
              onChange={(e) =>
                handleFieldChange("is_available", e.target.value === "1" ? 1 : 0)
              }
              disabled={isSubmitting}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="1">Oui</option>
              <option value="0">Non</option>
            </select>
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