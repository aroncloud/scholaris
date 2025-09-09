"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ICreateResource } from "@/types/classroomType";
import { useClassroomData } from "@/hooks/feature/classroom/useClassroomData";
import GenericModal from "../../../modal/GenericModal";

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateResourceModal({ isOpen, onClose }: CreateResourceModalProps) {
  const { addResource } = useClassroomData();

  const [form, setForm] = useState<ICreateResource>({
    name: "",
    capacity: 0,
    location: "",
    type: "AMPHI",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ICreateResource, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleConfirm = async () => {
    const newErrors: Partial<Record<keyof ICreateResource, string>> = {};

    if (!form.name.trim()) newErrors.name = "Le nom est requis.";
    if (!form.capacity || form.capacity <= 0) newErrors.capacity = "La capacité doit être supérieure à 0.";
    if (!form.location.trim()) newErrors.location = "La localisation est requise.";
    if (!form.type) newErrors.type = "Le type de ressource est requis.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Stop if validation failed

    await addResource(form);
    onClose();
  };

  return (
    <GenericModal
      open={isOpen}
      onOpenChange={onClose}
      title="Créer une ressource"
      description="Remplissez les informations ci-dessous pour ajouter une ressource matérielle."
      confirmText="Sauvegarder"
      cancelText="Annuler"
      onCancel={onClose}
      onConfirm={handleConfirm}
      confirmButtonClassName="bg-blue-500 hover:bg-blue-600 text-white"
    >
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="block mb-2">Nom</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="capacity" className="block mb-2">Capacité</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
          />
          {errors.capacity && <p className="text-red-600 text-sm mt-1">{errors.capacity}</p>}
        </div>

        <div>
          <Label htmlFor="location" className="block mb-2">Localisation</Label>
          <Input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
          {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <Label className="block mb-2">Type</Label>
          <Select
            value={form.type}
            onValueChange={(val) => {
              setForm(prev => ({ ...prev, type: val as ICreateResource["type"] }));
              setErrors(prev => ({ ...prev, type: "" }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AMPHI">Amphi</SelectItem>
              <SelectItem value="TD">Salle de TD</SelectItem>
              <SelectItem value="LAB">Laboratoire</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description" className="block mb-2">Description (optionnelle)</Label>
          <Textarea id="description" name="description" value={form.description} onChange={handleChange} />
        </div>
      </form>
    </GenericModal>
  );
}
