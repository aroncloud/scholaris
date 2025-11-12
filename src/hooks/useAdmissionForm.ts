import { useState, useCallback } from "react";
import type { CreateApplicantRequest, FormData } from "@/types/requestSubmissionTypes";
import { submitAdmissionRequest, uploadApplicationDocuments } from "@/actions/requestSubmissionActions";
import { showToast } from "@/components/ui/showToast";



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
    cniRecto: null,
    cniVerso: null,
    photo4x4: null,
    releveNotes: null,
    diplome: null,
    acteNaissance: null,
    pageResultatConcours: null,
    pageNomConcours: null,
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
      if (!formData.documents.cniRecto)
        errors.cniRecto = "La CNI recto est requise";
      if (!formData.documents.cniVerso)
        errors.cniVerso = "La CNI verso est requise";
      if (!formData.documents.photo4x4)
        errors.photo4x4 = "La photo 4x4 est requise";
      if (!formData.documents.releveNotes)
        errors.releveNotes = "Le relevé de notes est requis";
      if (!formData.documents.diplome)
        errors.diplome = "Le diplôme est requis";
      if (!formData.documents.acteNaissance)
        errors.acteNaissance = "L'acte de naissance est requis";
      if (!formData.documents.pageResultatConcours)
        errors.pageResultatConcours = "La page d'entente du résultat de concours est requise";
      if (!formData.documents.pageNomConcours)
        errors.pageNomConcours = "La page avec votre nom du résultat de concours est requise";
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
      // Nettoyer l'erreur associée au document quand il est sélectionné
      if (file && errors[documentType]) {
        setErrors((prev) => ({ ...prev, [documentType]: "" }));
      }
    },
    [errors],
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
      // Vérifier que tous les documents sont présents
      if (!formData.documents.cniRecto || !formData.documents.cniVerso ||
          !formData.documents.photo4x4 || !formData.documents.releveNotes ||
          !formData.documents.diplome || !formData.documents.acteNaissance ||
          !formData.documents.pageResultatConcours || !formData.documents.pageNomConcours) {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: 'Tous les documents sont requis'
        });
        return false;
      }

      // Upload des documents
      const uploadResult = await uploadApplicationDocuments({
        cniRecto: formData.documents.cniRecto,
        cniVerso: formData.documents.cniVerso,
        photo4x4: formData.documents.photo4x4,
        releveNotes: formData.documents.releveNotes,
        diplome: formData.documents.diplome,
        acteNaissance: formData.documents.acteNaissance,
        pageResultatConcours: formData.documents.pageResultatConcours,
        pageNomConcours: formData.documents.pageNomConcours,
        matricule: applicationCode
      });

      if (uploadResult.code !== "success" || !uploadResult.data) {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: uploadResult.error || "Erreur lors de l'upload des documents"
        });
        return false;
      }

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
        documents: uploadResult.data
      };
      console.log('-->payload', payload)
      const result = await submitAdmissionRequest(payload, applicationCode);
      console.log('-->submitAdmissionRequest.result', result);

      if (result.code === "success") {
        showToast({
          variant: 'success-solid',
          message: 'Succès',
          description: 'Votre demande a été soumise avec succès !'
        });
        return true;
      } else {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: result.error || "Erreur lors de la soumission de la demande"
        });
        return false;
      }
    } catch (error) {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: "Une erreur est survenue lors de l'envoi"
      });
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
