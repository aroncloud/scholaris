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