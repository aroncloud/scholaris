export interface ICreateEvaluation {
  curriculum_code: string;
  target_level: "COURSE_UNIT" | "MODULE" | string;
  schedule_code: string;
  evaluation_type_code: "CC" | "EXAM_SEQ" | string;
  academic_year_code: string;
  title: string;
  deadline: string;
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


export interface IEvaluationDetail {
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
    status: 'READY_FOR_GRADING' | string; 
}

/**
 * Interface pour les informations d'un étudiant dans le contexte de l'évaluation.
 */
export interface IStudentEvaluationInfo {
    user_code: string;
    student_number: string;
    first_name: string;
    last_name: string;
    enrollment_code: string;
    graded: boolean;
    score: number;
}

/**
 * Interface racine pour l'objet complet.
 * Représente la feuille d'évaluation globale.
 */
export interface EvaluationSheet {
  evaluation: IEvaluationDetail;
  students: IStudentEvaluationInfo[];
}

export interface ISubmitGrades {
  "enrollment_code": string,
  "score": number,
  "status_code": string
  "comments": string
}