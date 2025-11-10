export interface IGetStudentAbsence {
  absence_code: string;
  status_code: string;
  recorded_at: string;
  enrollment_code: string;
  student_user_code: string;
  first_name: string;
  last_name: string;
  student_number: string;
  session_title: string;
  start_time: string;
  schedule_code: string;
  course_unit_name: string;
}

export type JustificationStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

export interface IAbsenceRecord {
  absence_id: string;
  session_id: string;
  session_code: string;
  course_name: string;
  group_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room: string;
  instructor_name: string;
  justification_status: JustificationStatus;
  justification_reason?: string;
  justification_details?: string;
  justification_document?: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewer_comment?: string;
  created_at: string;
}

export interface IJustificationSubmission {
  absence_id: string;
  reason: string;
  details: string;
  document?: File;
}