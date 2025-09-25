export interface ICreateEvaluation {
  curriculum_code: string;
  target_level: "COURSE_UNIT" | "MODULE" | string;
  schedule_code: string;
  evaluation_type_code: "CC" | "EXAM_SEQ" | string;
  academic_year_code: string;
  title: string;
  deadline: string; // format ISO date "YYYY-MM-DD"
  status_code: string; 
}


export interface IGetEvaluationsForCurriculum {
  evaluation_code: string;
  target_code: string;
  target_level: "COURSE_UNIT" | "MODULE" | string;
  schedule_code: string;
  evaluation_type_code: "CC" | "EXAM_SEQ" | string;
  coefficient: number;
  title: string;
  evaluation_date: string | null; 
  deadline_date: string;
  max_score: number;
  status:  string;
}