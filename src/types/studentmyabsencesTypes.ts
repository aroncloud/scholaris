// Represents a single absence record
export interface Absence {
  absence_code: string;
  course_unit_name: string;
  session_title: string;
  start_time: string;   // ISO date-time string
  end_time: string;     // ISO date-time string
  recorded_at: string;  // date-time string
  status_code: "PENDING_REVIEW" | "UNJUSTIFIED" | string; 
}

// Represents the full API response structure
export interface AbsenceHistoryResponse {
  code: string;
  message: string;
  exit: string;
  body: Absence[];
}
export interface JustificationFile {
  content_url: string;   // URL of the uploaded file (from Cloudflare R2)
  title: string;         // Descriptive title (ex: "Certificat Médical - Dr. Dupont")
  type_code: string;     // Type of justificatif (ex: "MEDICAL_CERTIFICATE")
}

export interface SubmitJustificationPayload {
  absence_codes: string[];   // Array of absence unique codes
  reason: string;            // Explanation text provided by the student
  files: JustificationFile[]; // Array of uploaded file objects
}
