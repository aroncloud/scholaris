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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICreateClassroom } from "@/types/classroomType";
import { Save } from "lucide-react";

interface DialogUpdateClassroomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (classroom: ICreateClassroom) => Promise<boolean>;
  classroom: ICreateClassroom | null;
}

export default function DialogUpdateClassroom({
  open,
  onOpenChange,
  onSave,
  classroom,
}: DialogUpdateClassroomProps) {
  const [formData, setFormData] = useState<Partial<ICreateClassroom>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mettre à jour formData quand classroom change
  useEffect(() => {
    if (open && classroom) {
      setFormData(classroom);
    }
  }, [open, classroom]);

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
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900">Modifier la salle</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Mettez à jour les informations de la salle de classe
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-1">
              <Label htmlFor="location">Localisation </Label>
              <Input
                id="location"
                placeholder="Batiment A, deuxième etage"
                value={formData.location || ""}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                disabled={isSubmitting}
                className={errors.location ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Disponibilité <span className="text-red-500">*</span></Label>
              <Select
                value={formData.is_available !== undefined ? String(formData.is_available) : "1"}
                onValueChange={(value) => handleFieldChange("is_available", Number(value) as 0 | 1)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="1">Disponible</SelectItem>
                  <SelectItem value="0">Non disponible</SelectItem>
                </SelectContent>
              </Select>
              {errors.is_available && <p className="text-xs text-red-500">{errors.is_available}</p>}
            </div>


          </div>
        </div>

        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              variant={"info"}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}