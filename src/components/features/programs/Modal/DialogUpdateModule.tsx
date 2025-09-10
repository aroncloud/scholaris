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
import { ICreateModule } from "@/types/programTypes";
import { Textarea } from "@/components/ui/textarea";

interface DialogUpdateModuleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: ICreateModule) => Promise<boolean>;
  initialData: ICreateModule;
}

export function DialogUpdateModule({
  open,
  onOpenChange,
  onUpdate,
  initialData,
}: DialogUpdateModuleProps) {
  const [formData, setFormData] = useState<Partial<ICreateModule>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recharger initialData quand il change
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.module_name) newErrors.module_name = "Nom module requis";
    if (!formData.internal_code) newErrors.internal_code = "Code interne requis";
    if (formData.coefficient === undefined || formData.coefficient === null)
      newErrors.coefficient = "Coefficient requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mise à jour
  const handleUpdate = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await onUpdate(formData as ICreateModule);

      if (result) {
        setErrors({});
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    if (isSubmitting) return;
    setFormData(initialData);
    setErrors({});
    onOpenChange(false);
  };

  // Modification d'un champ
  const handleFieldChange = <K extends keyof ICreateModule>(
    field: K,
    value: ICreateModule[K]
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
          <DialogTitle>Modifier le module</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations du module
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Nom module */}
          <div className="space-y-1">
            <Label htmlFor="module_name">
              Nom module <span className="text-red-600">*</span>
            </Label>
            <Input
              id="module_name"
              value={formData.module_name || ""}
              onChange={(e) => handleFieldChange("module_name", e.target.value)}
              disabled={isSubmitting}
              className={errors.module_name ? "border-red-500" : ""}
            />
            {errors.module_name && (
              <p className="text-red-600 text-sm">{errors.module_name}</p>
            )}
          </div>

          {/* Code interne */}
          <div className="space-y-1">
            <Label htmlFor="internal_code">
              Code interne <span className="text-red-600">*</span>
            </Label>
            <Input
              id="internal_code"
              value={formData.internal_code || ""}
              onChange={(e) => handleFieldChange("internal_code", e.target.value)}
              disabled={isSubmitting}
              className={errors.internal_code ? "border-red-500" : ""}
            />
            {errors.internal_code && (
              <p className="text-red-600 text-sm">{errors.internal_code}</p>
            )}
          </div>

          {/* Coefficient */}
          <div className="space-y-1">
            <Label htmlFor="coefficient">
              Coefficient <span className="text-red-600">*</span>
            </Label>
            <Input
              id="coefficient"
              type="number"
              value={formData.coefficient || ""}
              onChange={(e) =>
                handleFieldChange("coefficient", Number(e.target.value))
              }
              disabled={isSubmitting}
              className={errors.coefficient ? "border-red-500" : ""}
            />
            {errors.coefficient && (
              <p className="text-red-600 text-sm">{errors.coefficient}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? "Mise à jour..." : "Mettre à jour le module"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
