export interface ICreateProgram {
  program_code: string;
  program_name: string;
  internal_code: string;
  degree_name: string;
  degree_code: string;
  description: string;
}

export interface ICurriculum {
  curriculum_code: string;   // Code du curriculum (ex: CURR_ATMS_Y1)
  program_code: string;      // Code du programme parent (ex: ATMS_AM)
  study_level: string;       // Niveau d’étude (ex: Année 1)
  curriculum_name: string;   // Nom du curriculum (ex: Programme Annuel - Analyses Medicales)
}

export interface ICreateProgramList {
  program_code: string;      // Code du programme (ex: ATMS_AM)
  program_name: string;      // Nom du programme (ex: Agents Techniques Medico-Sanitaires)
  internal_code: string;     // Code interne pour la gestion (ex: ATMS_AM_01)
  degree_name: string;       // Nom du diplôme délivré (ex: Diplôme d'Agent Technique Medico-Sanitaire)
  degree_code: string;       // Code du diplôme (ex: DATMS_AM)
  description: string;       // Brève description du programme
  curriculums: ICurriculum[]; // Liste des curriculums associés
}

// ------------------- Curriculum -------------------
export interface ICreateCurriculum {
  curriculum_code: string;
  program_code: string;
  study_level: string;
  curriculum_name: string;
  status_code: string;
}

// ------------------- Semester -------------------
export interface ICreateSemester {
  sequence_code: string;
  curriculum_code: string;
  sequence_name: string;
  sequence_number: string;
  status_code: string;
}

export interface ISemesterList {
  sequence_code: string;
  curriculum_code: string;
  sequence_name: string;
  sequence_number: string;
  description: string | null;
  status_code: string;
}

// ------------------- Domain -------------------
export interface ICreateDomain {
  domain_code: string;
  curriculum_code: string;
  sequence_code: string,
  domain_name: string;
  internal_code: string;
  description: string | null;
}


// ------------------- Module -------------------
export interface ICreateModule {
  module_code: string;
  domain_code: string;
  sequence_code: string;
  module_name: string;
  internal_code: string;
  coefficient: number;
  description: string | null;
}

export interface IModulePerDomain {
  module_code: string;
  domain_code: string;
  sequence_code: string;
  module_name: string;
  internal_code: string;
  description: string | null;
  coefficient: number;
}
export interface IGetModulePerCurriculum {
  module_code: string;
  domain_code: string;
  sequence_code: string;
  module_name: string;
  internal_code: string;
  description: string | null;
  coefficient: number;
  max_score: number;
}
export interface IGetCurrentAcademicYear {
  academic_year_code: string;
  year_code: string;
  start_date: string;   // format ISO: "YYYY-MM-DD"
  end_date: string;     // format ISO: "YYYY-MM-DD"
  status_code: string;  // ex: "IN_PROGRESS", "CLOSED", etc.
  description: string | null;
}
// ------------------- UE (Course Unit) -------------------
export interface ICreateUE {
  course_unit_code: string;
  module_code: string;
  course_unit_name: string;
  internal_code: string;
  lecture_hours: number;
  lab_tutorial_hours: number;
}

export interface IGetUEForTeacher {
  course_unit_code: string;
  module_code: string;
  teacher_user_code: string;
  course_unit_name: string;
  internal_code: string;
  lecture_hours: number;
  lab_tutorial_hours: number | null;
  coefficient: number;
  is_mandatory: number;
  is_module_coordinator: number; 
  status_code: string;
  max_score: number;
  curriculum_code: string;
  program_code: string;
  study_level: string;
  curriculum_name: string;
  created_at: string; 
  sequence_code: string;
  sequence_name: string;
  sequence_number: string; 
  description: string | null;
}

export interface IGetUEPerModule {
  course_unit_code: string;
  module_code: string;
  teacher_user_code: string | null;
  course_unit_name: string;
  internal_code: string;
  lecture_hours: number;
  lab_tutorial_hours: number;
  coefficient: number;
  is_mandatory: number; // 1 ou 0
  is_module_coordinator: number; // 1 ou 0
  status_code: string;
}

export interface IGetTrainingSequenceForCurriculum {
  sequence_code: string;
  curriculum_code: string;
  sequence_name: string;
  sequence_number: string;
  description: string | null;
  status_code: string;
}


export interface ICreateProgram {
  program_code: string;
  program_name: string;
  internal_code: string;
  degree_name: string;
  degree_code: string;
  description: string;
}
export interface IGetCurriculumDetail {
  curriculum_code: string;
  program_code: string;
  study_level: string;
  curriculum_name: string;
  created_at: string;
  status_code: string;
}

export interface ICreateSemester {
  curriculum_code: string;
  sequence_code: string;
  sequence_name: string;
  sequence_number: string;
  description: string | null;
  "status_code": string;
}


export interface IFactorizedProgram {
  program: ICreateProgram;
  curriculums: ICurriculumDetail[];
}


export interface ICurriculumDetail {
  curriculum_code: string;
  program_code: string;
  study_level: string;
  curriculum_name: string;
  created_at: string; // ou Date si tu veux convertir en objet Date
  status_code: string;
  program: ICreateProgram;
  training_sequences: ICreateSemester[];
  domains: IDomainPerCurriculum[];
}
export interface IDomainPerCurriculum {
  domain_code: string;
  curriculum_code: string;
  sequence_code: string | null;
  domain_name: string;
  description: string | null;
  internal_code: string;
}



