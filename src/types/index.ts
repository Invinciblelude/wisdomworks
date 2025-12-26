// Core Types for Wisdom Works Academy

export type UserRole = 'student' | 'instructor' | 'admin';

export type JourneyLevel = 'trainee' | 'apprentice' | 'journeyman' | 'foreman';

export type LogStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'cancelled';

export type ContractType = 'handyman' | 'hic' | 'commercial';

export type CertificationType = 
  | 'cal_osha_10' 
  | 'fall_protection' 
  | 'respiratory_fit' 
  | 'heat_illness' 
  | 'lead_safety';

export type DocumentType = 
  | 'enrollment' 
  | 'work_log' 
  | 'safety_cert' 
  | 'contract' 
  | 'milestone' 
  | 'graduation' 
  | 'other';

export type TransactionType = 
  | 'enrollment' 
  | 'materials' 
  | 'tools' 
  | 'certification' 
  | 'refund';

// User Interfaces
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  address?: Address;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

// Student Interfaces
export interface Student {
  id: string;
  user_id: string;
  user?: User;
  enrollment_date: string;
  current_year: 1 | 2 | 3 | 4;
  current_quarter: 1 | 2 | 3 | 4;
  journey_level: JourneyLevel;
  total_fees_paid: number;
  total_hours_logged: number;
  cslb_eligible: boolean;
  graduation_date?: string;
  certifier_id?: string;
  certifier?: Instructor;
}

export interface Instructor {
  id: string;
  user_id: string;
  user?: User;
  license_number: string;
  license_expiration: string;
  specialties: string[];
}

