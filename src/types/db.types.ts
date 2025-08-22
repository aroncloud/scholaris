// src/shared/types/db.types.ts

/**
 * ====================================================================
 * Lookup Tables for Relationships and Extracted ENUMs
 * ====================================================================
 */

/** Defines the nature of a person's relationship to an entity (e.g., Father, Guardian). */
export interface RelationshipType {
	type_code: string;
	title: string;
	description?: string;
  }

  /** Defines the possible enrollment statuses for a student. */
  export interface StudentStatus {
	status_code: string;
	title: string;
	description?: string;
  }

  /** Defines the types of teachers (e.g., Permanent, Part-Time). */
  export interface TeacherType {
	type_code: string;
	title: string;
	description?: string;
  }

  /** Defines the employment statuses for staff/teachers. */
  export interface EmploymentStatus {
	status_code: string;
	title: string;
	description?: string;
  }

  /** Defines the types of contracts for job offers. */
  export interface ContractType {
	type_code: string;
	title: string;
	description?: string;
  }

  /** Defines the possible statuses for a student or teacher application. */
  export interface ApplicationStatus {
	status_code: string;
	title: string;
	description?: string;
  }

  /** Defines marital statuses. */
  export interface MaritalStatus {
	status_code: string;
	title: string;
  }

  /** Defines academic qualifications. */
  export interface EducationLevel {
	level_code: string;
	title: string;
  }

  /** Defines ethnicities. */
  export interface Ethnicity {
	ethnicity_code: string;
	ethnicity_name: string;
  }

  /** Defines the administrative regions of the country. */
  export interface Region {
	region_code: string;
	region_name: string;
  }

  /** Defines departments within a region. */
  export interface Department {
	department_code: string;
	region_code: string;
	department_name: string;
  }

  /** Defines arrondissements within a department. */
  export interface Arrondissement {
	arrondissement_code: string;
	department_code: string;
	arrondissement_name: string;
  }


  /**
   * ====================================================================
   * Core System Tables (Users, Auth, Statuses, Content)
   * ====================================================================
   */

  /** Defines the possible statuses for a user account. */
  export interface AccountStatus {
	status_code: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Represents the central user record for authentication and core demographic data. */
  export interface User {
	user_code: string;
	user_name: string;
	password_hash: string;
	email?: string;
	first_name: string;
	gender: 'MALE' | 'FEMALE';
	last_name: string;
	other_email?: string;
	other_phone?: string;
	phone_number: string;
	country?: string;
	city?: string;
	street?: string;
	address_details?: string;
	status_code: string;
	avatar_url?: string;
	place_of_birth?: string;
	date_of_birth?: string; // Stored as string in format 'YYYY-MM-DD'
	ethnicity_code?: string;
	marital_status_code?: string;
	cni_number?: string;
	cni_issue_date?: string; // Stored as string in format 'YYYY-MM-DD'
	cni_issue_location?: string;
	is_verified: 0 | 1;
	created_at?: number;
	updated_at?: number;
	last_login_at?: number;
  }

  /** Defines the roles available in the system. */
  export interface UserRole {
	role_code: string;
	description?: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Links a user to a role, creating their "profile" in the system. */
  export interface UserProfile {
	profile_code: string;
	user_code: string;
	role_code: string;
	is_active: 0 | 1;
	status_code: string;
	created_at: string; // Stored as string in ISO 8601 format
  }

  /** Defines all possible discrete permissions in the system. */
  export interface Permission {
	permission_code: string;
	description?: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Defines the statuses for a permission assignment (e.g., Active, Revoked). */
  export interface AssignmentStatus {
	status_code: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Grants a permission directly to a user or to a role. */
  export interface PermissionSet {
	set_code: string;
	permission_code: string;
	user_code?: string;
	role_code?: string;
	is_default: 0 | 1;
	is_active: 0 | 1;
	status_code: string;
	created_at: string; // ISO 8601 format
  }

  /** Defines the type of object a piece of content can be related to. */
  export interface ObjectLevel {
	level_code: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Defines the statuses for approval workflows (e.g., Pending, Approved). */
  export interface ApprovalStatus {
	status_code: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Defines generic statuses for various entities (e.g., Active, Archived). */
  export interface BaseStatus {
	status_code: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Defines the types of content that can be stored (e.g., CV, Document). */
  export interface ContentType {
	type_code: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Central table for all documents and files, linked polymorphically to parent objects. */
  export interface Content {
	content_code: string;
	type_code: string;
	title: string;
	content_url: string;
	parent_code: string;
	level_code: string;
	status_code: string;
	description?: string;
	metadata?: string; // JSON stored as string
	uploaded_at: string; // ISO 8601 format
	is_active: 0 | 1;
  }

  /** Defines types for identity verification tokens (e.g., OTP, Reset). */
  export interface IdentityType {
	type_code: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Defines the statuses for the identity verification process (e.g., Sent, Used). */
  export interface IdentityStatus {
	status_code: string;
	is_active: 0 | 1;
	title: string;
  }

  /** Stores identity verification tokens like OTPs and password reset codes. */
  export interface Identity {
	identity_code: string;
	type_code: string;
	status_code: string;
	user_code: string;
	content_data: string;
	created_at: string; // ISO 8601 format
	updated_at: string; // ISO 8601 format
	is_used: 0 | 1;
  }



  /** A central table to store details of any person related to an entity. */
  export interface RelatedPerson {
	person_code: string;
	first_name?: string;
	last_name: string;
	phone_number?: string;
	email?: string;
	address?: string;
	occupation?: string;
  }

  /** A junction table that links entities (students, etc.) to related persons. */
  export interface EntityContact {
	entity_contact_code: string;
	parent_code: string;
	parent_level_code: string;
	person_code: string;
	relationship_type_code: string;
  }


  /**
   * ====================================================================
   * Domain-Specific Tables (University Management)
   * ====================================================================
   */

  /** Represents a high-level academic program or course of study. */
  export interface AcademicProgram {
	program_code: string;
	program_name: string;
	internal_code: string;
	degree_name: string;
	degree_code: string;
	description?: string;
  }

  /** Represents the detailed structure (course plan) for a specific year/level of a program. */
  export interface ProgramCurriculum {
	curriculum_code: string;
	program_code: string;
	study_level: string;
	curriculum_name: string;
	created_at: string; // ISO 8601 format
	status_code: string;
  }

  /** Represents a logical subdivision of a curriculum (e.g., Semester 1). */
  export interface TrainingSequence {
	sequence_code: string;
	curriculum_code: string;
	sequence_name: string;
	sequence_number: string;
	description?: string;
	status_code: string;
  }

  /** Represents a subject area within a curriculum (e.g., Basic Sciences). */
  export interface Domain {
	domain_code: string;
	curriculum_code: string;
	sequence_code?: string;
	domain_name: string;
	description?: string;
	internal_code: string;
  }

  /** Represents a major course or subject within a domain (e.g., Anatomy/Physiology). */
  export interface Module {
	module_code: string;
	domain_code: string;
	sequence_code: string;
	module_name: string;
	internal_code: string;
	description?: string;
	coefficient: number;
  }

  /** Represents a specific, teachable unit within a module (UE). */
  export interface CourseUnit {
	course_unit_code: string;
	module_code: string;
	teacher_user_code?: string;
	course_unit_name: string;
	internal_code: string;
	lecture_hours?: number;
	lab_tutorial_hours?: number;
	coefficient: number;
	is_mandatory: 0 | 1;
	is_module_coordinator: 0 | 1;
	status_code: string;
  }

  /** Represents a school year with defined start and end dates. */
  export interface AcademicYear {
	academic_year_code: string;
	year_code: string;
	start_date: string; // YYYY-MM-DD
	end_date: string; // YYYY-MM-DD
	status_code: string;
	description?: string;
  }

  /** Schedules a training sequence for a specific academic year with concrete dates. */
  export interface SequenceSchedule {
	schedule_code: string;
	academic_year_code: string;
	sequence_code: string;
	unique_code: string;
	start_date: string; // YYYY-MM-DD
	end_date: string; // YYYY-MM-DD
	status_code: string;
  }

  /** Represents the role-specific profile data for a student. */
  export interface Student {
	user_code: string;
	curriculum_code: string;
	student_number: string;
	status_code: string;
	enrollment_date: string; // ISO 8601 format
	education_level_code?: string;
	financial_status?: string;
  }

  /** Represents the role-specific profile data for a teacher. */
  export interface Teacher {
	user_code: string;
	teacher_number: string;
	type_code?: string;
	specialty?: string;
	qualifications?: string;
	hiring_date?: string; // YYYY-MM-DD
	employment_status_code?: string;
	salary?: number;
  }

  /** Represents the role-specific profile data for an administrative staff member. */
  export interface Staff {
	user_code: string;
	staff_number: string;
	job_title?: string;
	department?: string;
	hiring_date?: string; // YYYY-MM-DD
	salary?: number;
  }

  /** Represents a job offer posted by the institution. */
  export interface JobOffer {
	offer_code: string;
	job_title: string;
	job_description?: string;
	contract_type_code?: string;
	published_at: string; // ISO 8601 format
	deadline?: string; // YYYY-MM-DD
	offer_status?: string;
	requirements?: string;
	remuneration?: number;
  }

  /** Represents an application from a prospective student. */
  export interface StudentApplication {
	application_code: string;
	curriculum_code: string;
	first_name: string;
	last_name: string;
	date_of_birth?: string; // YYYY-MM-DD
	place_of_birth?: string;
	email: string;
	phone_number?: string;
	region_code?: string;
	department_code?: string;
	arrondissement_code?: string;
	village?: string;
	education_level_code?: string;
	ethnicity_code?: string;
	marital_status_code?: string;
	country?: string;
	city?: string;
	street?: string;
	address_details?: string;
	cni_number?: string;
	cni_issue_date?: string; // YYYY-MM-DD
	cni_issue_location?: string;
	application_status_code: string;
	submitted_at?: string; // ISO 8601 format
	processed_at?: string; // ISO 8601 format
	rejection_reason?: string;
	application_data?: string; // JSON stored as string
	converted_to_user_code?: string;
	processed_user_code?: string;
	gender?: 'MALE' | 'FEMALE';
  }

  /** Represents an application from a prospective teacher. */
  export interface TeacherApplication {
	application_code: string;
	applicant_email: string;
	applicant_last_name: string;
	applicant_first_name: string;
	job_offer_code: string;
	application_status_code: string;
	submitted_at: string; // ISO 8601 format
	processed_at?: string; // ISO 8601 format
	rejection_reason?: string;
	is_from_previous_institution: 0 | 1;
	application_data?: string; // JSON stored as string
	gender?: 'MALE' | 'FEMALE';
	phone_number?: string;
  }
  export interface  refresh_tokens {
    token:string,
    user_code: string,
    expiresAt:string,
}


export interface EmailTemplates{
	action: string;
	code: string;
	lang: string;
	subject: string;
	body: string;
}
