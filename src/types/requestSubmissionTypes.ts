export interface FormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  nomPere: string;
  contactPere: string;
  nomMere: string;
  contactMere: string;
  nomTuteur: string;
  adresseTuteur: string;
  region: string;
  arrondissement: string;
  departement: string;
  village: string;
  niveauEnseignement: string;
  ethnie: string;
  situationMatrimoniale: string;
  nomEpoux: string;
  contactEpoux: string;
  numeroCNI: string;
  formation: string;
  niveauEtude: string;
  etablissementOrigine: string;
  matriculeConcours: string;
  documents: {
    releveNotes: File | null;
    diplome: File | null;
    acteNaissance: File | null;
    photoIdentiteRecto: File | null;
    photoIdentiteVerso: File | null;
    photo4x4: File | null;
    attestationConcours: File | null;
  };
  accepteConditions: boolean;
}


export interface FileUploadProps {
  label: string;
  documentType: keyof FormData["documents"];
  required?: boolean;
  accept?: string;
  description?: string;
  file: File | null;
  error: string | undefined;
  onFileChange: (
    documentType: keyof FormData["documents"],
    file: File | null,
  ) => void;
}


export interface ISeachMatricule {
  application_code: string;
  curriculum_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  place_of_birth: string | null;
  email: string;
  gender: string;
  region_code: string | null;
  department_code: string | null;
  arrondissement_code: string | null;
  village: string | null;
  education_level_code: string | null;
  ethnicity_code: string | null;
  marital_status_code: string | null;
  country: string | null;
  city: string | null;
  street: string | null;
  address_details: string | null;
  cni_number: string | null;
  cni_issue_date: string | null;
  cni_issue_location: string | null;
  application_status_code: string;
  submitted_at: string | null;
  processed_at: string | null;
  rejection_reason: string | null;
  application_data: unknown; // si c'est un objet dynamique
  phone_number: string;
  converted_to_user_code: string | null;
  processed_user_code: string | null;
  cirriculum: {
    curriculum_code: string;
    curriculum_name: string;
    study_level: string;
    program_code: string;
    program_name: string;
  };
  relatives: unknown[]; // si tu veux, on peut créer une interface pour les relatives
  documents: unknown[]; // pareil ici
}
