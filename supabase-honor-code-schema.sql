-- Honor Code Signing System
-- Add to existing schema (run after supabase-schema-extended.sql)

-- =====================================================
-- HONOR CODE SIGNATURES
-- =====================================================

CREATE TABLE honor_code_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  honor_code_version TEXT NOT NULL DEFAULT '1.0',
  
  -- Signature details
  student_signature TEXT NOT NULL,
  ip_address TEXT,
  device_info JSONB,
  
  -- Acknowledgment
  agreed_to_terms BOOLEAN NOT NULL DEFAULT TRUE,
  acknowledgment_text TEXT NOT NULL,
  
  -- Timestamps
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Only one signature per student
  UNIQUE(student_id)
);

-- Honor Code Violations Tracking
CREATE TABLE honor_code_violations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  violation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Violation details
  principle_violated INTEGER NOT NULL CHECK (principle_violated BETWEEN 1 AND 5),
  specific_rule TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'major', 'critical')),
  
  -- Investigation
  reported_by UUID REFERENCES users(id),
  investigated_by UUID REFERENCES instructors(id),
  investigation_notes TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  
  -- Resolution
  resolution TEXT, -- 'warning', 'probation', 'dismissal', 'exonerated'
  resolution_date DATE,
  resolution_notes TEXT,
  
  -- Dismissal tracking (if applicable)
  resulted_in_dismissal BOOLEAN NOT NULL DEFAULT FALSE,
  his_registration_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alumni Network (for "Alumni Shield" principle #3)
CREATE TABLE alumni_directory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Graduation info
  graduation_date DATE NOT NULL,
  cslb_license_number TEXT,
  license_issue_date DATE,
  
  -- Business info
  business_name TEXT,
  business_entity_type TEXT, -- 'sole_proprietor', 'llc', 'corp', 's_corp'
  business_phone TEXT,
  business_email TEXT,
  business_website TEXT,
  service_area TEXT[],
  
  -- Specialties
  primary_trade TEXT,
  specialties TEXT[] DEFAULT '{}',
  
  -- Network participation
  accepts_referrals BOOLEAN NOT NULL DEFAULT TRUE,
  willing_to_mentor BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Reputation tracking
  referrals_sent INTEGER NOT NULL DEFAULT 0,
  referrals_received INTEGER NOT NULL DEFAULT 0,
  honor_code_standing TEXT NOT NULL DEFAULT 'good', -- 'good', 'warning', 'suspended'
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Peer Referrals (Alumni helping Alumni)
CREATE TABLE peer_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referring_alumni_id UUID NOT NULL REFERENCES alumni_directory(id),
  referred_to_alumni_id UUID NOT NULL REFERENCES alumni_directory(id),
  
  -- Client info
  client_name TEXT NOT NULL,
  client_phone TEXT,
  project_type TEXT NOT NULL,
  project_value DECIMAL(10,2),
  
  -- Status
  referral_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'declined'
  completion_date DATE,
  
  -- Feedback
  client_satisfaction_rating INTEGER CHECK (client_satisfaction_rating BETWEEN 1 AND 5),
  feedback TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_honor_code_violations_updated_at BEFORE UPDATE ON honor_code_violations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alumni_directory_updated_at BEFORE UPDATE ON alumni_directory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update alumni referral counts
CREATE OR REPLACE FUNCTION update_referral_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Increment referrals_sent for referring alumni
    UPDATE alumni_directory
    SET referrals_sent = referrals_sent + 1
    WHERE id = NEW.referring_alumni_id;
    
    -- Increment referrals_received for referred alumni
    UPDATE alumni_directory
    SET referrals_received = referrals_received + 1
    WHERE id = NEW.referred_to_alumni_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referral_counts_trigger
AFTER INSERT OR UPDATE ON peer_referrals
FOR EACH ROW EXECUTE FUNCTION update_referral_counts();

-- Function to check Honor Code signature on enrollment
CREATE OR REPLACE FUNCTION check_honor_code_signed()
RETURNS TRIGGER AS $$
BEGIN
  -- When a student advances past Quarter 1, ensure Honor Code is signed
  IF NEW.current_quarter > 1 OR NEW.current_year > 1 THEN
    IF NOT EXISTS (
      SELECT 1 FROM honor_code_signatures WHERE student_id = NEW.id
    ) THEN
      RAISE EXCEPTION 'Student must sign Honor Code before advancing past Year 1, Quarter 1';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_honor_code_signed_trigger
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION check_honor_code_signed();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE honor_code_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE honor_code_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_referrals ENABLE ROW LEVEL SECURITY;

-- Honor Code Signatures policies
CREATE POLICY "Students can view their own signature"
  ON honor_code_signatures FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students can sign Honor Code once"
  ON honor_code_signatures FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can view all signatures"
  ON honor_code_signatures FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Violations policies
CREATE POLICY "Students can view their own violations"
  ON honor_code_violations FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Instructors can manage violations"
  ON honor_code_violations FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Alumni directory policies
CREATE POLICY "Alumni can view directory"
  ON alumni_directory FOR SELECT
  TO authenticated
  USING (accepts_referrals = TRUE);

CREATE POLICY "Alumni can update their own profile"
  ON alumni_directory FOR UPDATE
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- Referrals policies
CREATE POLICY "Alumni can manage their referrals"
  ON peer_referrals FOR ALL
  USING (
    referring_alumni_id IN (
      SELECT id FROM alumni_directory WHERE student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
      )
    )
    OR
    referred_to_alumni_id IN (
      SELECT id FROM alumni_directory WHERE student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
      )
    )
  );

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_honor_code_signatures_student_id ON honor_code_signatures(student_id);
CREATE INDEX idx_honor_code_violations_student_id ON honor_code_violations(student_id);
CREATE INDEX idx_honor_code_violations_severity ON honor_code_violations(severity);
CREATE INDEX idx_alumni_directory_student_id ON alumni_directory(student_id);
CREATE INDEX idx_alumni_directory_license_number ON alumni_directory(cslb_license_number);
CREATE INDEX idx_peer_referrals_referring ON peer_referrals(referring_alumni_id);
CREATE INDEX idx_peer_referrals_referred_to ON peer_referrals(referred_to_alumni_id);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert compliance item for Honor Code signing
INSERT INTO compliance_items (category, item_text, is_critical, description, deadline_type, sort_order) VALUES
('Enrollment', 'Honor Code signed', TRUE, 'Student must sign Wisdom Works Honor Code on Day 1', 'per_student', 1);

COMMENT ON TABLE honor_code_signatures IS 'Student signatures on the Wisdom Works Honor Code (required Day 1)';
COMMENT ON TABLE honor_code_violations IS 'Tracking violations of the Honor Code with investigation and resolution';
COMMENT ON TABLE alumni_directory IS 'Network of graduated students for the "Alumni Shield" principle';
COMMENT ON TABLE peer_referrals IS 'Alumni-to-alumni referral tracking for community building';


