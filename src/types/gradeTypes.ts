export type EvaluationKind = 'TP' | 'CC' | 'SN';

export interface TeacherCourse {
  id: string;
  name: string;
  code: string;
  filiere: string;
  niveau: string;
  studentsCount: number;
}

export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
}

export interface GradeEntry {
  id: string;
  courseId: string;
  studentId: string;
  evaluation: EvaluationKind;
  value: number; // value on 20
  max: number;   // default 20
  date: string;  // ISO date
  comment?: string;
}

export interface GradesStats {
  totalGrades: number;
  averageOn20: number;
  distinctStudents: number;
  pendingCount: number;
}


