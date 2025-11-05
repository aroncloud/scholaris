import { ApplicationStatus, PlanificationStatus } from "./types/teacherTypes";

export type gender = 'FEMALE' | 'MALE';
export type ACTION = 'CREATE' | 'UPDATE' | 'DELETE' | 'DESACTIVATE' | 'ACTIVATE';
export const MARITAl_STATUS = [
  { label: "Célibataire", value: "SINGLE" },
  { label: "Marié(e)", value: "MARRIED" },
  { label: "Divorcé(e)", value: "DIVORCED" },
  { label: "Veuf(ve)", value: "WIDOWED" },
];


export const APPLICATION_STATUS = [
  { value: ApplicationStatus.PENDING, label: "En attente" },
  { value: ApplicationStatus.INTERVIEW, label: "Entretien" },
  { value: ApplicationStatus.ACCEPTED, label: "Accepté" },
  { value: ApplicationStatus.REJECTED, label: "Refusé" },
  { value: ApplicationStatus.ALL, label: "Tout" }
];

export const PLANIFICATION_FILTER = [
  { value: PlanificationStatus.CURRICULUM, label: "Curriculum" },
  { value: PlanificationStatus.TEACHER, label: "Enseignant" },
  { value: PlanificationStatus.RESSOURCE, label: "Ressource" },
];

export const INSTALLMENT_TYPES_LIST = [
  {
    "value": "INSCRIPTION",
    "title": "Frais d'Inscription",
    order: 1,
  },
  {
    "value": "TRANCHE_1",
    "title": "Première Tranche Scolarité",
    order: 2,
  },
  {
    "value": "TRANCHE_2",
    "title": "Deuxième Tranche Scolarité",
    order: 3,
  }
]


export const USER_ROLE = [
  {
      "role_code": "ADMIN_SUPER",
      "description": "Full system access, including ownership/promoter level decisions.",
      "is_active": 1,
      "title": "Super Administrateur"
  },
  {
      "role_code": "ADMIN_HR",
      "description": "Manages employee lifecycle (hiring, contracts, leave).",
      "is_active": 1,
      "title": "Administrateur RH"
  },
  {
      "role_code": "ADMIN_ACADEMIC",
      "description": "Manages student lifecycle and all curriculum data.",
      "is_active": 1,
      "title": "Administrateur Académique"
  },
  {
      "role_code": "FINANCE",
      "description": "Manages payroll, fees, and financial records.",
      "is_active": 1,
      "title": "Comptable / Service Financier"
  },
  {
      "role_code": "DEPT_HEAD",
      "description": "Managerial role for initiating recruitment and evaluating staff.",
      "is_active": 1,
      "title": "Chef de Département"
  },
  {
      "role_code": "TEACHER",
      "description": "Manages courses, students, and grades.",
      "is_active": 1,
      "title": "Enseignant"
  },
  {
      "role_code": "STUDENT",
      "description": "Access to personal academic dossier and portal.",
      "is_active": 1,
      "title": "Étudiant"
  },
  {
      "role_code": "STAFF",
      "description": "General non-teaching, non-admin employee role.",
      "is_active": 1,
      "title": "Personnel / Collaborateur"
  }
];

export const USER_TABLE_HEADERS = [
  "Utilisateur",
  "Rôles",
  "Statut",
  "Dernière connexion",
  "Actions",
];

export const CALENDAR_COLORS = ["success", "danger", "primary", "warning", "purple", "pink", "teal"];



export enum relationship_types {
    FATHER,
    MOTHER,
    SPOUSE,
    GUARDIAN,
    EMERGENCY_CONTACT
}; 


export enum student_statuses {
    ENROLLED,
    SUSPENDED,
    GRADUATED,
    DROPPED_OUT,
    TRANSFERRED
}



export enum teacher_types{
    PERMANENT,
    PART_TIME,
    CONTRACTOR,
    GUEST
}


export enum employment_statuses{
    ACTIVE,
    INACTIVE,
    ON_LEAVE,
    RETIRED,
    RESIGNED
}

export enum contract_types {
    PERMANENT,
    FIXED_TERM,
    PART_TIME,
    INTERNSHIP
}



