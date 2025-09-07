export interface ICourse {
  id: string;
  title: string;
  code: string;
  program: string;
  year: number;
  status: 'En cours' | 'Terminé' | 'Planifié';
  progress: number;
  totalHours: number;
  completedHours: number;
  students: number;
  credits: number;
  nextSession?: {
    type: string;
    date: string;
    duration: string;
  };
  teacher: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseStats {
  activeCourses: number;
  totalStudents: number;
  hoursTaught: number;
  averageProgress: number;
}

export interface CourseFilters {
  search: string;
  status: string;
  program: string;
  year: number | null;
}

export interface CourseSession {
  id: string;
  courseId: string;
  type: string;
  date: Date;
  duration: number;
  location?: string;
  description?: string;
  status: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé';
}

export interface CourseAssignment {
  id: string;
  courseId: string;
  teacherId: string;
  assignedAt: Date;
  status: 'Actif' | 'Suspendu' | 'Terminé';
  notes?: string;
}
