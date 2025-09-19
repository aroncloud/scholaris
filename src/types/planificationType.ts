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