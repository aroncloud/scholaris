"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { ICreateUser } from "@/types/userTypes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // toast import
import GenericModal from "../GenericModal";

interface ModalUserProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ICreateUser | null;
  onSubmit: (user: ICreateUser) => Promise<void>;
  action: "CREATE" | "UPDATE";
}

export default function ModalUser({ isOpen, onClose, initialData, onSubmit, action }: ModalUserProps) {
  const emptyForm: ICreateUser = {
    user_code: "",
    password_plaintext: "",
    email: "",
    first_name: "",
    last_name: "",
    gender: "MALE",
    phone_number: "",
    staff_number: "",
    job_title: "",
    department: "",
    hiring_date: "",
    salary: 0,
    profiles: [],
  };

  const [formData, setFormData] = useState<ICreateUser>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || emptyForm);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = "Prénom requis";
    if (!formData.last_name) newErrors.last_name = "Nom requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.password_plaintext) newErrors.password_plaintext = "Mot de passe requis";
    else if (formData.password_plaintext.length < 8)
      newErrors.password_plaintext = "Le mot de passe doit contenir au moins 8 caractères";
    if (!formData.phone_number) newErrors.phone_number = "Téléphone requis";
    return newErrors;
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      toast.success(
        action === "CREATE" ? "Utilisateur créé avec succès !" : "Utilisateur mis à jour !",
        { style: { background: "#3b82f6", color: "#ffffff" }, position: "top-center" } // top toast
      );
      onClose();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la sauvegarde.", {
        style: { background: "#3b82f6", color: "#ffffff" },
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericModal
      open={isOpen}
      onOpenChange={onClose}
      title={action === "CREATE" ? "Créer un nouvel utilisateur" : "Modifier l'utilisateur"}
      cancelText="Annuler"
      confirmText={
        loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin h-4 w-4" />
            {action === "CREATE" ? "Création..." : "Sauvegarde..."}
          </span>
        ) : action === "CREATE" ? "Créer l’utilisateur" : "Sauvegarder"
      }
      onConfirm={handleSubmit}
      onCancel={onClose}
      size="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        {/* Prénom */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
              errors.first_name ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
        </div>

        {/* Nom */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col col-span-2">
          <label className="mb-1 font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Téléphone */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
              errors.phone_number ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
        </div>

        {/* Mot de passe */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Mot de passe <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password_plaintext"
            value={formData.password_plaintext}
            onChange={handleChange}
            className={`border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
              errors.password_plaintext ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.password_plaintext && (
            <p className="text-red-500 text-sm mt-1">{errors.password_plaintext}</p>
          )}
        </div>

        {/* Genre */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Genre</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
            disabled={loading}
          >
            <option value="MALE">Masculin</option>
            <option value="FEMALE">Féminin</option>
          </select>
        </div>
      </form>
    </GenericModal>
  );
}


// 'use client';

// import React, { Dispatch, SetStateAction } from "react";
// import GenericModal from "../GenericModal";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { gender, ICreateUser } from "@/types/userTypes"; // à adapter avec ton type utilisateur
// import { ACTION } from "@/constant";

// interface ModalUserProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   formData: ICreateUser | null;
//   setFormData: Dispatch<SetStateAction<ICreateUser | null>>;
//   onConfirm: () => void;
//   action: ACTION;
// }

// const ModalUser: React.FC<ModalUserProps> = ({
//   open,
//   onOpenChange,
//   formData,
//   setFormData,
//   onConfirm,
//   action,
// }) => {
//   return (
//     <GenericModal
//       open={open}
//       onOpenChange={onOpenChange}
//       title={action === "CREATE" ? "Créer un nouvel utilisateur" : "Modifier un utilisateur"}
//       onCancel={() => {
//         onOpenChange(false);
//         setFormData(null);
//       }}
//       onConfirm={onConfirm}
//       confirmText={action === "CREATE" ? "Créer l'utilisateur" : "Mettre à jour"}
//     >
//       <div className="grid grid-cols-2 gap-4">
//         {/* Prénom */}
//         <div className="space-y-2">
//           <Label htmlFor="first_name">Prénom</Label>
//           <Input
//             id="first_name"
//             value={formData && formData.first_name || ""}
//             onChange={(e) => {if(formData) setFormData({ ...formData, first_name: e.target.value })}}
//           />
//         </div>

//         {/* Nom */}
//         <div className="space-y-2">
//           <Label htmlFor="last_name">Nom</Label>
//           <Input
//             id="last_name"
//             value={formData && formData.last_name || ""}
//             onChange={(e) => {if(formData) setFormData({ ...formData, last_name: e.target.value })}}
//           />
//         </div>

//         {/* Email */}
//         <div className="space-y-2">
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             value={formData && formData.email || ""}
//             onChange={(e) => {if(formData) setFormData({ ...formData, email: e.target.value })}}
//           />
//         </div>

//         {/* Téléphone */}
//         {action === "CREATE" && (
//             <div className="space-y-2">
//             <Label htmlFor="phone_number">Téléphone</Label>
//             <Input
//                 id="phone_number"
//                 value={formData && formData.phone_number || ""}
//                 onChange={(e) => {if(formData) setFormData({ ...formData, phone_number: e.target.value })}}
//             />
//             </div>
//         )}

//         {/* Mot de passe */}
//         {action === "CREATE" && (
//           <div className="space-y-2">
//             <Label htmlFor="password_plaintext">Mot de passe</Label>
//             <Input
//               id="password_plaintext"
//               type="password"
//               value={formData && formData.password_plaintext || ""}
//               onChange={(e) => {if(formData) setFormData({ ...formData, password_plaintext: e.target.value })}}
//             />
//           </div>
//         )}

//         {/* Genre */}
//         <div className="space-y-2">
//           <Label htmlFor="gender">Genre</Label>
//           <Select
//             value={formData ? formData.gender : 'MALE'}
//             onValueChange={(value) => {if(formData) setFormData({ ...formData, gender: value as gender })}}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Sélectionner un genre" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="MALE">Masculin</SelectItem>
//               <SelectItem value="FEMALE">Féminin</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Rôle */}
//         {/* <div className="space-y-2">
//           <Label htmlFor="role">Rôle</Label>
//           <Select
//             value={formData.role}
//             onValueChange={(value) => setFormData({ ...formData, role: value })}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Sélectionner un rôle" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="ADMINISTRATOR">Administrateur</SelectItem>
//               <SelectItem value="REGISTRAR">Scolarité</SelectItem>
//               <SelectItem value="HR">RH</SelectItem>
//               <SelectItem value="TEACHER">Enseignant</SelectItem>
//               <SelectItem value="STUDENT">Étudiant</SelectItem>
//             </SelectContent>
//           </Select>
//         </div> */}
//       </div>
//     </GenericModal>
//   );
// };

// export default ModalUser;
