"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { ICreateUser } from "@/types/userTypes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import GenericModal from "../GenericModal";

interface ModalUserProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ICreateUser | null;
  action: "CREATE" | "UPDATE";
  roles: { label: string; value: string }[];
  onSave: (formData?: ICreateUser) => Promise<number | boolean | { code: string; [key: string]: any } | undefined>;
}

export default function ModalUser({ isOpen, onClose, initialData, action, onSave }: ModalUserProps) {
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

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || emptyForm);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value
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
    
    if (typeof formData.salary !== 'number' || formData.salary <= 0) {
      newErrors.salary = "Le salaire doit être un nombre strictement supérieur à 0";
    }
    
    if (formData.phone_number && !/^\+?[0-9\s-]{6,}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Numéro de téléphone invalide";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e?: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    
    setLoading(true);
    setErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const submissionData = {
      ...formData,
      // Remove profiles as they're not needed in the backend
    };
    
    console.log('Submitting user data:', JSON.stringify(submissionData, null, 2));
    
    try {
      console.log('Calling onSave with data:', JSON.stringify(submissionData, null, 2));
      const result = await onSave(submissionData);
      
      // Helper to check if the result indicates success
      const checkSuccess = (res: any): boolean => {
        console.log('Checking success for result:', res);
        
        // Handle numeric response (1 means success)
        if (res === 1) return true;
        
        // Handle object response
        if (res && typeof res === 'object') {
          // Check for success in various response formats
          if (res.code === 'success' || res.status === 1 || res.status === 'success') {
            return true;
          }
          
          // Check for error status
          if (res.code === 'error' || (typeof res.status === 'number' && res.status >= 400)) {
            // Log the error for debugging
            console.error('Error response:', res);
            
            // Show error message to user if available
            const errorMessage = res.message || res.error || 'Une erreur est survenue';
            toast.error(errorMessage, {
              duration: 5000,
              position: 'top-center',
              style: { background: '#EF4444', color: 'white' }
            });
            
            return false;
          }
          
          // If we have data but no explicit error, assume success
          if (res.data) return true;
        }
        
        // Default to failure if we can't determine success
        console.warn('Could not determine success status from response:', res);
        return false;
      };
      
      const isSuccess = checkSuccess(result);
      console.log('Is operation successful?', isSuccess);
      
      if (isSuccess) {
        // Show success message
        toast.success(
          action === 'CREATE' 
            ? 'Utilisateur créé avec succès' 
            : 'Utilisateur mis à jour avec succès',
          {
            duration: 5000,
            position: 'top-center',
            style: { background: '#10B981', color: 'white' }
          }
        );
        
        // Close the modal and reset the form
        onClose();
        
        // Reset the form if this is a create operation
        if (action === 'CREATE') {
          // Add any form reset logic here if needed
        }
      } else if (result !== undefined) {
        // Handle error response from onSave
        console.warn('User save operation failed:', result);
        
        // Extract error message based on result type
        let errorMessage = action === 'CREATE' 
          ? "Échec de la création de l'utilisateur" 
          : "Échec de la mise à jour de l'utilisateur";
        
        if (typeof result === 'object' && result !== null) {
          // Handle object response
          const response = result as Record<string, any>;
          errorMessage = response.message || 
                        response.data?.message || 
                        response.error ||
                        errorMessage;
        } else if (typeof result === 'string') {
          // Handle string response
          errorMessage = result;
        } else if (result === 0) {
          errorMessage = "L'opération a échoué. Veuillez vérifier les données et réessayer.";
        }
        
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-center',
          style: { background: '#EF4444', color: 'white' }
        });
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error(
        action === 'CREATE'
          ? "Une erreur est survenue lors de la création de l'utilisateur"
          : "Une erreur est survenue lors de la mise à jour de l'utilisateur",
        {
          duration: 5000,
          position: 'top-center',
          style: { background: '#EF4444', color: 'white' }
        }
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
    const form = document.getElementById('user-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    } else {
      await handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <GenericModal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={action === "CREATE" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
      description={
        action === "CREATE"
          ? "Remplissez les champs ci-dessous pour créer un nouvel utilisateur."
          : "Modifiez les informations de l'utilisateur ci-dessous."
      }
      onCancel={onClose}
      onConfirm={handleButtonClick}
      confirmText={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : action === "CREATE" ? "Créer" : "Mettre à jour"}
    >
      <form id="user-form" onSubmit={handleFormSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          {/* Prénom */}
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

          {/* Nom */}
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

          {/* Email */}
          <div className="space-y-1 col-span-2">
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

          {/* Téléphone */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+XX XXX XXX XXX"
              className={`w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
                errors.phone_number ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
          </div>

          {/* Numéro de staff */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Numéro de staff
            </label>
            <input
              type="text"
              name="staff_number"
              value={formData.staff_number}
              onChange={handleChange}
              className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
              disabled={loading}
            />
          </div>

          {/* Poste */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Poste
            </label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
              disabled={loading}
            />
          </div>

          {/* Département */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Département
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
              disabled={loading}
            />
          </div>

          {/* Date d'embauche */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Date d'embauche
            </label>
            <input
              type="date"
              name="hiring_date"
              value={formData.hiring_date}
              onChange={handleChange}
              className="w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 border-gray-300"
              disabled={loading}
            />
          </div>

          {/* Salaire */}
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

          {/* Genre */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Genre
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

          {/* Mot de passe (only for new users) */}
          {action === "CREATE" && (
            <div className="space-y-1 col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password_plaintext"
                value={formData.password_plaintext}
                onChange={handleChange}
                className={`w-full border rounded p-1.5 focus:ring-2 focus:ring-blue-400 ${
                  errors.password_plaintext ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
                required
              />
              {errors.password_plaintext && (
                <p className="text-red-500 text-sm mt-1">{errors.password_plaintext}</p>
              )}
            </div>
          )}
        </div>
      </form>
    </GenericModal>
  );
}
