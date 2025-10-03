export interface Absence {
  id: string;
  absence_code: string;
  status_code: 'JUSTIFIED' | 'UNJUSTIFIED' | 'PENDING' | 'PENDING_REVIEW';
  recorded_at: string;
  enrollment_code: string;
  student_user_code: string;
  first_name: string;
  last_name: string;
  student_number: string;
  session_title: string;
  start_time: string;
  end_time: string;
  schedule_code: string;
  course_unit_name: string;
  
  // Legacy fields for backward compatibility
  studentId?: string;
  courseId?: string;
  courseName?: string;
  teacherName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  type?: 'COURSE' | 'TP' | 'TD' | 'EXAM';
  status?: 'JUSTIFIED' | 'UNJUSTIFIED' | 'PENDING' | 'PENDING_REVIEW';
  justification?: {
    id: string;
    type: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW';
    fileUrl?: string;
    comment?: string;
    submittedAt: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AbsenceApiResponse {
  code: string;
  message: string;
  exit: string;
  body: Absence[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface AbsenceFilters {
  startDate?: string;
  endDate?: string;
  status?: 'JUSTIFIED' | 'UNJUSTIFIED' | 'PENDING';
  type?: 'COURSE' | 'TP' | 'TD' | 'EXAM';
  courseId?: string;
}

export interface UseStudentAbsenceDataProps {
  filters?: AbsenceFilters;
  enabled?: boolean;
}

// In studentmyabsencesTypes.ts
export interface SubmitJustificationParams {
  absence_codes: string[];
  reason: string;
  files: Array<{
    content_url?: string;
    title: string;
    type_code: string;
    file?: File;
    name?: string;
    [key: string]: any; // Allow additional properties
  }>;
  // For internal use only
  type?: string;
  selectedAbsences?: string[];
  file?: File;
}

export interface JustificationFile {
  content_url?: string;
  title: string;
  type_code: string;
  file?: File;
  name?: string;
  [key: string]: any; // Allow additional properties
}


export interface JustificationResponse {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fileUrl: string;
  comment?: string;
  submittedAt: string;
}

// / Define the UI-specific absence type that matches the AbsenceHistorySection's expected type
export interface UIAbsence {
  id: number;
  dateAbsence: string;
  heureDebut: string;
  heureFin: string;
  dureeHeures: number;
  ue: string;
  cours: string;
  absence_code?: string;
  status_code?: 'JUSTIFIED' | 'UNJUSTIFIED' | 'PENDING' | 'PENDING_REVIEW';
  enseignant: string;
  type: 'cours' | 'tp' | 'td' | 'examen';
  statut: 'non_justifiee' | 'justifiee' | 'en_attente';
  justificatifId?: number;
  motif?: string;
}

export interface JustificationFormData {
  type: string;
  file: File | null;
  description: string;
  selectedAbsences: string[];
  files?: Array<{
    file: File;
    name: string;
    title: string;
    type_code: string;
  }>;
  reason?: string;
}
export interface BaseAbsence {
  id: string | number;
  absence_code?: string;
  dateAbsence?: string;
  heureDebut?: string;
  heureFin?: string;
  dureeHeures?: number;
  ue?: string;
  cours?: string;
  enseignant?: string;
  type?: string;
  statut?: string;
  status_code?: string;
  _uniqueKey?: string;
  [key: string]: any; // Allow additional properties
}


export interface AbsenceData {
  id: string;
  dateAbsence?: string;
  timeSlot?: string;
}

export interface JustificationRequest {
  absence_codes: string[];
  reason: string;
  files: Array<{
    content_url: string;
    title: string;
    type_code: string;
  }>;
}
export interface SubmitJustificationPayload {
  type: string;
  reason: string;
  files: Array<{
    file?: File;
    content_url?: string;
    name: string;
    title: string;
    type_code: string;
  }>;
  selectedAbsences: string[];
  absence_codes?: string[];
  absenceIds?: string[];
  type_code?: string;
}
