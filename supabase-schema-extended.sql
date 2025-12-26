-- Extended Schema for HIS Program, Commissions, and Legal Templates
-- Run this AFTER the main supabase-schema.sql

-- =====================================================
-- ADDITIONAL ENUMS
-- =====================================================

CREATE TYPE his_status AS ENUM ('pending', 'active', 'suspended', 'cancelled');
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
CREATE TYPE template_category AS ENUM ('contract', 'notice', 'agreement', 'disclosure', 'compliance');

-- =====================================================
-- HIS (HOME IMPROVEMENT SALESPERSON) TRACKING
-- =====================================================

CREATE TABLE his_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  registration_number TEXT,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  approval_date DATE,
  expiration_date DATE,
  status his_status NOT NULL DEFAULT 'pending',
  supervising_contractor_license TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- COMMISSION TRACKING
-- =====================================================

CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  contract_value DECIMAL(10,2) NOT NULL,
  gross_profit DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL, -- Percentage (e.g., 5.00 = 5%)
  commission_amount DECIMAL(10,2) NOT NULL,
  
  -- Payment Milestones
  milestone_1_amount DECIMAL(10,2), -- 50% on material delivery
  milestone_1_paid_date DATE,
  milestone_2_amount DECIMAL(10,2), -- 50% on substantial completion
  milestone_2_paid_date DATE,
  
  status commission_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES instructors(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT positive_values CHECK (
    contract_value >= 0 AND 
    gross_profit >= 0 AND 
    commission_rate >= 0 AND 
    commission_amount >= 0
  )
);

-- =====================================================
-- LEGAL DOCUMENT TEMPLATES
-- =====================================================

CREATE TABLE legal_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category template_category NOT NULL,
  description TEXT,
  template_content TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Array of variable names to be filled
  version TEXT NOT NULL DEFAULT '1.0',
  effective_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  requires_signature BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- STUDENT LEGAL DOCUMENTS (Generated from Templates)
-- =====================================================

CREATE TABLE student_legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  template_id UUID REFERENCES legal_templates(id),
  document_title TEXT NOT NULL,
  document_content TEXT NOT NULL,
  variables_filled JSONB DEFAULT '{}',
  
  -- Signature tracking
  requires_signature BOOLEAN NOT NULL DEFAULT FALSE,
  student_signed_at TIMESTAMPTZ,
  student_signature TEXT,
  instructor_signed_at TIMESTAMPTZ,
  instructor_signature TEXT,
  instructor_id UUID REFERENCES instructors(id),
  
  -- Delivery tracking
  delivered_at TIMESTAMPTZ,
  delivery_method TEXT, -- 'email', 'print', 'portal'
  student_acknowledged_at TIMESTAMPTZ,
  
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- COMPLIANCE CHECKLIST TRACKING
-- =====================================================

CREATE TABLE compliance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  item_text TEXT NOT NULL,
  is_critical BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  deadline_type TEXT, -- 'one_time', 'annual', 'monthly', 'per_student'
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE student_compliance_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  compliance_item_id UUID NOT NULL REFERENCES compliance_items(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'n/a'
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  notes TEXT,
  due_date DATE,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(student_id, compliance_item_id)
);

-- =====================================================
-- HANDYMAN PROJECT TRACKING (AB 2622)
-- =====================================================

CREATE TABLE handyman_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_address TEXT NOT NULL,
  client_phone TEXT,
  project_description TEXT NOT NULL,
  
  -- AB 2622 Compliance
  labor_cost DECIMAL(10,2) NOT NULL,
  materials_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  requires_permit BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Dates
  quote_date DATE NOT NULL DEFAULT CURRENT_DATE,
  work_date DATE,
  completion_date DATE,
  payment_date DATE,
  
  -- Photos & Documentation
  before_photos TEXT[] DEFAULT '{}',
  after_photos TEXT[] DEFAULT '{}',
  receipt_url TEXT,
  
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- AB 2622: Total must be ≤ $1,000
  CONSTRAINT ab2622_limit CHECK (total_cost <= 1000.00),
  CONSTRAINT no_permit_work CHECK (
    NOT requires_permit OR total_cost = 0
  )
);

-- =====================================================
-- MATERIAL DELIVERY PAYMENTS
-- =====================================================

CREATE TABLE material_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_name TEXT NOT NULL,
  material_description TEXT NOT NULL,
  material_cost DECIMAL(10,2) NOT NULL,
  
  -- Payment tracking
  invoice_number TEXT,
  invoice_date DATE,
  payment_requested_date DATE,
  payment_due_date DATE, -- Typically 3 days after delivery
  payment_received_date DATE,
  payment_amount DECIMAL(10,2),
  
  -- Documentation
  delivery_photo_urls TEXT[] DEFAULT '{}',
  invoice_url TEXT,
  waiver_release_url TEXT, -- Unconditional Waiver upon payment
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT positive_cost CHECK (material_cost > 0)
);

