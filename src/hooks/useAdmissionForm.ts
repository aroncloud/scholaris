import { useState, useCallback } from "react";
import { FormData } from "@/types/requestSubmissionTypes";



export interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  nom: "",
  prenom: "",
  dateNaissance: "",
  lieuNaissance: "",
  nomPere: "",
  contactPere: "",
  nomMere: "",
  contactMere: "",
  nomTuteur: "",
  adresseTuteur: "",
  region: "",
  arrondissement: "",
  departement: "",
  village: "",
  niveauEnseignement: "",
  ethnie: "",
  situationMatrimoniale: "",
  nomEpoux: "",
  contactEpoux: "",
  numeroCNI: "",
  formation: "",
  niveauEtude: "",
  etablissementOrigine: "",
  matriculeConcours: "",
  documents: {
    releveNotes: null,
    diplome: null,
    acteNaissance: null,
    photoIdentiteRecto: null,
    photoIdentiteVerso: null,
    photo4x4: null,
    attestationConcours: null,
  },
  accepteConditions: false,
};

const validateStep = (
  step: number,
  formData: FormData,
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  switch (step) {
    case 1:
      if (!formData.nom.trim()) errors.nom = "Le nom est requis";
      if (!formData.prenom.trim()) errors.prenom = "Le prénom est requis";
      if (!formData.dateNaissance)
        errors.dateNaissance = "La date de naissance est requise";
      if (!formData.lieuNaissance.trim())
        errors.lieuNaissance = "Le lieu de naissance est requis";
      if (!formData.nomPere.trim()) errors.nomPere = "Le nom du père est requis";
      if (!formData.nomMere.trim()) errors.nomMere = "Le nom de la mère est requis";
      break;
    case 4:
      if (!formData.formation) errors.formation = "La formation est requise";
      break;
    case 5:
      if (!formData.documents.photoIdentiteRecto)
        errors.photoIdentiteRecto = "La photo d'identité (recto) est requise";
      if (!formData.documents.photoIdentiteVerso)
        errors.photoIdentiteVerso = "La photo d'identité (verso) est requise";
      if (!formData.documents.photo4x4)
        errors.photo4x4 = "La photo 4x4 est requise";
      break;
    case 6:
      if (!formData.accepteConditions)
        errors.accepteConditions = "Vous devez accepter les conditions";
      break;
  }
  return errors;
};

/**
 * Hook personnalisé pour gérer la logique du formulaire d'admission.
 */
export const useAdmissionForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gère les changements sur les champs de type texte/select
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  // Gère les changements sur les champs de type fichier
  const handleFileChange = useCallback(
    (documentType: keyof FormData["documents"], file: File | null) => {
      setFormData((prev) => ({
        ...prev,
        documents: { ...prev.documents, [documentType]: file },
      }));
    },
    [],
  );

  // Valide l'étape actuelle
  const validateCurrentStep = useCallback((step: number) => {
    const newErrors = validateStep(step, formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Gère la soumission finale du formulaire
  const handleSubmit = useCallback(async () => {
    // Valide la dernière étape avant l'envoi
    if (!validateCurrentStep(6)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulation de l'envoi du formulaire au backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Ici, vous intégrerez votre logique de soumission
      // const response = await fetch('/api/submit', { method: 'POST', body: JSON.stringify(formData) });
      // const result = await response.json();

      alert("Demande soumise avec succès !");
      return true;
    } catch (error) {
      alert("Une erreur est survenue lors de l'envoi.");
      console.error("Erreur de soumission :", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateCurrentStep]);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    validateCurrentStep,
    handleSubmit,
  };
};
