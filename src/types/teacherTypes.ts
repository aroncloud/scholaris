export interface Teacher {
  user_code: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: number;       // timestamp en secondes
  updated_at: number;       // timestamp en secondes
  last_login_at: number | null;
  status_code: "ACTIVE" | "INACTIVE" | "SUSPENDED"; // on peut typer avec des unions
  phone_number: string;
  gender: "MALE" | "FEMALE"; // union pour éviter les valeurs libres
  teacher_number: string;
  specialty: string;
  employment_status_code: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  type_code: "PERMANENT" | "TEMPORARY" | "CONTRACT";
  qualifications: string;
  hiring_date: string;      // format ISO date ex: "2020-01-23"
  salary: number;
}

export interface CreateTeacherRequest {
  user_name?: string;
  password_plaintext?: string;
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

export interface TeacherDocument {
  type_code: string;
  title: string;
  content_url: string;
}

export interface TeacherRelative {
  // Tu pourras ajouter les champs nécessaires plus tard, par exemple :
  name?: string;
  relation?: string;
  contact?: string;
}

export interface CreateTeacherApplication {
  job_offer_code: string;
  applicant_email: string;
  applicant_first_name: string;
  applicant_last_name: string;
  is_from_previous_institution: boolean;
  documents?: TeacherDocument[];
  relatives?: TeacherRelative[];
  years_experience: number;
  phone_number: string;
  specialty: string;
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  INTERVIEW = "INTERVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  ALL = "ALL"
}

export interface GetTeacherApplication {
  applicant_email: string;
  applicant_first_name: string;
  applicant_last_name: string;
  is_from_previous_institution: boolean;
  documents?: TeacherDocument[];
  relatives?: TeacherRelative[];
  status_code: ApplicationStatus; // ✅ utilise l'enum
  user_code: string;
  created_at: number;
  phone_number: string;
  specialty: string;
  years_experience: number;
  application_code: string;
  job: {
    job_offer_title?: string;
    job_offer_code: string;
  };
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