export enum application_statuses{
    DRAFT,
    SUBMITTED,
    IN_PROGRESS,
    APPROVED,
    REJECTED,
    CONVERTED,
    CANCELED
}


export enum marital_statuses{
	SINGLE,
	MARRIED,
	DIVORCED,
	WIDOWED
}

export enum account_statuses{
	PENDING,
	ACTIVE,
	SUSPENDED,
	CLOSED
}

export enum USER_ROLES {
	ADMIN_SUPER,
	ADMIN_HR,
	ADMIN_ACADEMIC,
	FINANCE,
	DEPT_HEAD,
	TEACHER,
	STUDENT,
	STAFF
}

 
export enum assignment_statuses{
	PENDING,
	ACTIVE,
	REVOKED,
	INACTIVE
}


export enum object_levels{
	USER,
	STUDENT,
	TEACHER,
	STAFF,
	STUDENT_APPLICATION,
	TEACHER_APPLICATION,
	JOB_OFFER,
	ACADEMIC_PROGRAM,
	PROGRAM_CURRICULUM,
	MODULE,
	COURSE_UNIT,
	ENTRY_REQUEST,
	CANDIDATURE,
	JOB
}

 
export enum approval_statuses{
	DRAFT,
	PENDING,
	APPROVED,
	DECLINED,
	CANCEL,
	ACTIVE,
	ARCHIVED,
	DELETED
}

 

export enum base_statuses{
	ACTIVE,
	PENDING,
	ARCHIVED,
	INACTIVE,
	CANCEL,
	ERROR,
	SENT,
	READ
}

 
export enum content_types {
	DOCUMENT,
	CV,
	CNI_VERSO,
	CNI_RECTO,
	SELFIE,
	BIRTH_CERTIFICATE
}


// Grades Entry Constants
export const GRADES_ENTRY_CONSTANTS = {
  PAGE_TITLE: "Gestion des Notes",
  PAGE_DESCRIPTION: "Saisie et suivi des évaluations de vos étudiants",
  BUTTONS: {
    EXPORT: "Exporter",
    IMPORT: "Importer", 
    SAISIE_UE: "Saisie par UE",
    SAISIR_NOTE: "Saisir note"
  },
  TABS: {
    MATIERES: "Matières",
    SAISIE: "Saisie"
  },
  STATS: {
    TOTAL_GRADES: "Total notes",
    AVERAGE: "Moyenne générale",
    EVALUATED_STUDENTS: "Étudiants évalués", 
    PENDING: "En attente"
  },
  COURSE_LIST_TITLE: "Liste des matières enseignées"
} as const;




export const UESELECTION_CONSTANTS = {
  TITLE: "Saisir des Notes",
  SUBTITLE: "Saisie des notes par unité d'enseignement",
  HEADER: {
    BACK: "Retour",
    RESET: "Réinitialiser",
    SAVE: "Sauvegarder"
  },
  FORM: {
    TITLE: "Sélection de l'Unité d'Enseignement",
    DESCRIPTION: "Choisissez la filière, le niveau et l'UE pour saisir les notes",
    FIELDS: {
      FILIERE: {
        LABEL: "Filière",
        PLACEHOLDER: "Sélectionnez une filière"
      },
      NIVEAU: {
        LABEL: "Niveau",
        PLACEHOLDER: "Sélectionnez un niveau"
      },
      UE: {
        LABEL: "Unité d'Enseignement",
        PLACEHOLDER: "Sélectionnez une UE"
      }
    }
  }
} as const;


export type Variant =
  | "info"
  | "danger"
  | "warning"
  | "success"
  | "neutral"
  | "draft"
  | "pending"
  | "approved"
  | "progress"
  | "special"
  | "canceled"
  | "refunded";


export interface ColorConfig {
  lightBg: string;
  gradient: string;
  hover?: string;
  active?: string;
  dark?: string;
  text: string;
}