// Work Experience Log Interfaces
export interface WorkExperienceLog {
  id: string;
  student_id: string;
  student?: Student;
  project_name: string;
  project_address: string;
  date_start: string;
  date_end: string;
  total_hours: number;
  student_role: string;
  duties_performed: DutiesPerformed;
  supervisory_tasks?: SupervisoryTask[];
  photos: string[];
  status: LogStatus;
  instructor_notes?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface DutiesPerformed {
  framing_structural?: DutyDetail;
  carpentry?: DutyDetail;
  electrical?: DutyDetail;
  plumbing?: DutyDetail;
  concrete_masonry?: DutyDetail;
  drywall_finishing?: DutyDetail;
}

export interface DutyDetail {
  tasks: string;
  hours: number;
}

export interface SupervisoryTask {
  task: string;
  completed: boolean;
}

// Milestone Review Interfaces
export interface MilestoneReview {
  id: string;
  student_id: string;
  year: 1 | 2 | 3 | 4;
  quarter: 1 | 2 | 3 | 4;
  assessment_data: AssessmentData;
  journey_level_achieved: JourneyLevel;
  instructor_id: string;
  instructor?: Instructor;
  instructor_signature: string;
  notes?: string;
  completed_at: string;
}

export interface AssessmentData {
  safety_mastery?: boolean;
  tool_proficiency?: boolean;
  blueprint_reading?: boolean;
  code_compliance?: boolean;
  independent_execution?: boolean;
  supervisory_skills?: boolean;
  business_knowledge?: boolean;
  [key: string]: boolean | undefined;
}

// Curriculum Interfaces
export interface Curriculum {
  id: string;
  year: 1 | 2 | 3 | 4;
  quarter: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  learning_outcomes: string[];
  materials: CurriculumMaterial[];
  assessments: Assessment[];
  safety_focus: string[];
}

export interface CurriculumMaterial {
  type: 'pdf' | 'video' | 'link' | 'document';
  title: string;
  url: string;
  description?: string;
}

export interface Assessment {
  title: string;
  type: 'quiz' | 'practical' | 'written';
  passing_score: number;
}

// Safety Certification Interfaces
export interface SafetyCertification {
  id: string;
  student_id: string;
  certification_type: CertificationType;
  issue_date: string;
  expiration_date?: string;
  certificate_url: string;
  instructor_id: string;
}

// Project Interfaces
export interface Project {
  id: string;
  student_id: string;
  project_name: string;
  client_name: string;
  project_address: string;
  contract_value: number;
  contract_type: ContractType;
  start_date: string;
  completion_date?: string;
  status: ProjectStatus;
  documents: ProjectDocument[];
  financial_data: FinancialData;
}

export interface ProjectDocument {
  type: string;
  name: string;
  url: string;
  uploaded_at: string;
}

export interface FinancialData {
  down_payment: number;
  payments_received: number;
  materials_cost: number;
  labor_cost: number;
  profit_margin: number;
}

// Document Interfaces
export interface Document {
  id: string;
  student_id?: string;
  document_type: DocumentType;
  title: string;
  file_url: string;
  metadata: Record<string, any>;
  uploaded_by: string;
  uploaded_at: string;
}

// Safety Incident Interfaces
export interface SafetyIncident {
  id: string;
  student_id?: string;
  incident_date: string;
  location: string;
  description: string;
  injury_type?: string;
  treatment_provided: string;
  cal_osha_reportable: boolean;
  reported_by: string;
  investigation_notes?: string;
  corrective_actions: string[];
}

// Financial Transaction Interfaces
export interface FinancialTransaction {
  id: string;
  student_id: string;
  amount: number;
  transaction_type: TransactionType;
  payment_method: string;
  description: string;
  processed_by: string;
  transaction_date: string;
}

// Dashboard Analytics Interfaces
export interface StudentProgress {
  current_phase: string;
  completion_percentage: number;
  total_hours: number;
  hours_by_trade: Record<string, number>;
  certifications_earned: number;
  certifications_required: number;
  milestones_completed: number;
  milestones_total: number;
  financial_status: {
    paid: number;
    remaining: number;
    percentage: number;
  };
}

export interface AdminAnalytics {
  total_students: number;
  students_by_year: Record<string, number>;
  students_by_journey_level: Record<string, number>;
  completion_rate: number;
  average_hours_logged: number;
  compliance_status: {
    bppe_compliant: boolean;
    financial_cap_violations: number;
    required_disclosures_delivered: number;
  };
  safety_incidents_ytd: number;
}

// Form Interfaces
export interface EnrollmentForm {
  full_name: string;
  email: string;
  phone: string;
  address: Address;
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  previous_experience?: string;
  goals: string;
  agreed_to_terms: boolean;
  signature: string;
  signature_date: string;
}

export interface WorkLogForm {
  project_name: string;
  project_address: string;
  date_start: string;
  date_end: string;
  student_role: string;
  duties_performed: DutiesPerformed;
  supervisory_tasks?: SupervisoryTask[];
  photos: string[];
}

// Navigation Types
export interface RootStackParamList {
  // Auth
  Login: undefined;
  Register: undefined;
  
  // Student
  StudentDashboard: undefined;
  StudentJourney: undefined;
  WorkLogSubmission: { logId?: string };
  WorkLogHistory: undefined;
  LearningResources: { year: number; quarter: number };
  SafetyCertifications: undefined;
  MyProjects: undefined;
  ProjectDetails: { projectId: string };
  Documents: undefined;
  Tools: undefined;
  
  // Instructor
  InstructorDashboard: undefined;
  StudentManagement: undefined;
  StudentProfile: { studentId: string };
  LogReview: { logId: string };
  MilestoneAssessment: { studentId: string; year: number; quarter: number };
  SafetyManagement: undefined;
  
  // Admin
  AdminDashboard: undefined;
  StudentDatabase: undefined;
  EnrollmentProcessing: undefined;
  ComplianceCenter: undefined;
  DocumentGenerator: undefined;
  FinancialManagement: undefined;
  Reports: undefined;
  
  // Public
  Home: undefined;
  ProgramOverview: undefined;
  EnrollmentApplication: undefined;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}


