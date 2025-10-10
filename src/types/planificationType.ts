export interface ICreateSession {
  course_unit_code: string;
  teacher_user_code?: string;
  schedule_code: string;
  resource_code: string;
  academic_year_code: string;
  session_title: string;
  start_time: string;
  end_time: string;
  curriculum_code: string;
  recurrence?: {
    "frequency": "WEEKLY" | "MONTHLY ",
    "count": 10,
    byday: string[]//,"byday" : ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] // optional
  }
}



export interface IGetSchedule {
  session_code: string;
  course_unit_code: string;
  teacher_user_code: string;
  schedule_code: string;
  resource_code: string;
  status_code: string;
  start_time: string; 
  end_time: string;
  session_title: string;
  recurrence_rule: string | null;
  parent_session_code: string | null;
  "resource_name": string,
  "teacher_first_name": string,
  "teacher_last_name": string
}


export interface ICreateAcademicYearSchedules {
  academic_year_code: string;
  sequence_code: string;
  start_date: string;
  end_date: string; 
  status_code: string;
}

export interface IGetAcademicYearSchedule {
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


export interface IGetAcademicYears {
  academic_year_code: string; // ex: "ay-2030-2031"
  year_code: string;          // ex: "2030-2031"
  start_date: string;         // ISO date string, ex: "2030-12-22"
  end_date: string;           // ISO date string, ex: "2031-12-22"
  status_code: string;        // ex: "PLANNED"
  description: string | null; // ex: null ou texte
}

export interface ICreateAcademicYear {
  year_code: string;         // ex: "2024-2025"
  start_date: string;        // ISO date string, ex: "2024-10-01"
  end_date: string;          // ISO date string, ex: "2025-07-31"
  status_code: string; 
}


export interface IGetAcademicYearsSchedulesForCurriculum {
  schedule_code: string;
  start_date: string;
  end_date: string;
  status_code: string;
  sequence_code: string;
  sequence_name: string;
  sequence_number: string;
  curriculum_code: string;
  curriculum_name: string;
  program_code: string;
  program_name: string;
  academic_year_code: string;
  academic_year_name: string;
  academic_year_start: string;
  academic_year_end: string;
  academic_year_status: string;
}

export interface ICreateValidationRule {
  curriculum_code: string;          // code de la filière
  academic_year_code: string;       // code de l'année académique
  rule_type: string;
  formula_json: {
    CONTROLE_CONTINU: number;       // ex: 0.3
    EXAMEN_SEQUENTIEL: number;      // ex: 0.7
  };
  validation_threshold: number;     // ex: 12.0
}


export interface IGetStudentAttendence {
  user_code: string;
  enrollment_code: string;
  first_name: string;
  last_name: string;
  student_number: string;
  is_present: boolean;
}

export interface IGetAbsencesListRequest {
  curriculumn_code: string;
  schedule_code: string
  limit: number;
  offset: number;
}



export interface IGetJustificationDetail {
  absence_code: string;
  absence_status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | string; // tu peux ajuster les statuts connus
  recorded_at: string; // format "YYYY-MM-DD HH:mm:ss"
  session: {
    session_code: string;
    session_title: string;
    start_time: string; // format ISO "YYYY-MM-DDTHH:mm:ssZ"
    course_unit_name: string;
    teacher_name: string;
  };
  justification: {
    justification_code: string;
    justification_status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | string;
    reason: string;
    submitted_at: string;
    processed_at: string | null;
    rejection_reason: string | null;
    documents: {
      content_code: string;
      title: string;
      content_url: string;
      type_code: 'MEDICAL_CERTIFICATE' | 'OTHER' | string;
    }[];
  };
}