export const colorVariants: Record<Variant, ColorConfig> = {
  info: {
    lightBg: "bg-blue-50",
    gradient: "bg-gradient-to-r from-blue-600 to-blue-500",
    hover: "hover:from-blue-700 hover:to-blue-600",
    active: "active:from-blue-800 active:to-blue-700",
    dark: "dark:from-blue-700 dark:to-blue-600",
    text: "text-blue-600",
  },
  danger: {
    lightBg: "bg-red-50",
    gradient: "bg-gradient-to-r from-red-600 to-red-500",
    hover: "hover:from-red-700 hover:to-red-600",
    active: "active:from-red-800 active:to-red-700",
    dark: "dark:from-red-700 dark:to-red-600",
    text: "text-red-600",
  },
  warning: {
    lightBg: "bg-yellow-50",
    gradient: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    hover: "hover:from-yellow-600 hover:to-yellow-500",
    active: "active:from-yellow-700 active:to-yellow-600",
    dark: "dark:from-yellow-600 dark:to-yellow-500",
    text: "text-yellow-600",
  },
  success: {
    lightBg: "bg-green-50",
    gradient: "bg-gradient-to-r from-green-600 to-green-500",
    hover: "hover:from-green-700 hover:to-green-600",
    active: "active:from-green-800 active:to-green-700",
    dark: "dark:from-green-700 dark:to-green-600",
    text: "text-green-600",
  },
  neutral: {
    lightBg: "bg-gray-50",
    gradient: "bg-gradient-to-r from-gray-600 to-gray-500",
    hover: "hover:from-gray-700 hover:to-gray-600",
    active: "active:from-gray-800 active:to-gray-700",
    dark: "dark:from-gray-700 dark:to-gray-600",
    text: "text-gray-700",
  },

  // Nouveaux variants basés sur tes statuts
  draft: {
    lightBg: "bg-gray-100",
    gradient: "bg-gradient-to-r from-gray-500 to-gray-400",
    hover: "hover:from-gray-600 hover:to-gray-500",
    active: "active:from-gray-700 active:to-gray-600",
    dark: "dark:from-gray-700 dark:to-gray-500",
    text: "text-gray-600",
  },
  pending: {
    lightBg: "bg-yellow-100",
    gradient: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    hover: "hover:from-yellow-600 hover:to-yellow-500",
    active: "active:from-yellow-700 active:to-yellow-600",
    dark: "dark:from-yellow-700 dark:to-yellow-500",
    text: "text-yellow-600",
  },
  approved: {
    lightBg: "bg-green-100",
    gradient: "bg-gradient-to-r from-green-600 to-green-500",
    hover: "hover:from-green-700 hover:to-green-600",
    active: "active:from-green-800 active:to-green-700",
    dark: "dark:from-green-700 dark:to-green-600",
    text: "text-green-600",
  },
  progress: {
    lightBg: "bg-blue-100",
    gradient: "bg-gradient-to-r from-blue-600 to-blue-500",
    hover: "hover:from-blue-700 hover:to-blue-600",
    active: "active:from-blue-800 active:to-blue-700",
    dark: "dark:from-blue-700 dark:to-blue-600",
    text: "text-blue-600",
  },
  special: {
    lightBg: "bg-purple-100",
    gradient: "bg-gradient-to-r from-purple-600 to-purple-500",
    hover: "hover:from-purple-700 hover:to-purple-600",
    active: "active:from-purple-800 active:to-purple-700",
    dark: "dark:from-purple-700 dark:to-purple-600",
    text: "text-purple-700",
  },
  canceled: {
    lightBg: "bg-red-100",
    gradient: "bg-gradient-to-r from-red-600 to-red-500",
    hover: "hover:from-red-700 hover:to-red-600",
    active: "active:from-red-800 active:to-red-700",
    dark: "dark:from-red-700 dark:to-red-600",
    text: "text-red-600",
  },
  refunded: {
    lightBg: "bg-gray-200",
    gradient: "bg-gradient-to-r from-gray-500 to-gray-400",
    hover: "hover:from-gray-600 hover:to-gray-500",
    active: "active:from-gray-700 active:to-gray-600",
    dark: "dark:from-gray-700 dark:to-gray-600",
    text: "text-gray-800",
  },
};




export const SESSION_STATUS_TERMINATED = "TERMINATED"