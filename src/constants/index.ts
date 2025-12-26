// Legal & Compliance Constants
export const LEGAL = {
  MAX_STUDENT_FEE: 2500,
  BPPE_EXEMPTION_CODE: 'CEC § 94874(f)',
  CSLB_REQUIRED_HOURS: 48 * 160, // 48 months at ~160 hours/month = 7,680 hours
  
  REQUIRED_DISCLAIMER: 
    'Wisdom Works Academy is exempt from the California Private Postsecondary Education Act of 2009 under CEC § 94874(f). ' +
    'This institution is not approved by the Bureau for Private Postsecondary Education. ' +
    'Our total charges per student are $2,500 or less, and we do not accept state or federal financial aid.',
    
  CSLB_DISCLAIMER:
    'Completion of this program does not grant a California Contractors State License. ' +
    'The Contractors State License Board (CSLB) has sole authority to grant licenses. ' +
    'Students must independently meet CSLB requirements, including 4 years of journey-level experience, ' +
    'passing background checks, and passing state exams.',
} as const;

// 4-Year Curriculum Structure
export const CURRICULUM_STRUCTURE = {
  YEAR_1: {
    title: 'The Apprentice Phase',
    subtitle: 'Safety, Tools, and Trade Literacy',
    journey_level: 'trainee',
    quarters: [
      {
        number: 1,
        title: 'Safety First',
        focus: ['Cal/OSHA 10-Hour Card', 'PPE Mastery', 'Fall Protection', 'Ladder Safety'],
      },
      {
        number: 2,
        title: 'The Toolbox',
        focus: ['Power Tool Safety', 'Hand Tool Proficiency', 'Tool Maintenance'],
      },
      {
        number: 3,
        title: 'Construction Math',
        focus: ['Tape Reading', 'Fractions/Decimals', '3-4-5 Rule', 'Area/Volume'],
      },
      {
        number: 4,
        title: 'The Build - Fundamentals',
        focus: ['Blueprint Reading', 'Material ID', 'Basic Demo', 'Job Site Basics'],
      },
    ],
  },
  YEAR_2: {
    title: 'The Skill-Builder Phase',
    subtitle: 'Tradesman Proficiency',
    journey_level: 'apprentice',
    quarters: [
      {
        number: 1,
        title: 'Structural Framing',
        focus: ['Wall Framing', 'Floor/Ceiling Joists', 'Roof Systems', 'Shear Walls'],
      },
      {
        number: 2,
        title: 'Electrical Basics',
        focus: ['Wiring Rough-In', 'Circuit Layout', 'Outlet/Switch Install', 'Low Voltage'],
      },
      {
        number: 3,
        title: 'Plumbing Fundamentals',
        focus: ['PEX/Copper Supply', 'DWV Piping', 'Fixture Rough-In', 'Water Heater'],
      },
      {
        number: 4,
        title: 'Interior Finishes',
        focus: ['Drywall', 'Texture', 'Finish Carpentry', 'Window/Door Install'],
      },
    ],
  },
  YEAR_3: {
    title: 'The Journeyman Phase',
    subtitle: 'Independent Execution & Code Compliance',
    journey_level: 'journeyman',
    quarters: [
      {
        number: 1,
        title: 'Project Flow & Sequencing',
        focus: ['Scheduling', 'Coordinating Trades', 'Material Ordering', 'Site Logistics'],
      },
      {
        number: 2,
        title: 'Independent Structural Execution',
        focus: ['Advanced Framing', 'Deck Construction', 'Foundation Repairs'],
      },
      {
        number: 3,
        title: 'Advanced Systems & Code',
        focus: ['HVAC Basics', 'Energy Efficiency', 'CBC Overview', 'Inspection Points'],
      },
      {
        number: 4,
        title: 'Troubleshooting & Problem Solving',
        focus: ['Diagnosing Issues', 'Corrective Actions', 'Client Communication'],
      },
    ],
  },
  YEAR_4: {
    title: 'The Contractor Phase',
    subtitle: 'Business Law, Management, & CSLB Exam Prep',
    journey_level: 'foreman',
    quarters: [
      {
        number: 1,
        title: 'Legal Foundations & Business Organization',
        focus: ['Business Entity', 'RMO/RME', 'Advertising Rules', 'License Requirements'],
      },
      {
        number: 2,
        title: 'Contracts, Liens, & Payments',
        focus: ['B&P § 7159', 'Preliminary Notice', 'Mechanics Liens', 'Payment Protection'],
      },
      {
        number: 3,
        title: 'Employment, Safety, & Project Management',
        focus: ['AB5', 'Workers Comp', 'Cal/OSHA', 'Site Safety Plans'],
      },
      {
        number: 4,
        title: 'Estimating, Finance, & CSLB Exam Prep',
        focus: ['Estimating for Profit', 'Project Costing', 'Notice of Completion', 'Exam Prep'],
      },
    ],
  },
} as const;

