'use client';

import React, { Dispatch, SetStateAction } from "react";
import GenericModal from "../GenericModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { gender, ICreateUser } from "@/types/userTypes"; // à adapter avec ton type utilisateur
import { ACTION } from "@/constant";

interface ModalUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ICreateUser | null;
  setFormData: Dispatch<SetStateAction<ICreateUser | null>>;
  onConfirm: () => void;
  action: ACTION;
}

const ModalUser: React.FC<ModalUserProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onConfirm,
  action,
}) => {
  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title={action === "CREATE" ? "Créer un nouvel utilisateur" : "Modifier un utilisateur"}
      onCancel={() => {
        onOpenChange(false);
        setFormData(null);
      }}
      onConfirm={onConfirm}
      confirmText={action === "CREATE" ? "Créer l'utilisateur" : "Mettre à jour"}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Prénom */}
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            value={formData && formData.first_name || ""}
            onChange={(e) => {if(formData) setFormData({ ...formData, first_name: e.target.value })}}
          />
        </div>

        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            value={formData && formData.last_name || ""}
            onChange={(e) => {if(formData) setFormData({ ...formData, last_name: e.target.value })}}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData && formData.email || ""}
            onChange={(e) => {if(formData) setFormData({ ...formData, email: e.target.value })}}
          />
        </div>

        {/* Téléphone */}
        {action === "CREATE" && (
            <div className="space-y-2">
            <Label htmlFor="phone_number">Téléphone</Label>
            <Input
                id="phone_number"
                value={formData && formData.phone_number || ""}
                onChange={(e) => {if(formData) setFormData({ ...formData, phone_number: e.target.value })}}
            />
            </div>
        )}

        {/* Mot de passe */}
        {action === "CREATE" && (
          <div className="space-y-2">
            <Label htmlFor="password_plaintext">Mot de passe</Label>
            <Input
              id="password_plaintext"
              type="password"
              value={formData && formData.password_plaintext || ""}
              onChange={(e) => {if(formData) setFormData({ ...formData, password_plaintext: e.target.value })}}
            />
          </div>
        )}

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="gender">Genre</Label>
          <Select
            value={formData ? formData.gender : 'MALE'}
            onValueChange={(value) => {if(formData) setFormData({ ...formData, gender: value as gender })}}
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

        {/* Rôle */}
        {/* <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMINISTRATOR">Administrateur</SelectItem>
              <SelectItem value="REGISTRAR">Scolarité</SelectItem>
              <SelectItem value="HR">RH</SelectItem>
              <SelectItem value="TEACHER">Enseignant</SelectItem>
              <SelectItem value="STUDENT">Étudiant</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
    </GenericModal>
  );
};

export default ModalUser;
