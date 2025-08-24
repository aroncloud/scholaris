import { useState, useCallback } from "react";
import { CreateApplicantRequest, FormData } from "@/types/requestSubmissionTypes";
import { submitAdmissionRequest } from "@/actions/requestSubmissionActions";



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
  accepteConditions: '',
  curriculum: "",
  cni_issue_date: "",
  email: "",
  phone_number: "",
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
      if (!formData.dateNaissance) errors.dateNaissance = "La date de naissance est requise";
      if (!formData.lieuNaissance.trim()) errors.lieuNaissance = "Le lieu de naissance est requis";
      if (!formData.nomPere.trim()) errors.nomPere = "Le nom du père est requis";
      if (!formData.nomMere.trim()) errors.nomMere = "Le nom de la mère est requis";
      if (!formData.cni_issue_date.trim()) errors.cni_issue_date = "La date de délivrance du CNI est requise";
      break;
    case 2:
      if (!formData.region.trim()) errors.region = "La region est requise";
      if (!formData.departement.trim()) errors.departement = "Le departement est requis";
      if (!formData.arrondissement) errors.arrondissement = "L'arrondissement' est requis";
      if (!formData.village.trim()) errors.village = "Le village est requis";
      break;
    case 3:
      if (!formData.ethnie.trim()) errors.ethnie = "L'ethnie est requise";
      break;
    case 4:
      if (!formData.formation) errors.formation = "La formation est requise";
      if (!formData.curriculum) errors.curriculum = "Le cursus est requis";
      if (!formData.niveauEtude) errors.niveauEtude = "Le niveau d'etude est requis";
      if (!formData.etablissementOrigine) errors.etablissementOrigine = "L'etablissement d'origine est requise";
      break;
    case 5:
      // if (!formData.documents.photoIdentiteRecto)
      //   errors.photoIdentiteRecto = "La photo d'identité (recto) est requise";
      // if (!formData.documents.photoIdentiteVerso)
      //   errors.photoIdentiteVerso = "La photo d'identité (verso) est requise";
      // if (!formData.documents.photo4x4)
      //   errors.photo4x4 = "La photo 4x4 est requise";
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

  
  const handleSubmit = useCallback(async (applicationCode: string) => {
    if (!validateCurrentStep(6)) {
      return false;
    }

    setIsSubmitting(true);
    try {
      console.log("Formulaire soumis :", JSON.stringify(formData));

      const payload: CreateApplicantRequest = {
        first_name: formData.prenom,
        last_name: formData.nom,
        date_of_birth: formData.dateNaissance,
        place_of_birth: formData.lieuNaissance,
        village: formData.village,
        email: formData.email,
        phone_number: formData.phone_number || "",
        education_level_code: formData.niveauEtude,
        cni_number: formData.numeroCNI,
        cni_issue_date: formData.cni_issue_date,
        cni_issue_location: "",
        relatives: [
          {
            last_name: formData.nomPere,
            first_name: "",
            phone_number: formData.contactPere,
            occupation: "",
            relationship_type: "FATHER",
            address: "",
            email: ""
          },
          {
            last_name: formData.nomMere,
            first_name: "",
            phone_number: formData.contactMere,
            occupation: "",
            relationship_type: "MOTHER",
            address: "",
            email: ""
          },
          {
            last_name: formData.nomEpoux,
            first_name: "",
            phone_number: formData.contactEpoux,
            occupation: "",
            relationship_type: "SPOUSE",
            address: "",
            email: ""
          }
        ],
        documents: []
      };

      const result = await submitAdmissionRequest(payload, applicationCode);
      console.log('-->submitAdmissionRequest.result', result);

      return result.code === "success";
    } catch (error) {
      alert("Une erreur est survenue lors de l'envoi.");
      console.error("Erreur de soumission :", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateCurrentStep, formData]);


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