-- =====================================================
-- PROGRESS MILESTONES (for Payment Schedule)
-- =====================================================

CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_number INTEGER NOT NULL,
  phase_name TEXT NOT NULL,
  description TEXT NOT NULL,
  scheduled_amount DECIMAL(10,2) NOT NULL,
  
  -- Completion tracking
  scheduled_date DATE,
  completed_date DATE,
  payment_requested_date DATE,
  payment_received_date DATE,
  payment_amount DECIMAL(10,2),
  
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(project_id, milestone_number)
);

-- =====================================================
-- QUIZ RESULTS
-- =====================================================

CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  quiz_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passing_score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  answers JSONB NOT NULL, -- Array of {question_id, selected_answer, correct}
  taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= total_questions)
);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_his_registrations_updated_at BEFORE UPDATE ON his_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_templates_updated_at BEFORE UPDATE ON legal_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_legal_documents_updated_at BEFORE UPDATE ON student_legal_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_compliance_tracking_updated_at BEFORE UPDATE ON student_compliance_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_handyman_projects_updated_at BEFORE UPDATE ON handyman_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_deliveries_updated_at BEFORE UPDATE ON material_deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Calculate commission amount automatically
CREATE OR REPLACE FUNCTION calculate_commission_amount()
RETURNS TRIGGER AS $$
BEGIN
  NEW.commission_amount := (NEW.gross_profit * NEW.commission_rate / 100);
  NEW.milestone_1_amount := NEW.commission_amount * 0.5;
  NEW.milestone_2_amount := NEW.commission_amount * 0.5;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_commission_trigger
BEFORE INSERT OR UPDATE ON commissions
FOR EACH ROW EXECUTE FUNCTION calculate_commission_amount();

-- Calculate handyman project total
CREATE OR REPLACE FUNCTION calculate_handyman_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_cost := NEW.labor_cost + NEW.materials_cost;
  
  -- Enforce AB 2622 $1,000 limit
  IF NEW.total_cost > 1000.00 THEN
    RAISE EXCEPTION 'AB 2622 violation: Total cost ($%) exceeds $1,000 limit', NEW.total_cost;
  END IF;
  
  -- Prevent permit-required work
  IF NEW.requires_permit THEN
    RAISE EXCEPTION 'Cannot perform handyman work that requires a permit';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_handyman_total_trigger
BEFORE INSERT OR UPDATE ON handyman_projects
FOR EACH ROW EXECUTE FUNCTION calculate_handyman_total();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE his_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_compliance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE handyman_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- HIS Registrations policies
CREATE POLICY "Students can view their own HIS registration"
  ON his_registrations FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can manage HIS registrations"
  ON his_registrations FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Commissions policies
CREATE POLICY "Students can view their own commissions"
  ON commissions FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can manage commissions"
  ON commissions FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Legal templates policies (read-only for students)
CREATE POLICY "Anyone can view active templates"
  ON legal_templates FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Instructors can manage templates"
  ON legal_templates FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Student legal documents policies
CREATE POLICY "Students can view their own documents"
  ON student_legal_documents FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can manage student documents"
  ON student_legal_documents FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Handyman projects policies
CREATE POLICY "Students can manage their own handyman projects"
  ON handyman_projects FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can view all handyman projects"
  ON handyman_projects FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Quiz results policies
CREATE POLICY "Students can view their own quiz results"
  ON quiz_results FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students can submit quiz results"
  ON quiz_results FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can view all quiz results"
  ON quiz_results FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_his_registrations_student_id ON his_registrations(student_id);
