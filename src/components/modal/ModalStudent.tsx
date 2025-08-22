'use client';

import React, { Dispatch, SetStateAction } from "react";
import GenericModal from "./GenericModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { gender, ICreateStudent } from "@/types/userTypes";

interface ModalStudentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<ICreateStudent>;
  setFormData: Dispatch<SetStateAction<Partial<ICreateStudent>>>;
  onConfirm: () => void;
  action: "CREATE" | "UPDATE";
}

const ModalStudent: React.FC<ModalStudentProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onConfirm,
  action
}) => {
  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title={action === "CREATE" ? "Créer un nouvel étudiant" : "Modifier un étudiant"}
      onCancel={() => {
        onOpenChange(false);
        setFormData({});
      }}
      onConfirm={onConfirm}
      confirmText={action === "CREATE" ? "Créer l'étudiant" : "Mettre a jour"}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Prénom */}
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            value={formData.first_name || ""}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
        </div>

        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            value={formData.last_name || ""}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Téléphone */}
        <div className="space-y-2">
          <Label htmlFor="phone_number">Téléphone</Label>
          <Input
            id="phone_number"
            value={formData.phone_number || ""}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>

        {/* Mot de passe */}
        {
          
          action === "CREATE" &&
          <div className="space-y-2">
            <Label htmlFor="password_plaintext">Mot de passe</Label>
            <Input
              id="password_plaintext"
              type="password"
              value={formData.password_plaintext || ""}
              onChange={(e) => setFormData({ ...formData, password_plaintext: e.target.value })}
            />
          </div>
        }

        {/* Numéro étudiant */}
        <div className="space-y-2">
          <Label htmlFor="student_number">Numéro étudiant</Label>
          <Input
            id="student_number"
            value={formData.student_number || ""}
            onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
          />
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="gender">Genre</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value as gender })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Masculin</SelectItem>
              <SelectItem value="FEMALE">Féminin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Niveau */}
        <div className="space-y-2">
          <Label htmlFor="curriculum_code">Niveau</Label>
          <Select
            value={formData.curriculum_code}
            onValueChange={(value) => setFormData({ ...formData, curriculum_code: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CURR_ASC_Y1">Année 1</SelectItem>
              <SelectItem value="CURR_IDE_Y2">Année 2</SelectItem>
              <SelectItem value="CURR_IDE_Y3">Année 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Niveau d'éducation */}
        <div className="space-y-2">
          <Label htmlFor="education_level_code">Niveau d&apos;éducation</Label>
          <Select
            value={formData.education_level_code}
            onValueChange={(value) => setFormData({ ...formData, education_level_code: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Diplome d'éntre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BACCALAUREAT">Baccalauréat</SelectItem>
              <SelectItem value="LICENCE">Licence</SelectItem>
              <SelectItem value="MASTER">Master</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </GenericModal>
  );
};

export default ModalStudent;