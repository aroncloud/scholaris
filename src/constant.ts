import { ApplicationStatus } from "./types/teacherTypes";

export type gender = 'FEMALE' | 'MALE';
export type ACTION = 'CREATE' | 'UPDATE' | 'DELETE' | 'DESACTIVATE' | 'ACTIVATE';
export const maritalStatus = [
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

export const USER_ROLE = [
  { value: "ALL", label: "Tous les rôles" },
  { value: "STUDENT", label: "Étudiants" },
  { value: "TEACHER", label: "Enseignants" },
  { value: "RH", label: "RH" },
  { value: "REGISTAR_OFFICE", label: "Scolarité" },
  { value: "ADMIN", label: "Administrateurs" },
];

export const USER_TABLE_HEADERS = [
  "Utilisateur",
  "Rôles",
  "Statut",
  "Dernière connexion",
  "Actions",
];





export enum relationship_types {
    FATHER,
    MOTHER,
    SPOUSE,
    GUARDIAN,
    EMERGENCY_CONTACT
}; 
// INSERT INTO relationship_types VALUES('FATHER','Father',NULL);
// INSERT INTO relationship_types VALUES('MOTHER','Mother',NULL);
// INSERT INTO relationship_types VALUES('SPOUSE','Spouse',NULL);
// INSERT INTO relationship_types VALUES('GUARDIAN','Guardian',NULL);
// INSERT INTO relationship_types VALUES('EMERGENCY_CONTACT','Emergency Contact',NULL);

export enum student_statuses {
    ENROLLED,
    SUSPENDED,
    GRADUATED,
    DROPPED_OUT,
    TRANSFERRED
}

// INSERT INTO student_statuses VALUES('ENROLLED','Enrolled',NULL);
// INSERT INTO student_statuses VALUES('SUSPENDED','Suspended',NULL);
// INSERT INTO student_statuses VALUES('GRADUATED','Graduated',NULL);
// INSERT INTO student_statuses VALUES('DROPPED_OUT','Dropped Out',NULL);
// INSERT INTO student_statuses VALUES('TRANSFERRED','Transferred',NULL);


export enum teacher_types{
    PERMANENT,
    PART_TIME,
    CONTRACTOR,
    GUEST
}

// INSERT INTO teacher_types VALUES('PERMANENT','Permanent',NULL);
// INSERT INTO teacher_types VALUES('PART_TIME','Part-Time',NULL);
// INSERT INTO teacher_types VALUES('CONTRACTOR','Contractor',NULL);
// INSERT INTO teacher_types VALUES('GUEST','Guest',NULL);
 
export enum employment_statuses{
    ACTIVE,
    INACTIVE,
    ON_LEAVE,
    RETIRED,
    RESIGNED
}
// INSERT INTO employment_statuses VALUES('ACTIVE','Active',NULL);
// INSERT INTO employment_statuses VALUES('INACTIVE','Inactive',NULL);
// INSERT INTO employment_statuses VALUES('ON_LEAVE','On Leave',NULL);
// INSERT INTO employment_statuses VALUES('RETIRED','Retired',NULL);
// INSERT INTO employment_statuses VALUES('RESIGNED','Resigned',NULL);
 
export enum contract_types {
    PERMANENT,
    FIXED_TERM,
    PART_TIME,
    INTERNSHIP
}


// INSERT INTO contract_types VALUES('PERMANENT','Permanent',NULL);
// INSERT INTO contract_types VALUES('FIXED_TERM','Fixed-Term',NULL);
// INSERT INTO contract_types VALUES('PART_TIME','Part-Time',NULL);
// INSERT INTO contract_types VALUES('INTERNSHIP','Internship',NULL);

export enum application_statuses{
    DRAFT,
    SUBMITTED,
    IN_PROGRESS,
    APPROVED,
    REJECTED,
    CONVERTED,
    CANCELED
}
// INSERT INTO application_statuses VALUES('DRAFT','Draft','Application started but not submitted');
// INSERT INTO application_statuses VALUES('SUBMITTED','Submitted','Application has been submitted for review');
// INSERT INTO application_statuses VALUES('IN_PROGRESS','In Progress','Application is actively being reviewed');
// INSERT INTO application_statuses VALUES('APPROVED','Approved','Application has been approved');
// INSERT INTO application_statuses VALUES('REJECTED','Rejected','Application has been rejected');
// INSERT INTO application_statuses VALUES('CONVERTED','Converted','Application has been converted to a student profile');
// INSERT INTO application_statuses VALUES('CANCELED','Canceled','Application was canceled by the applicant or admin');

export enum marital_statuses{
	SINGLE,
	MARRIED,
	DIVORCED,
	WIDOWED
}

// INSERT INTO marital_statuses VALUES('SINGLE','Single');
// INSERT INTO marital_statuses VALUES('MARRIED','Married');
// INSERT INTO marital_statuses VALUES('DIVORCED','Divorced');
// INSERT INTO marital_statuses VALUES('WIDOWED','Widowed'); 

export enum account_statuses{
	PENDING,
	ACTIVE,
	SUSPENDED,
	CLOSED
}
// INSERT INTO account_statuses VALUES('PENDING',1,'PENDING');
// INSERT INTO account_statuses VALUES('ACTIVE',1,'ACTIVE');
// INSERT INTO account_statuses VALUES('SUSPENDED',1,'SUSPENDED');
// INSERT INTO account_statuses VALUES('CLOSED',1,'CLOSED');

export enum user_roles{
	ADMIN_SUPER,
	ADMIN_HR,
	ADMIN_ACADEMIC,
	FINANCE,
	DEPT_HEAD,
	TEACHER,
	STUDENT,
	STAFF
}
// INSERT INTO user_roles VALUES('ADMIN_SUPER','Full system access, including ownership/promoter level decisions.',1,'Super Administrateur');
// INSERT INTO user_roles VALUES('ADMIN_HR','Manages employee lifecycle (hiring, contracts, leave).',1,'Administrateur RH');
// INSERT INTO user_roles VALUES('ADMIN_ACADEMIC','Manages student lifecycle and all curriculum data.',1,'Administrateur Académique');
// INSERT INTO user_roles VALUES('FINANCE','Manages payroll, fees, and financial records.',1,'Comptable / Service Financier');
// INSERT INTO user_roles VALUES('DEPT_HEAD','Managerial role for initiating recruitment and evaluating staff.',1,'Chef de Département');
// INSERT INTO user_roles VALUES('TEACHER','Manages courses, students, and grades.',1,'Enseignant');
// INSERT INTO user_roles VALUES('STUDENT','Access to personal academic dossier and portal.',1,'Étudiant');
// INSERT INTO user_roles VALUES('STAFF','General non-teaching, non-admin employee role.',1,'Personnel / Collaborateur');
 
 
export enum assignment_statuses{
	PENDING,
	ACTIVE,
	REVOKED,
	INACTIVE
}
// INSERT INTO assignment_statuses VALUES('PENDING',1,'PENDING');
// INSERT INTO assignment_statuses VALUES('ACTIVE',1,'ACTIVE');
// INSERT INTO assignment_statuses VALUES('REVOKED',1,'REVOKED');
// INSERT INTO assignment_statuses VALUES('INACTIVE',1,'INACTIVE'); 

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
// INSERT INTO object_levels VALUES('USER',1,'User');
// INSERT INTO object_levels VALUES('STUDENT',1,'Student');
// INSERT INTO object_levels VALUES('TEACHER',1,'Teacher');
// INSERT INTO object_levels VALUES('STAFF',1,'Staff');
// INSERT INTO object_levels VALUES('STUDENT_APPLICATION',1,'Student Application');
// INSERT INTO object_levels VALUES('TEACHER_APPLICATION',1,'Teacher Application');
// INSERT INTO object_levels VALUES('JOB_OFFER',1,'Job Offer');
// INSERT INTO object_levels VALUES('ACADEMIC_PROGRAM',1,'Academic Program');
// INSERT INTO object_levels VALUES('PROGRAM_CURRICULUM',1,'Program Curriculum');
// INSERT INTO object_levels VALUES('MODULE',1,'Module');
// INSERT INTO object_levels VALUES('COURSE_UNIT',1,'Course Unit');
// INSERT INTO object_levels VALUES('ENTRY_REQUEST',1,'Entry Request');
// INSERT INTO object_levels VALUES('CANDIDATURE',1,'Candidature');
// INSERT INTO object_levels VALUES('JOB',1,'Job');
 
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
// INSERT INTO approval_statuses VALUES('DRAFT',1,'Draft');
// INSERT INTO approval_statuses VALUES('PENDING',1,'Pending / Waiting');
// INSERT INTO approval_statuses VALUES('APPROVED',1,'Approved / Validated');
// INSERT INTO approval_statuses VALUES('DECLINED',1,'Declined / Rejected');
// INSERT INTO approval_statuses VALUES('CANCEL',1,'Cancelled');
// INSERT INTO approval_statuses VALUES('ACTIVE',1,'Active');
// INSERT INTO approval_statuses VALUES('ARCHIVED',1,'Archived');
// INSERT INTO approval_statuses VALUES('DELETED',1,'Deleted');
 

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

// INSERT INTO base_statuses VALUES('ACTIVE',1,'Active');
// INSERT INTO base_statuses VALUES('PENDING',1,'Pending');
// INSERT INTO base_statuses VALUES('ARCHIVED',1,'Archived');
// INSERT INTO base_statuses VALUES('INACTIVE',1,'Inactive');
// INSERT INTO base_statuses VALUES('CANCEL',1,'Cancelled');
// INSERT INTO base_statuses VALUES('ERROR',1,'In Error');
// INSERT INTO base_statuses VALUES('SENT',1,'Is Sent');
// INSERT INTO base_statuses VALUES('READ',1,'Read');
 
export enum content_types {
	DOCUMENT,
	CV,
	CNI_VERSO,
	CNI_RECTO,
	SELFIE,
	BIRTH_CERTIFICATE
}
// INSERT INTO content_types VALUES('DOCUMENT',1,'Generic Document');
// INSERT INTO content_types VALUES('CV',1,'CV');
// INSERT INTO content_types VALUES('CNI_VERSO',1,'ID Card (Back)');
// INSERT INTO content_types VALUES('CNI_RECTO',1,'ID Card (Front)');
// INSERT INTO content_types VALUES('SELFIE',1,'Selfie');
// INSERT INTO content_types VALUES('BIRTH_CERTIFICATE',1,'Birth Certificate'); 