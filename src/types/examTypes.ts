export interface ICreateEvaluation {
  target_code: string;
  target_level: string;
  schedule_code: string;
  evaluation_type_code: string; //"CC" | "TP" | "EXAM";
  title: string;
  evaluation_date: string;
  max_score: number;
  coefficient: number;
  status: string; //"DRAFT" | "READY_FOR_GRADING" | "GRADING_IN_PROGRESS" | "GRADED" | "PUBLISHED";
  curriculum_code: string;
  academic_year_code: string
}

