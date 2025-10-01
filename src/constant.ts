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