// Safety Certifications
export const SAFETY_CERTIFICATIONS = {
  CAL_OSHA_10: {
    title: 'Cal/OSHA 10-Hour Card',
    required_year: 1,
    expiration_years: null, // No expiration
  },
  FALL_PROTECTION: {
    title: 'Fall Protection Training (2025 6ft Rule)',
    required_year: 1,
    expiration_years: 1,
  },
  RESPIRATORY_FIT: {
    title: 'Respiratory Fit-Test (Silica/Lead)',
    required_year: 1,
    expiration_years: 1,
  },
  HEAT_ILLNESS: {
    title: 'Heat Illness Prevention',
    required_year: 1,
    expiration_years: 1,
  },
  LEAD_SAFETY: {
    title: 'Lead-Safe Work Practices',
    required_year: 2,
    expiration_years: 2,
  },
} as const;

// Journey Level Progression
export const JOURNEY_LEVELS = {
  trainee: {
    title: 'Trainee',
    description: 'Year 1 - Learning safety and basic skills',
    counts_toward_cslb: false,
    color: '#94A3B8',
  },
  apprentice: {
    title: 'Apprentice',
    description: 'Year 2 - Developing trade proficiency',
    counts_toward_cslb: false,
    color: '#60A5FA',
  },
  journeyman: {
    title: 'Journeyman',
    description: 'Year 3+ - Independent execution',
    counts_toward_cslb: true,
    color: '#34D399',
  },
  foreman: {
    title: 'Foreman',
    description: 'Year 4 - Supervisory and business management',
    counts_toward_cslb: true,
    color: '#F59E0B',
  },
} as const;

// Trade Categories for Work Logs
export const TRADE_CATEGORIES = [
  { key: 'framing_structural', label: 'Framing/Structural', icon: 'hammer' },
  { key: 'carpentry', label: 'Carpentry', icon: 'cut' },
  { key: 'electrical', label: 'Electrical', icon: 'flash' },
  { key: 'plumbing', label: 'Plumbing', icon: 'water' },
  { key: 'concrete_masonry', label: 'Concrete/Masonry', icon: 'cube' },
  { key: 'drywall_finishing', label: 'Drywall/Finishing', icon: 'brush' },
] as const;

// Supervisory Tasks (Years 3-4)
export const SUPERVISORY_TASKS = [
  'Interpreted blueprints/schematics independently',
  'Ordered materials and managed inventory for the job site',
  'Coordinated with city inspectors for Rough-In or Final inspections',
  'Performed take-offs and assisted in project estimating',
  'Supervised a crew of 2+ people',
  'Managed project timeline and scheduling',
  'Conducted safety briefings',
  'Handled client communication and change orders',
] as const;

// Document Types
export const DOCUMENT_TYPES = {
  ENROLLMENT: 'Enrollment Agreement',
  WORK_LOG: 'Work Experience Log',
  SAFETY_CERT: 'Safety Certification',
  CONTRACT: 'Client Contract',
  MILESTONE: 'Milestone Review',
  GRADUATION: 'Graduation Certificate',
  OTHER: 'Other Document',
} as const;

// Contract Templates (B&P § 7159 Compliance)
export const CONTRACT_TEMPLATES = {
  HANDYMAN: {
    max_value: 1000,
    requires_permit: false,
    requires_license: false,
  },
  HIC: {
    max_down_payment: 1000,
    max_down_payment_percent: 10,
    requires_3_day_cancel: true,
    requires_5_day_cancel_senior: true,
  },
} as const;

// App Colors
export const COLORS = {
  primary: '#2563EB', // Blue
  secondary: '#7C3AED', // Purple
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#06B6D4', // Cyan
  
  background: {
    light: '#FFFFFF',
    dark: '#111827',
  },
  
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
  
  border: '#E5E7EB',
  
  journey_levels: {
    trainee: '#94A3B8',
    apprentice: '#60A5FA',
    journeyman: '#34D399',
    foreman: '#F59E0B',
  },
} as const;

// Typography
export const TYPOGRAPHY = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

// Status Colors
export const STATUS_COLORS = {
  draft: '#9CA3AF',
  submitted: '#3B82F6',
  approved: '#10B981',
  rejected: '#EF4444',
  
  planning: '#9CA3AF',
  active: '#3B82F6',
  completed: '#10B981',
  cancelled: '#EF4444',
} as const;

// Cal/OSHA 2025/2026 Updates
export const CAL_OSHA_UPDATES = [
  {
    effective_date: '2025-01-01',
    title: 'Fall Protection (Residential) - 6 Foot Rule',
    description: 'Strict adherence to 6-foot rule for all residential fall protection.',
  },
  {
    effective_date: '2025-01-01',
    title: 'Respiratory Protection - Fit Testing',
    description: 'Mandatory fit-testing for all respirators where dust/lead exposure possible.',
  },
  {
    effective_date: '2025-01-01',
    title: 'AB 2622 - Handyman Exemption Increase',
    description: 'Handyman exemption increased to $1,000 (labor + materials).',
  },
  {
    effective_date: '2026-01-01',
    title: 'SB 216 - Workers Comp Requirement',
    description: 'All licensed contractors must carry Workers Comp insurance (even without employees).',
  },
  {
    effective_date: '2026-01-01',
    title: 'SB 61 - Retention Cap',
    description: 'Retention on private works capped at 5% (down from 10%).',
  },
] as const;

// Support Contact Info
export const SUPPORT = {
  email: 'support@wisdomworksacademy.com',
  phone: '(555) 123-4567',
  hours: 'Monday-Friday, 9am-5pm PST',
  address: {
    street: '123 Trade School Lane',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
  },
} as const;


