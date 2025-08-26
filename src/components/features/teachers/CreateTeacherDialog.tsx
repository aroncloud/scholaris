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
import { CreateTeacherRequest } from "../../../app/(admin)/admin/teachers/types";

interface CreateTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (teacher: CreateTeacherRequest) => Promise<void>;
}

export function CreateTeacherDialog({
  open,
  onOpenChange,
  onSave,
}: CreateTeacherDialogProps) {
  const [formData, setFormData] = useState<Partial<CreateTeacherRequest>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation par champ
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.user_name) newErrors.user_name = "Nom d'utilisateur requis";
    if (!formData.password_plaintext) newErrors.password_plaintext = "Mot de passe requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.first_name) newErrors.first_name = "Prénom requis";
    if (!formData.last_name) newErrors.last_name = "Nom requis";
    if (!formData.gender) newErrors.gender = "Genre requis";
    if (!formData.phone_number) newErrors.phone_number = "Téléphone requis";
    if (!formData.teacher_number) newErrors.teacher_number = "Numéro enseignant requis";
    if (!formData.specialty) newErrors.specialty = "Spécialité requise";
    if (!formData.hiring_date) newErrors.hiring_date = "Date d'embauche requise";
    if (!formData.salary) newErrors.salary = "Salaire requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Appelle la fonction du parent
      await onSave(formData as CreateTeacherRequest);
      // Pas de toast ni fermeture, c'est le parent qui gère
      setFormData({});
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

  return (
    <Dialog open={open} onOpenChange={() => {
      setErrors({}); onOpenChange(true)
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouvel enseignant</DialogTitle>
          <DialogDescription>
            Remplissez les informations de l&apos;enseignant
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Exemple champ Nom utilisateur */}
          <div className="space-y-1">
            <Label htmlFor="user_name">Nom d&apos;utilisateur *</Label>
            <Input
              id="user_name"
              value={formData.user_name || ""}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              placeholder="teacher00"
              disabled={isSubmitting}
              className={errors.user_name ? "border-red-500" : ""}
            />
            {errors.user_name && <p className="text-red-600 text-sm">{errors.user_name}</p>}
          </div>

          {/* Exemple champ Genre */}
          <div className="space-y-1">
            <Label htmlFor="gender">Genre *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value as CreateTeacherRequest["gender"] })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Masculin</SelectItem>
                <SelectItem value="FEMALE">Féminin</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-600 text-sm">{errors.gender}</p>}
          </div>

          {/* Ajouter les autres inputs ici de la même manière */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer l'enseignant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}