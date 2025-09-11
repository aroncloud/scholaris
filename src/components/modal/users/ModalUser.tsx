"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { ICreateUser } from "@/types/staffType";
import { Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import GenericModal from "../GenericModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


interface ModalUserProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ICreateUser | null;
  action: "CREATE" | "UPDATE";
  roles: { label: string; value: string }[];
  onSave: (formData?: ICreateUser) => Promise<number | boolean | { code: string; [key: string]: any } | undefined>;
}

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ModalUser({ isOpen, onClose, initialData, action, onSave }: ModalUserProps) {
  const [showPassword, setShowPassword] = useState(false);
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
    profiles: []
  };

  const [formData, setFormData] = useState<ICreateUser>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // For shadcn Calendar
  const [hiringDate, setHiringDate] = useState<Date | undefined>(
    initialData?.hiring_date ? new Date(initialData.hiring_date) : undefined
  );
  const [hiringDateOpen, setHiringDateOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || emptyForm);
      setErrors({});
      setHiringDate(initialData?.hiring_date ? new Date(initialData.hiring_date) : undefined);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name) newErrors.first_name = "Le prénom est requis";
    if (!formData.last_name) newErrors.last_name = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";

    if (!formData.phone_number) newErrors.phone_number = "Le numéro de téléphone est requis";
    else if (!/^\+\d{3}\s\d{3}\s\d{3}\s\d{3}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Numéro de téléphone invalide. Format: +XXX XXX XXX XXX";
    }

    if (action === "CREATE") {
      if (!formData.password_plaintext) newErrors.password_plaintext = "Le mot de passe est requis";
      else if (formData.password_plaintext.length < 8) {
        newErrors.password_plaintext = "Le mot de passe doit contenir au moins 8 caractères";
      }
    }

    if (!formData.staff_number) newErrors.staff_number = "Le numéro de staff est requis";
    if (!formData.job_title) newErrors.job_title = "Le poste est requis";
    if (!formData.department) newErrors.department = "Le département est requis";
    if (!formData.hiring_date) newErrors.hiring_date = "La date d'embauche est requise";

    if (typeof formData.salary !== "number" || formData.salary <= 0) {
      newErrors.salary = "Le salaire doit être un nombre strictement supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e?: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    if (e && "preventDefault" in e) e.preventDefault();

    setLoading(true);
    setErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await onSave(formData);
      const isSuccess =
        result === 1 ||
        (result && typeof result === "object" && (result.code === "success" || result.status === 1 || result.status === "success"));

      if (isSuccess) {
        toast.success(action === "CREATE" ? "Utilisateur créé avec succès" : "Utilisateur mis à jour avec succès", {
          duration: 5000,
          position: "top-center",
          style: { background: "#10B981", color: "white" }
        });
        onClose();
      } else {
        const errorMessage =
          typeof result === "object"
            ? result.message || result.error || "Une erreur est survenue"
            : typeof result === "string"
            ? result
            : "L'opération a échoué. Veuillez vérifier les données et réessayer.";

        toast.error(errorMessage, { duration: 5000, position: "top-center", style: { background: "#EF4444", color: "white" } });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        action === "CREATE"
          ? "Une erreur est survenue lors de la création de l'utilisateur"
          : "Une erreur est survenue lors de la mise à jour de l'utilisateur",
        { duration: 5000, position: "top-center", style: { background: "#EF4444", color: "white" } }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSave(e);
  };

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = document.getElementById("user-form") as HTMLFormElement;
    if (form) form.requestSubmit();
    else await handleSave();
  };

  if (!isOpen) return null;

  return (
    <GenericModal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={action === "CREATE" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
      description={action === "CREATE" ? "Remplissez les champs ci-dessous pour créer un nouvel utilisateur." : "Modifiez les informations de l'utilisateur ci-dessous."}
      onCancel={onClose}
      onConfirm={handleButtonClick}
      // confirmText={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : action === "CREATE" ? "Créer" : "Mettre à jour"}
      confirmText={
        loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {action === "CREATE" ? "Création..." : "Mise à jour..."}
          </span>
        ) : (
          action === "CREATE" ? "Créer" : "Mettre à jour"
        )
      }

    >
      <form id="user-form" onSubmit={handleFormSubmit} className="space-y-6" noValidate>
        {/* Section 1: Informations personnelles */}
         <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Informations personnelles
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
                  errors.first_name ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
                required
              />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
                  errors.last_name ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
                required
              />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>

            {/* Full width fields */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+XXX XXX XXX XXX"
                className={`w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
                disabled={loading}
              >
                <option value="MALE">Masculin</option>
                <option value="FEMALE">Féminin</option>
              </select>
            </div>

            {action === "CREATE" && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password_plaintext"
                    value={formData.password_plaintext}
                    onChange={handleChange}
                    className={`w-full border rounded p-1.5 pr-10 focus:ring-2 focus:ring-blue-400 ${
                      errors.password_plaintext ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeCloseIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password_plaintext && (
                  <p className="text-red-500 text-sm mt-1">{errors.password_plaintext}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Informations professionnelles */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Informations professionnelles</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* staff_number, job_title, department inputs */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Numéro de staff <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="staff_number"
                value={formData.staff_number}
                onChange={handleChange}
                placeholder="STAFF-YYYY-000"
                className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
                disabled={loading}
              />
              {errors.staff_number && <p className="text-red-500 text-sm mt-1">{errors.staff_number}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Poste <span className="text-red-500">*</span>
              </label>
              <select
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
                disabled={loading}
              >
                <option value="">Sélectionnez un poste</option>
                <option value="Formateur Clinique">Formateur Clinique</option>
                <option value="Professeur de Sciences Infirmières">Professeur de Sciences Infirmières</option>
                <option value="Chargé de Cours en Santé Publique">Chargé de Cours en Santé Publique</option>
                <option value="Responsable Pédagogique">Responsable Pédagogique</option>
                <option value="Coordinateur des Stages">Coordinateur des Stages</option>
                <option value="Assistant de Recherche">Assistant de Recherche</option>
              </select>
              {errors.job_title && <p className="text-red-500 text-sm mt-1">{errors.job_title}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Département <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
                disabled={loading}
              >
                <option value="">Sélectionnez un département</option>
                <option value="Sciences Infirmières">Sciences Infirmières</option>
                <option value="Formation Clinique">Formation Clinique</option>
                <option value="Techniques et Procédures Médicales">Techniques et Procédures Médicales</option>
                <option value="Sciences Fondamentales">Sciences Fondamentales</option>
                <option value="Santé Publique et Prévention">Santé Publique et Prévention</option>
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Hiring date with US long format Calendar */}
            <div className="space-y-1">
          <Label htmlFor="hiring_date" className="block text-sm font-medium text-gray-700">
            Date d'embauche <span className="text-red-500">*</span>
          </Label>

          <div className="relative flex gap-2">
            <Input
              id="hiring_date"
              value={hiringDate ? formatDate(hiringDate) : ""}
              placeholder="month dd, yyyy"
              className="bg-background pr-10"
              onChange={(e) => {
                const date = new Date(e.target.value);
                // setValue(e.target.value);
                if (!isNaN(date.getTime())) {
                  setHiringDate(date);
                  setFormData((prev) => ({
                    ...prev,
                    hiring_date: date.toISOString().split("T")[0],
                  }));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHiringDateOpen(true);
                }
              }}
              disabled={loading}
            />

            <Popover open={hiringDateOpen} onOpenChange={setHiringDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="hiring-date-picker"
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                >
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Sélectionner la date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={hiringDate}
                  captionLayout="dropdown"
                  month={hiringDate}
                  onMonthChange={setHiringDate}
                  onSelect={(date) => {
                    if (!date) return;
                    setHiringDate(date);
                    setFormData((prev) => ({
                      ...prev,
                      hiring_date: date.toISOString().split("T")[0],
                    }));

                    // Clear the error when the user selects a date
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.hiring_date;
                      return newErrors;
                    });

                    setHiringDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {errors.hiring_date && (
            <p className="text-red-500 text-sm mt-1">{errors.hiring_date}</p>
          )}
        </div>
            {/* salary input */}
           <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Salaire (FCFA) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="salary"
                  min="1"
                  step="1000"
                  value={formData.salary}
                  onChange={handleChange}
                  className={`w-full border rounded p-1.5 pr-10 focus:ring-2 focus:ring-blue-400 ${
                    errors.salary ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 text-sm">FCFA</span>
                </div>
              </div>
              {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
            </div>
          </div>
        </div>
      </form>
    </GenericModal>
  );
}









