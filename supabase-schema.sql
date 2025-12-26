-- Wisdom Works Academy - Supabase Database Schema
-- This schema supports a 4-year trade school management system
-- Compliant with California BPPE § 94874(f) and CSLB requirements

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE journey_level AS ENUM ('trainee', 'apprentice', 'journeyman', 'foreman');
CREATE TYPE log_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'completed', 'cancelled');
CREATE TYPE contract_type AS ENUM ('handyman', 'hic', 'commercial');
CREATE TYPE certification_type AS ENUM ('cal_osha_10', 'fall_protection', 'respiratory_fit', 'heat_illness', 'lead_safety');
CREATE TYPE document_type AS ENUM ('enrollment', 'work_log', 'safety_cert', 'contract', 'milestone', 'graduation', 'other');
CREATE TYPE transaction_type AS ENUM ('enrollment', 'materials', 'tools', 'certification', 'refund');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  phone TEXT,
  address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Instructors table
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  license_expiration DATE NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_year INTEGER NOT NULL DEFAULT 1 CHECK (current_year BETWEEN 1 AND 4),
  current_quarter INTEGER NOT NULL DEFAULT 1 CHECK (current_quarter BETWEEN 1 AND 4),
  journey_level journey_level NOT NULL DEFAULT 'trainee',
  total_fees_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_hours_logged INTEGER NOT NULL DEFAULT 0,
  cslb_eligible BOOLEAN NOT NULL DEFAULT FALSE,
  graduation_date DATE,
  certifier_id UUID REFERENCES instructors(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: Total fees must not exceed $2,500 (BPPE § 94874(f))
  CONSTRAINT max_fees CHECK (total_fees_paid <= 2500.00)
);

-- Work Experience Logs table
CREATE TABLE work_experience_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_address TEXT NOT NULL,
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  total_hours DECIMAL(10,2) NOT NULL,
  student_role TEXT NOT NULL,
  duties_performed JSONB NOT NULL DEFAULT '{}',
  supervisory_tasks JSONB DEFAULT '[]',
  photos TEXT[] DEFAULT '{}',
  status log_status NOT NULL DEFAULT 'draft',
  instructor_notes TEXT,
  approved_by UUID REFERENCES instructors(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_date_range CHECK (date_end >= date_start),
  CONSTRAINT positive_hours CHECK (total_hours > 0)
);

-- Milestone Reviews table
CREATE TABLE milestone_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  assessment_data JSONB NOT NULL DEFAULT '{}',
  journey_level_achieved journey_level NOT NULL,
  instructor_id UUID NOT NULL REFERENCES instructors(id),
  instructor_signature TEXT NOT NULL,
  notes TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(student_id, year, quarter)
);

-- Curriculum table
CREATE TABLE curriculum (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  learning_outcomes TEXT[] DEFAULT '{}',
  materials JSONB DEFAULT '[]',
  assessments JSONB DEFAULT '[]',
  safety_focus TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(year, quarter)
);

