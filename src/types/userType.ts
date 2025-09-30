// Interface pour les types de relation
export interface IRelative {
  relationship_type_code: string;
  person_code: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  occupation: string;
}

// Interface pour le curriculum
export interface ICurriculum {
  curriculum_code: string;
  curriculum_name: string;
  study_level: string;
  program_code: string;
  program_name: string;
}

// Interface pour les documents
export interface IDocument {
  // À définir selon vos besoins
  document_id?: string;
  document_type?: string;
  document_name?: string;
  document_url?: string;
  uploaded_at?: string;
}

// Interface principale pour le détail de l'application
export interface IGetApplicationDetail {
  application_code: string;
  curriculum_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  email: string;
  gender: string;
  region_code: string | null;
  department_code: string | null;
  arrondissement_code: string | null;
  village: string;
  education_level_code: string;
  ethnicity_code: string | null;
  marital_status_code: string | null;
  country: string | null;
  city: string | null;
  street: string | null;
  address_details: string | null;
  cni_number: string;
  cni_issue_date: string;
  cni_issue_location: string;
  application_status_code: string;
  submitted_at: string;
  processed_at: string;
  rejection_reason: string;
  phone_number: string;
  converted_to_user_code: string;
  processed_user_code: string;
  cirriculum: ICurriculum;
  relatives: IRelative[];
  documents: IDocument[];
}

export interface IGetUserDetail {
  application_code: string;
  curriculum_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  email: string;
  gender: string;
  region_code: string | null;
  department_code: string | null;
  arrondissement_code: string | null;
  village: string;
  education_level_code: string;
  ethnicity_code: string | null;
  marital_status_code: string | null;
  country: string | null;
  city: string | null;
  street: string | null;
  address_details: string | null;
  cni_number: string;
  cni_issue_date: string;
  cni_issue_location: string;
  application_status_code: string;
  submitted_at: string;
  processed_at: string;
  rejection_reason: string;
  phone_number: string;
  converted_to_user_code: string;
  processed_user_code: string;
  cirriculum: ICurriculum;
  relatives: IRelative[];
  documents: IDocument[];
}

export type Role = {
  name: string;
  description: string;
  users: number;
  permissions: string[];
};


export interface EnrollmentHistory {
  enrollment_code: string;
  student_user_code: string;
  academic_year_code: string;
  curriculum_code: string;
  status_code: string;
  enrollment_date: string;
  notes: string;
  financial_status?: string;
  academic_year?: {
    academic_year_code: string;
    year_code: string;
    start_date: string;
    end_date: string;
    status_code: string;
  };
  cirriculum?: {
    curriculum_code: string;
    curriculum_name: string;
    study_level: string;
    program_code: string;
    program_name: string;
  };
  curriculum_name?: string;
  program_name?: string;
  program_code?: string;
  study_level?: string;
}

export interface ReenrollmentEligibility {
  isEligible: boolean;
  message: string;
  loading: boolean;
  error: string | null;
  lastEnrollment?: {
    academic_year_code: string;
    curriculum_code: string;
    status: string;
  };
  requirements: {
    hasOutstandingFees: boolean;
    hasCompletedPreviousYear: boolean;
    isAccountActive: boolean;
  };
}