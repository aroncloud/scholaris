'use server';

import { verifySession } from '@/lib/session';
import { EvaluationKind, GradeEntry, Student, TeacherCourse, GradesStats } from '@/types/gradeTypes';
import axios from 'axios';
import { actionErrorHandler } from './errorManagement';

// ---- MOCK DATA ----
const mockTeacherCourses: TeacherCourse[] = [
  { id: 'c1', name: 'Anatomie générale', code: 'ANAT101', filiere: 'Pharmacie', niveau: 'Année 1', studentsCount: 45 },
  { id: 'c2', name: 'Physiologie spécialisée', code: 'PHYS201', filiere: 'Médecine', niveau: 'Année 2', studentsCount: 38 },
  { id: 'c3', name: 'TP Anatomie', code: 'TPAN101', filiere: 'Kinésithérapie', niveau: 'Année 1', studentsCount: 22 },
];

const mockStudentsByCourse: Record<string, Student[]> = {
  c1: Array.from({ length: 8 }).map((_, i) => ({ id: `s1${i}`, matricule: `ETU24${100+i}`, firstName: 'Marie', lastName: `Dupont-${i}` })),
  c2: Array.from({ length: 7 }).map((_, i) => ({ id: `s2${i}`, matricule: `ETU24${200+i}`, firstName: 'Jean', lastName: `Martin-${i}` })),
  c3: Array.from({ length: 5 }).map((_, i) => ({ id: `s3${i}`, matricule: `ETU24${300+i}`, firstName: 'Sophie', lastName: `Bernard-${i}` })),
};

const mockGrades: GradeEntry[] = [
  { 
    id: 'g1', 
    courseId: 'c1', 
    studentId: 's10', 
    matricule: 'ETU24100', 
    evaluation: 'TP', 
    value: 14, 
    max: 20, 
    date: '2025-01-15' 
  },
  { 
    id: 'g2', 
    courseId: 'c1', 
    studentId: 's11', 
    matricule: 'ETU24101', 
    evaluation: 'CC', 
    value: 12, 
    max: 20, 
    date: '2025-01-16' 
  },
  { 
    id: 'g3', 
    courseId: 'c2', 
    studentId: 's21', 
    matricule: 'ETU24200', 
    evaluation: 'SN', 
    value: 16, 
    max: 20, 
    date: '2025-01-20' 
  },
];

// ---- ACTIONS ----
export async function getTeacherCourses(): Promise<TeacherCourse[]> {
  return mockTeacherCourses;
}

export async function getCourseStudents(courseId: string): Promise<Student[]> {
  return mockStudentsByCourse[courseId] || [];
}

export async function getCourseGrades(courseId: string, evaluation?: EvaluationKind): Promise<GradeEntry[]> {
  let data = mockGrades.filter(g => g.courseId === courseId);
  if (evaluation) data = data.filter(g => g.evaluation === evaluation);
  return data;
}

export async function saveGrade(entry: Omit<GradeEntry, 'id' | 'date'> & { date?: string }): Promise<GradeEntry> {
  const newEntry: GradeEntry = {
    id: `g${Date.now()}`,
    date: entry.date || new Date().toISOString().split('T')[0],
    ...entry,
  };
  mockGrades.push(newEntry);
  return newEntry;
}

export async function updateGrade(entryId: string, patch: Partial<GradeEntry>): Promise<GradeEntry | null> {
  const idx = mockGrades.findIndex(g => g.id === entryId);
  if (idx === -1) return null;
  mockGrades[idx] = { ...mockGrades[idx], ...patch };
  return mockGrades[idx];
}

export async function getGradesStats(courseId?: string): Promise<GradesStats> {
  const data = courseId ? mockGrades.filter(g => g.courseId === courseId) : mockGrades;
  const totalGrades = data.length;
  const distinctStudents = new Set(data.map(g => g.studentId)).size;
  const averageOn20 = totalGrades
    ? Math.round((data.reduce((s, g) => s + (g.value / g.max) * 20, 0) / totalGrades) * 10) / 10
    : 0;
  const pendingCount = Math.max(0, 20 - totalGrades); // mock
  return { totalGrades, averageOn20, distinctStudents, pendingCount };
}


export async function getStudentReport(academic_year_code: string) {
  try {
    console.log("-->getStudentReport.academic_year_code", academic_year_code);
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.GRADE_WORKER_ENDPOINT}/api/students/my-results`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          academic_year_code,
        },
      }
    );

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->getStudentReport.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}
