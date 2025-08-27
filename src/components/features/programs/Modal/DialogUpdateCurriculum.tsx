"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ICreateCurriculum } from "@/types/programTypes";

interface DialogUpdateCurriculumProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ICreateCurriculum; // données existantes à modifier
  onUpdate: (updated: ICreateCurriculum) => Promise<void>;
}

export default function DialogUpdateCurriculum({
  open,
  onOpenChange,
  initialData,
  onUpdate,
}: DialogUpdateCurriculumProps) {
  const [formData, setFormData] = useState<ICreateCurriculum>(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdate(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Mise à jour du curriculum</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="curriculum_code">Code du curriculum</Label>
            <Input
              id="curriculum_code"
              name="curriculum_code"
              value={formData.curriculum_code}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="program_code">Code du programme</Label>
            <Input
              id="program_code"
              name="program_code"
              value={formData.program_code}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="study_level">Niveau d&apos;étude</Label>
            <Input
              id="study_level"
              name="study_level"
              value={formData.study_level}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="curriculum_name">Nom du curriculum</Label>
            <Input
              id="curriculum_name"
              name="curriculum_name"
              value={formData.curriculum_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="status_code">Code du statut</Label>
            <Input
              id="status_code"
              name="status_code"
              value={formData.status_code}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}