CREATE INDEX idx_his_registrations_status ON his_registrations(status);
CREATE INDEX idx_commissions_student_id ON commissions(student_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_student_legal_documents_student_id ON student_legal_documents(student_id);
CREATE INDEX idx_student_compliance_tracking_student_id ON student_compliance_tracking(student_id);
CREATE INDEX idx_handyman_projects_student_id ON handyman_projects(student_id);
CREATE INDEX idx_handyman_projects_completion_date ON handyman_projects(completion_date);
CREATE INDEX idx_material_deliveries_project_id ON material_deliveries(project_id);
CREATE INDEX idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_quiz_results_student_id ON quiz_results(student_id);

-- =====================================================
-- SEED DATA: Legal Templates
-- =====================================================

-- Material Delivery Clause
INSERT INTO legal_templates (title, category, description, template_content, variables, version, effective_date, is_active) VALUES
('Material Delivery Payment Clause', 'contract', 'B&P § 7159.5 compliant clause for material delivery payments',
'SECTION: PAYMENT FOR MATERIALS DELIVERED

Pursuant to California Business and Professions Code § 7159.5, the Contractor may request and accept payment for materials and equipment once they have been delivered to the project site and are under the control of the Owner, even if such materials have not yet been incorporated into the work. 

Upon delivery of significant materials (e.g., lumber, windows, cabinetry, or appliances), Contractor shall provide an invoice for the value of said materials. Owner agrees to pay such invoice within three (3) days of delivery. 

Ownership and title to the materials shall pass to the Owner upon payment, and Contractor shall provide a corresponding "Unconditional Waiver and Release on Progress Payment" for the value of the materials received.',
'[]'::jsonb, '1.0', '2025-01-01', TRUE);

-- HIS Commission Agreement
INSERT INTO legal_templates (title, category, description, template_content, variables, version, effective_date, is_active, requires_signature) VALUES
('HIS Commission & Mentorship Agreement', 'agreement', 'Agreement for HIS students earning commissions',
'[Full template text from legal.ts]',
'["contractor_name", "contractor_license", "student_name", "his_registration", "commission_rate"]'::jsonb,
'1.0', '2025-01-01', TRUE, TRUE);

-- Stop Work Notice
INSERT INTO legal_templates (title, category, description, template_content, variables, version, effective_date, is_active) VALUES
('Stop Work Notice (Civil Code § 8830)', 'notice', '10-Day Stop Work Notice for non-payment',
'[Full template text from legal.ts]',
'["owner_name", "project_address", "amount_due", "contractor_name", "license_number"]'::jsonb,
'1.0', '2025-01-01', TRUE);

-- =====================================================
-- SEED DATA: Compliance Items
-- =====================================================

-- BPPE Compliance
INSERT INTO compliance_items (category, item_text, is_critical, description, deadline_type, sort_order) VALUES
('BPPE Compliance', 'Form 71395 filed and approved', TRUE, 'Verification of Exemption form submitted to BPPE', 'one_time', 1),
('BPPE Compliance', 'Website has exemption disclaimer in footer', TRUE, 'Required disclaimer must be visible on all pages', 'one_time', 2),
('BPPE Compliance', 'All student fees total ≤ $2,500', TRUE, 'Monitor per-student fees to ensure compliance', 'per_student', 3),
('BPPE Compliance', 'Student enrollment agreements signed', TRUE, 'Each student must have signed agreement', 'per_student', 4);

-- CSLB Compliance
INSERT INTO compliance_items (category, item_text, is_critical, description, deadline_type, sort_order) VALUES
('CSLB Compliance', '48-month journey-level curriculum documented', TRUE, 'Full 4-year curriculum must be documented', 'one_time', 1),
('CSLB Compliance', 'Work experience log system operational', TRUE, 'Monthly log submission system must work', 'one_time', 2),
('CSLB Compliance', 'All students have professional email (SB 1455)', TRUE, 'CSLB email requirement per SB 1455', 'per_student', 3),
('CSLB Compliance', 'Monthly work logs submitted', TRUE, 'Student must submit logs every month', 'monthly', 4);

-- Safety & Cal/OSHA
INSERT INTO compliance_items (category, item_text, is_critical, description, deadline_type, sort_order) VALUES
('Safety & Cal/OSHA', 'IIPP written and posted', TRUE, 'Injury & Illness Prevention Program required', 'one_time', 1),
('Safety & Cal/OSHA', 'Cal/OSHA 10-Hour training completed', TRUE, 'Required for all Year 1 students', 'per_student', 2),
('Safety & Cal/OSHA', '2025 Fall Protection training completed', TRUE, '6ft rule training', 'per_student', 3),
('Safety & Cal/OSHA', 'Heat illness prevention plan posted', TRUE, 'Required for outdoor training sites', 'annual', 4);

-- HIS Program
INSERT INTO compliance_items (category, item_text, is_critical, description, deadline_type, sort_order) VALUES
('HIS Program', 'HIS application submitted', TRUE, 'Submit HIS app within first week', 'per_student', 1),
('HIS Program', 'Commission agreement signed', TRUE, 'HIS commission agreement must be executed', 'per_student', 2),
('HIS Program', 'Student understands "no direct payments" rule', TRUE, 'All payments must go to school entity', 'per_student', 3);

COMMENT ON TABLE his_registrations IS 'Home Improvement Salesperson (HIS) tracking for Year 1 students';
COMMENT ON TABLE commissions IS 'Commission tracking for HIS sales';
COMMENT ON TABLE legal_templates IS 'Reusable legal document templates';
COMMENT ON TABLE student_legal_documents IS 'Generated documents per student from templates';
COMMENT ON TABLE compliance_items IS 'Master list of compliance requirements';
COMMENT ON TABLE student_compliance_tracking IS 'Per-student compliance tracking';
COMMENT ON TABLE handyman_projects IS 'AB 2622 handyman projects (≤$1,000)';
COMMENT ON TABLE material_deliveries IS 'Material delivery payment tracking (B&P § 7159.5)';
COMMENT ON TABLE project_milestones IS 'Progress payment milestones for contracts';
COMMENT ON TABLE quiz_results IS 'Student quiz/assessment results';


