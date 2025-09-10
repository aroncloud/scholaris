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
import { ICreateDomain, ICreateSemester } from "@/types/programTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface DialogUpdateDomainProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: ICreateDomain;
    curriculumName: string;
    sequenceList: ICreateSemester []
    onUpdate: (data: ICreateDomain) => Promise<void>;
}

export function DialogUpdateDomain({
  open,
  onOpenChange,
  initialData,
  curriculumName,
  sequenceList,
  onUpdate,
}: DialogUpdateDomainProps) {
  const [formData, setFormData] = useState<Partial<ICreateDomain>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Recharger les données quand initialData change
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Validation des champs
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.domain_code) newErrors.domain_code = "Code domaine requis";
    if (!formData.domain_name) newErrors.domain_name = "Nom domaine requis";
    if (!formData.internal_code) newErrors.internal_code = "Code interne requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarde des modifications
  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onUpdate(formData as ICreateDomain);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    if (loading) return;
    setFormData(initialData);
    setErrors({});
    onOpenChange(false);
  };

  // Changement de champ
  const handleFieldChange = <K extends keyof ICreateDomain>(
    field: K,
    value: ICreateDomain[K]
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
          <DialogTitle>Modifier le domaine</DialogTitle>
          <DialogDescription>
            Modifiez les informations du domaine
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">

          {/* Code interne */}
          <div className="space-y-1">
            <Label htmlFor="internal_code">Code interne <span className="text-red-600">*</span></Label>
            <Input
              id="internal_code"
              value={formData.internal_code || ""}
              onChange={(e) => handleFieldChange("internal_code", e.target.value)}
              disabled={loading}
              className={errors.internal_code ? "border-red-500" : ""}
            />
            {errors.internal_code && <p className="text-red-600 text-sm">{errors.internal_code}</p>}
          </div>


          {/* Curriculum */}
          <div className="space-y-1">
            <Label>Curriculum</Label>
            <Input value={curriculumName} disabled />
          </div>

            {/* Séquence */}
            <div className="space-y-1">
                <Label htmlFor="sequence_code">Séquence <span className="text-red-600">*</span></Label>
                <Select
                    value={formData.sequence_code || ""}
                    onValueChange={(value) => handleFieldChange("sequence_code", value)}
                >
                    <SelectTrigger className={`w-full ${errors.sequence_code ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Choisissez une séquence" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        {sequenceList.map(seq => (
                            <SelectItem
                                key={seq.sequence_code}
                                value={seq.sequence_code}
                            >
                                {seq.sequence_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.sequence_code && <p className="text-red-600 text-sm">{errors.sequence_code}</p>}
                {errors.sequence_code && <p className="text-red-600 text-sm">{errors.sequence_code}</p>}
            </div>

          {/* Nom domaine */}
          <div className="space-y-1">
            <Label htmlFor="domain_name">Nom domaine <span className="text-red-600">*</span></Label>
            <Input
              id="domain_name"
              value={formData.domain_name || ""}
              onChange={(e) => handleFieldChange("domain_name", e.target.value)}
              disabled={loading}
              className={errors.domain_name ? "border-red-500" : ""}
            />
            {errors.domain_name && <p className="text-red-600 text-sm">{errors.domain_name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour le domaine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
