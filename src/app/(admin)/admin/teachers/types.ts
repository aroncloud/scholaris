export interface Teacher {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  userName?: string; 
  gender?: "MALE" | "FEMALE"; 
  specialite: string;
  departement: string;
  statut: "actif" | "suspendu" | "conge" | "archive" | "candidat";
  typeContrat: "CDI" | "CDD" | "Vacataire" | "Stage";
  typeCode?: "PERMANENT" | "TEMPORARY" | "CONTRACT";
  dateFinContrat?: string;
  salaire?: number;
  qualification: string;
  experience: number;
  evaluation?: number;
  matieres: string[];
  heuresEnseignement?: number;
  adresse?: string;
}

export interface CreateTeacherRequest {
  user_name: string;
  password_plaintext: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: "MALE" | "FEMALE";
  phone_number: string;
  teacher_number: string;
  specialty: string;
  hiring_date: string;
  salary: number;
  qualifications: string;
}

export interface UpdateTeacherRequest {
  user_code: string;
  user_name: string;
  password_plaintext: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: "MALE" | "FEMALE";
  phone_number: string;
  teacher_number: string;
  specialty: string;
  hiring_date: string;
  salary: number;
  qualifications: string;
}

export interface TeacherAPIResponse {
  user_code: string;
  user_name?: string; 
  first_name: string;
  last_name: string;
  email: string;
  created_at: number;
  updated_at: number;
  last_login_at: number | null;
  status_code: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  phone_number: string;
  gender: "MALE" | "FEMALE";
  teacher_number: string;
  specialty: string;
  employment_status_code: "ACTIVE" | "INACTIVE";
  type_code: "PERMANENT" | "TEMPORARY" | "CONTRACT";
  qualifications: string | null;
  hiring_date: string;
  salary: number;
}

export interface Application {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  qualification: string;
  experience: number;
  datePostulation: string;
  statut: "en_attente" | "en_entretien" | "accepte" | "refuse";
  posteVise: string;
  salaireSouhaite?: number;
  cv?: string;
  lettreMotivation?: string;
  commentaire?: string;
}

export const statutLabels = {
  actif: { label: "Actif", color: "bg-green-100 text-green-800" },
  suspendu: { label: "Suspendu", color: "bg-red-100 text-red-800" },
  conge: { label: "En congé", color: "bg-yellow-100 text-yellow-800" },
  archive: { label: "Archivé", color: "bg-gray-100 text-gray-800" },
  candidat: { label: "Candidat", color: "bg-blue-100 text-blue-800" },
};

export const statutApplicationLabels = {
  en_attente: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  en_entretien: { label: "En entretien", color: "bg-blue-100 text-blue-800" },
  accepte: { label: "Accepté", color: "bg-green-100 text-green-800" },
  refuse: { label: "Refusé", color: "bg-red-100 text-red-800" },
};

export const typeContratLabels = {
  CDI: { label: "CDI", color: "bg-green-100 text-green-800" },
  CDD: { label: "CDD", color: "bg-yellow-100 text-yellow-800" },
  Vacataire: { label: "Vacataire", color: "bg-blue-100 text-blue-800" },
  Stage: { label: "Stage", color: "bg-purple-100 text-purple-800" },
};

export const typeCodeLabels = {
  PERMANENT: { label: "Permanent", color: "bg-green-100 text-green-800" },
  TEMPORARY: { label: "Temporaire", color: "bg-yellow-100 text-yellow-800" },
  CONTRACT: { label: "Contractuel", color: "bg-blue-100 text-blue-800" },
};

// Utility function to transform API response to local Teacher interface
export function transformAPIResponseToTeacher(apiResponse: TeacherAPIResponse): Teacher {
  return {
    id: apiResponse.user_code,
    matricule: apiResponse.teacher_number,
    nom: apiResponse.last_name,
    prenom: apiResponse.first_name,
    email: apiResponse.email,
    telephone: apiResponse.phone_number,
    userName: apiResponse.user_name, 
    gender: apiResponse.gender,
    specialite: apiResponse.specialty,
    departement: "", 
    statut: apiResponse.status_code === "ACTIVE" ? "actif" : apiResponse.status_code === "SUSPENDED" ? "suspendu" : "archive",
    typeContrat: apiResponse.type_code === "PERMANENT" ? "CDI" : apiResponse.type_code === "TEMPORARY" ? "CDD" : "Vacataire",
    typeCode: apiResponse.type_code,
    dateEmbauche: apiResponse.hiring_date,
    salaire: apiResponse.salary,
    qualification: apiResponse.qualifications || "",
    experience: 0,
    evaluation: undefined, 
    matieres: [], 
    heuresEnseignement: undefined, 
  };
}