export interface ICreateCurriculum {
  "curriculum_code": string,
  "program_code": string,
  "study_level": string,
  "curriculum_name": string,
  "status_code": string
}

export interface IGetUECurriculum {
  course_unit_code: string;
  module_code: string;
  teacher_user_code: string;
  course_unit_name: string;
  internal_code: string;
  lecture_hours: number;
  lab_tutorial_hours: number;
  coefficient: number;
  is_mandatory: number;
  is_module_coordinator: number;
  status_code: string;
  max_score: number;
}

export interface IAcademicYearsSchedulesForCurriculum {
  academic_year_code: string;
  academic_year_end: string;
  academic_year_name: string;
  academic_year_start: string;
  academic_year_status: string;
  curriculum_code: string;
  curriculum_name: string;
  end_date: string;
  program_code: string;
  program_name: string;
  schedule_code: string;
  sequence_code: string;
  sequence_name: string;
  sequence_number: string;
  start_date: string;
  status_code: string;
}


export interface ICreateCurriculum {
  "curriculum_code": string,
  "program_code": string,
  "study_level": string,
  "curriculum_name": string,
  "status_code": string
}


export interface IGetEnrollmentHistory {
  enrollment_code: string;
  student_user_code: string;
  academic_year_code: string;
  curriculum_code: string;
  status_code: string;
  enrollment_date: string;
  notes: string;
  academic_year: {
    academic_year_code: string;
    year_code: string;
    start_date: string;
    end_date: string;
    status_code: string;
  };
  cirriculum: {
    curriculum_code: string;
    curriculum_name: string;
    study_level: string;
    program_code: string;
    program_name: string;
  };
}

// export interface IGetEnrollmentHistoryResponse {
//   code: string;
//   message: string;
//   exit: string;
//   body: IGetEnrollmentHistory[];
// }
export interface IEnrollmentResponse {
  code: string;
  message: string;
  exit: string;
  body: IGetEnrollmentHistory[];
}


export interface IStudentDetail {
  user_code: string;
  curriculum_code: string;
  student_number: string;
  status_code: string;
  enrollment_date: string;
  education_level_code: string;
  financial_status: string;
  academic_year_code: string;
  notes: string;
  cirriculum: {
    curriculum_code: string;
    curriculum_name: string;
    study_level: string;
    program_code: string;
    program_name: string;
  };
}

export interface IStudentDetailResponse {
  code: string;
  message: string;
  exit: string;
  body: IStudentDetail;
}

export interface ICreateEnrollment {
  academic_year_code: string;
  curriculum_code: string;
  notes?: string;
//   status_code?: string;
}


/**
 * Représente les informations détaillées d'une unité d'enseignement (UE) ou d'un cours.
 */
export interface IGetTeacherCourseUnit {
  /** Code unique de l'unité d'enseignement (ex: "UE_IDE_CELL_TISSUE_AFF"). */
  course_unit_code: string;
  
  /** Code du module auquel l'UE appartient (ex: "MOD_IDE_MED_AFF_1"). */
  module_code: string;
  
  /** Code utilisateur de l'enseignant responsable de l'UE. */
  teacher_user_code: string;
  
  /** Nom complet de l'unité d'enseignement (ex: "Cellules et Tissus"). */
  course_unit_name: string;
  
  /** Code interne spécifique (ex: "IDE2511"). */
  internal_code: string;
  
  /** Nombre d'heures de cours magistraux. */
  lecture_hours: number;
  
  /** Nombre d'heures de travaux dirigés/pratiques (peut être null). */
  lab_tutorial_hours: number | null;
  
  /** Coefficient ou crédits de l'unité d'enseignement. */
  coefficient: number;
  
  /** Indicateur si l'UE est obligatoire (1 pour oui, 0 pour non). */
  is_mandatory: 0 | 1;
  
  /** Indicateur si l'enseignant est le coordinateur du module (0 pour non, 1 pour oui). */
  is_module_coordinator: 0 | 1;
  
  /** Statut de l'UE (ex: "ACTIVE"). */
  status_code: string;
  
  /** Note maximale attribuable pour cette UE. */
  max_score: number;
  
  /** Code du cursus auquel l'UE est associée (ex: "CURR_IDE_Y2"). */
  curriculum_code: string;
  
  /** Code du programme d'études (ex: "TPMS_SP"). */
  program_code: string;
  
  /** Niveau d'étude associé à l'UE (ex: "Année 1"). */
  study_level: string;
  
  /** Nom complet du cursus (ex: "Programme de Première Année - Sciences Pharmaceutiques"). */
  curriculum_name: string;
  
  /** Date et heure de création de l'enregistrement. */
  created_at: string; // Utiliser 'Date' si vous parsez la chaîne
  
  /** Code de la séquence ou du semestre (ex: "SEQ_IDE_Y2_S3"). */
  sequence_code: string;
  
  /** Nom lisible de la séquence (ex: "3ème Séquence"). */
  sequence_name: string;
  
  /** Numéro de la séquence (ex: "3"). */
  sequence_number: string;
  
  /** Description de l'unité d'enseignement (peut être null). */
  description: string | null;
}