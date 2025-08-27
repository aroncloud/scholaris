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
  domain_name: string;
  internal_code: string;
}


// ------------------- Module -------------------
export interface ICreateModule {
  module_code: string;
  domain_code: string;
  sequence_code: string;
  module_name: string;
  internal_code: string;
  coefficient: number;
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

// ------------------- UE (Course Unit) -------------------
export interface ICreateUE {
  course_unit_code: string;
  module_code: string;
  course_unit_name: string;
  internal_code: string;
  lecture_hours: number;
  lab_tutorial_hours: number;
}

export interface IUEPerModuleList {
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



export interface ICreateProgram {
  program_code: string;
  program_name: string;
  internal_code: string;
  degree_name: string;
  degree_code: string;
  description: string;
}

export interface ITrainingSequence {
  curriculum_code: string;
  sequence_code: string;
  sequence_name: string;
  sequence_number: string;
  description: string | null;
}

export interface ICurriculumDetail {
  curriculum_code: string;
  program_code: string;
  study_level: string;
  curriculum_name: string;
  created_at: string;
  status_code: string;
  training_sequences: ITrainingSequence[];
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
  training_sequences: ITrainingSequence[];
}

export interface ICreateCurriculum {
  "curriculum_code": string,
  "program_code": string,
  "study_level": string,
  "curriculum_name": string,
  "status_code": string
}