-- Safety Certifications table
CREATE TABLE safety_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  certification_type certification_type NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE,
  certificate_url TEXT NOT NULL,
  instructor_id UUID NOT NULL REFERENCES instructors(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_address TEXT NOT NULL,
  contract_value DECIMAL(10,2) NOT NULL,
  contract_type contract_type NOT NULL,
  start_date DATE NOT NULL,
  completion_date DATE,
  status project_status NOT NULL DEFAULT 'planning',
  documents JSONB DEFAULT '[]',
  financial_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT positive_contract_value CHECK (contract_value >= 0)
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safety Incidents table
CREATE TABLE safety_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  incident_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  injury_type TEXT,
  treatment_provided TEXT NOT NULL,
  cal_osha_reportable BOOLEAN NOT NULL DEFAULT FALSE,
  reported_by UUID NOT NULL REFERENCES users(id),
  investigation_notes TEXT,
  corrective_actions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financial Transactions table
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  payment_method TEXT NOT NULL,
  description TEXT NOT NULL,
  processed_by UUID NOT NULL REFERENCES users(id),
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_logs_updated_at BEFORE UPDATE ON work_experience_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curriculum_updated_at BEFORE UPDATE ON curriculum
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update student total_hours_logged when work logs are approved
CREATE OR REPLACE FUNCTION update_student_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    UPDATE students
    SET total_hours_logged = total_hours_logged + NEW.total_hours
    WHERE id = NEW.student_id;
  ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
    UPDATE students
    SET total_hours_logged = total_hours_logged - OLD.total_hours
    WHERE id = NEW.student_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_student_hours_trigger
AFTER INSERT OR UPDATE ON work_experience_logs
FOR EACH ROW EXECUTE FUNCTION update_student_hours();

-- Function to update student total_fees_paid when transactions are added
CREATE OR REPLACE FUNCTION update_student_fees()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type != 'refund' THEN
    UPDATE students
    SET total_fees_paid = total_fees_paid + NEW.amount
    WHERE id = NEW.student_id;
  ELSE
    UPDATE students
    SET total_fees_paid = total_fees_paid - NEW.amount
    WHERE id = NEW.student_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_student_fees_trigger
AFTER INSERT ON financial_transactions
FOR EACH ROW EXECUTE FUNCTION update_student_fees();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Students policies
CREATE POLICY "Students can view their own record"
  ON students FOR SELECT
  USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

CREATE POLICY "Instructors and admins can update students"
  ON students FOR UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Work logs policies
CREATE POLICY "Students can manage their own work logs"
  ON work_experience_logs FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can view all work logs"
  ON work_experience_logs FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

CREATE POLICY "Instructors can approve work logs"
  ON work_experience_logs FOR UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Curriculum policies (read-only for students, full access for instructors/admins)
CREATE POLICY "Anyone can view curriculum"
  ON curriculum FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instructors and admins can manage curriculum"
  ON curriculum FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Projects policies
CREATE POLICY "Students can manage their own projects"
  ON projects FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can view all projects"
  ON projects FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Documents policies
CREATE POLICY "Students can view their own documents"
  ON documents FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()) OR (SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

CREATE POLICY "Users can upload documents"
  ON documents FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_journey_level ON students(journey_level);
CREATE INDEX idx_work_logs_student_id ON work_experience_logs(student_id);
CREATE INDEX idx_work_logs_status ON work_experience_logs(status);
CREATE INDEX idx_work_logs_date_start ON work_experience_logs(date_start);
CREATE INDEX idx_milestones_student_id ON milestone_reviews(student_id);
CREATE INDEX idx_safety_certs_student_id ON safety_certifications(student_id);
CREATE INDEX idx_projects_student_id ON projects(student_id);
CREATE INDEX idx_documents_student_id ON documents(student_id);
CREATE INDEX idx_transactions_student_id ON financial_transactions(student_id);

-- =====================================================
-- SEED DATA (Optional - for development/testing)
-- =====================================================

-- Insert initial curriculum data
INSERT INTO curriculum (year, quarter, title, description, learning_outcomes, safety_focus) VALUES
(1, 1, 'Safety First', 'Cal/OSHA 10-Hour Card, PPE mastery, Fall Protection, Ladder Safety', 
  ARRAY['Obtain Cal/OSHA 10-Hour Card', 'Master PPE usage', 'Understand 2025 6ft fall protection rule'], 
  ARRAY['Cal/OSHA 10-Hour', 'Fall Protection', 'Ladder Safety']),
(1, 2, 'The Toolbox', 'Safe operation of power tools and hand tool proficiency',
  ARRAY['Operate Big 5 power tools safely', 'Master hand tools', 'Perform tool maintenance'],
  ARRAY['Power Tool Safety', 'Hand Tool Safety']),
(1, 3, 'Construction Math', 'Tape reading, fractions/decimals, 3-4-5 rule, area/volume calculations',
  ARRAY['Read tape to 1/16"', 'Apply 3-4-5 squaring rule', 'Calculate basic area/volume'],
  ARRAY['Measurement Accuracy']),
(1, 4, 'The Build - Fundamentals', 'Blueprint reading, material identification, basic demolition',
  ARRAY['Read basic blueprints', 'Identify common materials', 'Perform safe demolition'],
  ARRAY['Job Site Safety', 'Material Handling']);

-- Add more curriculum records for Years 2-4 as needed...

COMMENT ON TABLE users IS 'Core user accounts, extends Supabase Auth';
COMMENT ON TABLE students IS 'Student records with journey-level progression tracking';
COMMENT ON TABLE work_experience_logs IS 'Monthly work logs required for CSLB certification (48-month journey)';
COMMENT ON TABLE milestone_reviews IS 'Quarterly/annual assessments by instructors';
COMMENT ON TABLE curriculum IS '4-year curriculum structure (Year 1-4, Quarter 1-4)';
COMMENT ON TABLE financial_transactions IS 'All student financial transactions (max $2,500 per BPPE § 94874(f))';


