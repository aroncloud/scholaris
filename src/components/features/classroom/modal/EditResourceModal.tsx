"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import GenericModal from "../../../modal/GenericModal";
import { ICreateResource } from "@/types/classroomType";

interface EditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: ICreateResource;
  updateResource: (resource: ICreateResource) => Promise<void>;
}

export default function EditResourceModal({ isOpen, onClose, resource, updateResource }: EditResourceModalProps) {
  const [form, setForm] = useState<ICreateResource>(resource);

  // Sync with prop changes
  useEffect(() => {
    setForm(resource);
  }, [resource]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    await updateResource(form);
    onClose();
  };

  return (
    <GenericModal
      open={isOpen}
      onOpenChange={onClose}
      title="Modifier une ressource"
      description="Mettez à jour les informations de la ressource."
      confirmText="Sauvegarder"
      cancelText="Annuler"
      onCancel={onClose}
      onConfirm={handleConfirm}
      confirmButtonClassName="bg-blue-500 hover:bg-blue-600 text-white"
    >
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="block mb-2">Nom</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="capacity" className="block mb-2">Capacité</Label>
          <Input id="capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="location" className="block mb-2">Localisation</Label>
          <Input id="location" name="location" value={form.location} onChange={handleChange} required />
        </div>
        <div>
          <Label className="block mb-2">Type</Label>
          <Select value={form.type} onValueChange={val => setForm(prev => ({ ...prev, type: val as ICreateResource["type"] }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AMPHI">Amphi</SelectItem>
              <SelectItem value="TD">Salle de TD</SelectItem>
              <SelectItem value="LAB">Laboratoire</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description" className="block mb-2">Description (optionnelle)</Label>
          <Textarea id="description" name="description" value={form.description} onChange={handleChange} />
        </div>
      </form>
    </GenericModal>
  );
}
