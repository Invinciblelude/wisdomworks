// Legal Constants & Updated California Law (2025/2026)

export const LEGAL_UPDATES_2025_2026 = {
  SB_1455: {
    title: 'Workers Comp Delay & CSLB Email Requirement',
    effective_date: '2025-01-01',
    workers_comp_delay: {
      original_date: '2026-01-01',
      new_date: '2028-01-01',
      description: 'Universal Workers Comp mandate delayed to January 1, 2028',
      exemption_trades: [
        'C-39 Roofing',
        'C-8 Concrete', 
        'C-20 HVAC',
        'C-22 Asbestos',
        'D-49 Tree Service',
      ],
      savings: 'Solo operators can avoid ~$2,000+ annual ghost policy until 2028',
    },
    email_requirement: {
      description: 'All licensees must provide monitored email address',
      update_window: '30 days',
      consequence: 'CSLB sends legal notices via email - "didn\'t see it" is not a defense',
    },
  },
  AB_2622: {
    title: 'Handyman Exemption Increase',
    effective_date: '2025-01-01',
    new_limit: 1000,
    old_limit: 500,
    includes: 'Labor + Materials + Tax',
    permit_rule: 'If project requires building permit, exemption does NOT apply',
    examples: {
      legal: ['$600 labor + $350 materials = $950 ✓', 'Minor repairs under $1,000'],
      illegal: [
        '$600 labor + $450 window = $1,050 ✗',
        'Any permit-required work regardless of price',
        'Water heater replacement (requires permit)',
        'New electrical circuit (requires permit)',
      ],
    },
  },
  SB_61: {
    title: 'Retention Cap Reduction',
    effective_date: '2026-01-01',
    old_cap: 10,
    new_cap: 5,
    description: 'Retention on private works capped at 5% (down from 10%)',
  },
  AB_1327: {
    title: 'Notice of Right to Cancel Modernization',
    effective_date: '2025-01-01',
    updates: [
      'Email cancellation now accepted',
      'Must include contractor support phone number',
      'Must include contractor email address',
    ],
  },
} as const;

// Material Delivery Payment Clause (B&P § 7159.5)
export const MATERIAL_DELIVERY_CLAUSE = `SECTION: PAYMENT FOR MATERIALS DELIVERED

Pursuant to California Business and Professions Code § 7159.5, the Contractor may request and accept payment for materials and equipment once they have been delivered to the project site and are under the control of the Owner, even if such materials have not yet been incorporated into the work. 

Upon delivery of significant materials (e.g., lumber, windows, cabinetry, or appliances), Contractor shall provide an invoice for the value of said materials. Owner agrees to pay such invoice within three (3) days of delivery. 

Ownership and title to the materials shall pass to the Owner upon payment, and Contractor shall provide a corresponding "Unconditional Waiver and Release on Progress Payment" for the value of the materials received.`;

// Progress Payment Schedule Template
export const PROGRESS_PAYMENT_SCHEDULE_TEMPLATE = {
  required_text: 'IT IS AGAINST THE LAW FOR A CONTRACTOR TO COLLECT PAYMENT FOR WORK NOT YET COMPLETED, OR FOR MATERIALS NOT YET DELIVERED. HOWEVER, A CONTRACTOR MAY REQUIRE A DOWN PAYMENT.',
  
  header: 'SCHEDULE OF PROGRESS PAYMENTS',
  
  description: 'The schedule of progress payments must specifically describe each phase of work, including the type and amount of work or services scheduled to be supplied in each phase, along with the amount of each proposed progress payment.',
  
  milestones: [
    {
      phase: 'Deposit',
      description: 'Initial down payment (10% or $1,000 max)',
      variable: true,
    },
    {
      phase: 'Milestone 1',
      description: 'Site Mobilization: Delivery of dumpster, scaffolding, and site protection',
      variable: true,
    },
    {
      phase: 'Milestone 2', 
      description: 'Material Delivery: Delivery of [Specify: Windows/Lumber/Cabinetry] to site',
      variable: true,
    },
    {
      phase: 'Milestone 3',
      description: 'Rough Work: Completion of framing and rough-in plumbing',
      variable: true,
    },
    {
      phase: 'Milestone 4',
      description: 'Substantial Completion: All major work done; project ready for intended use',
      variable: true,
    },
    {
      phase: 'Final Payment',
      description: 'Completion of "Punch List" and final site clean-up',
      variable: true,
    },
  ],
} as const;

// Stop Work Notice (Civil Code § 8830)
export const STOP_WORK_NOTICE_TEMPLATE = {
  step_1: {
    title: '5-Day Notice of Intent to Serve Stop Work Notice',
    description: 'Post this at the job site',
    template: `NOTICE OF INTENT TO SERVE STOP WORK NOTICE

TO: [Owner Name]
PROJECT: [Project Address]

NOTICE IS HEREBY GIVEN that Contractor intends to serve a Stop Work Notice pursuant to California Civil Code § 8830 if payment in the amount of $[Amount] is not received within FIVE (5) days from the date of posting this notice.

Date Posted: [Date]
Contractor: [Name]
License #: [License Number]`,
  },
  
  step_2: {
    title: '10-Day Stop Work Notice',
    description: 'Serve via Certified Mail if payment not received',
    template: `STOP WORK NOTICE
(California Civil Code § 8830)

TO: [Owner Name]
PROJECT: [Project Address]

NOTICE IS HEREBY GIVEN that work will cease in TEN (10) days unless payment in the amount of $[Amount] is received for work performed and/or materials delivered.

This notice is served pursuant to California Civil Code § 8830. Failure to pay within 10 days will result in the cessation of all work on the project.

Amount Due: $[Amount]
Payment must be made to: [Contractor Name/Entity]

Date: [Date]
Contractor Signature: _____________________
License #: [License Number]

SEND VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED`,
  },
} as const;

// Notice of Completion (Civil Code § 8182)
export const NOTICE_OF_COMPLETION_TEMPLATE = {
  title: 'NOTICE OF COMPLETION',
  description: 'Recording this within 15 days shortens lien rights',
  
  benefits: {
    gc_lien_rights: '60 days (from 90 days)',
    sub_lien_rights: '30 days (from 90 days)',
  },
  
  template: `RECORDING REQUESTED BY:
[Your Name/Company]

WHEN RECORDED MAIL TO:
[Your Address]

NOTICE OF COMPLETION

NOTICE IS HEREBY GIVEN pursuant to California Civil Code § 8182 that:

1. The name and address of the owner is:
   [Owner Name]
   [Owner Address]

2. The nature of interest or estate of the owner is: Fee Simple

3. The name and address of the original contractor (if any) is:
   [Contractor Name]
   [Contractor Address]
   License #: [License Number]

4. A description of the jobsite sufficient for identification is:
   [Property Legal Description or Address]

5. The work of improvement was completed on: [Date]

Date: [Date]
Signature: _____________________
[Owner Name], Owner

STATE OF CALIFORNIA
COUNTY OF [County Name]

[Notary Section]`,
} as const;

// HIS Commission & Mentorship Agreement
export const HIS_COMMISSION_AGREEMENT_TEMPLATE = `STUDENT COMMISSION & MENTORSHIP AGREEMENT

BETWEEN:

Contractor (The School/Master):
Name: [Your Name/Entity Name]
CA License #: [Your License Number]

Student (The Registered HIS):
Name: [Student Name]
HIS Registration #: [Registration Number or "Pending"]

1. SCOPE OF ROLE

The Student is registered as a Home Improvement Salesperson (HIS) under the Contractor's license. The Student is authorized to solicit, sell, and negotiate home improvement contracts on behalf of the Contractor. All contracts must be written on the Contractor's approved forms and are subject to final approval by the Contractor.

2. COMMISSION STRUCTURE

The Contractor agrees to pay the Student a commission for every "Qualified Contract" (a contract signed by the homeowner, where the 3-day/5-day right to cancel has expired, and the down payment has been cleared).

Commission Rate: [X]% of the Gross Profit
- Gross Profit = Total Contract Price minus (Labor + Materials + Permits + Disposal)

Payment Timing: Commissions will be disbursed in two stages:
- 50% upon successful clearing of the initial milestone payment (after material delivery)
- 50% upon "Substantial Completion" and receipt of final payment from the owner

3. THE "EARN WHILE YOU LEARN" PROTOCOL

Because this is a vocational program, the Student is encouraged to perform the labor on the projects they sell to clock their 48-month CSLB journey-level hours.

Labor Compensation: If the Student performs the labor, they will be paid a pre-agreed hourly training rate or a "labor carve-out" from the project budget, separate from their sales commission.

4. LEGAL & ETHICS COMPLIANCE

No Direct Payments: Student shall never accept a check or cash made out to their own name. All payments must be made to [Your Entity Name].

Full Disclosure: Student must provide every homeowner with the Notice of Right to Cancel and all 2025/2026 mandated disclosures.

Conduct: Any "high-pressure" sales tactics or misrepresentation of materials will result in immediate termination from the HIS registration and the Academy.

5. WORK EXPERIENCE DOCUMENTATION

Student agrees to submit monthly Work Experience Logs documenting all hours worked, including:
- Project photos (before/after)
- Hours breakdown by trade
- Description of duties performed
- Client/project information

6. TERMINATION

Either party may terminate this agreement with 30 days written notice. Upon termination:
- Student's HIS registration will be cancelled
- Any pending commissions for completed work will be paid out
- Student must return all company materials and tools

Student Signature: _____________________ Date: _________

Contractor Signature: __________________ Date: _________`;

// First Day Student Handout
export const FIRST_DAY_HANDOUT = {
  title: 'WELCOME TO WISDOM WORKS ACADEMY',
  subtitle: 'How to Earn Your First Check in 30 Days',
  
  sections: [
    {
      step: 1,
      title: 'Your HIS Registration',
      content: [
        'On Day 1, we submit your Home Improvement Salesperson (HIS) application.',
        'The Deal: You become a legal representative of Wisdom Works.',
        'The Commission: You earn commission on the gross profit of contracts you close.',
        'Processing Time: 2-4 weeks for approval',
      ],
    },
    {
      step: 2,
      title: 'The $1,000 "Small Project" Hustle (AB 2622)',
      content: [
        'While your HIS card processes, you can do minor repairs.',
        'The $1k Limit: Total bill (Labor + Materials) must be under $1,000.',
        'The "Permit" No-Go: If the city requires a permit (plumbing/electrical/structural), stop. You cannot do it without a license.',
        'The Disclaimer: Your flyers MUST say: "I am not a licensed contractor."',
      ],
      warnings: [
        'Water heater replacement = REQUIRES LICENSE (permit)',
        'New electrical circuit = REQUIRES LICENSE (permit)',
        '$600 labor + $450 materials = $1,050 = ILLEGAL',
      ],
    },
    {
      step: 3,
      title: 'The CSLB Email Requirement (SB 1455)',
      content: [
        'You must establish a professional business email today.',
        'The CSLB will use this to send you your "Notice to Schedule" your exams in Year 4.',
        'Update Rule: Any change to this email must be reported within 30 days.',
        'Recommended: firstname.lastname@gmail.com or your-business@domain.com',
      ],
    },
    {
      step: 4,
      title: 'Building Your "Golden File"',
      content: [
        'Every Friday, you must upload:',
        '- Photos: Before/After of your work',
        '- Logs: Total hours worked',
        '- Validation: Signed by your Master Mentor',
        '',
        'This is your evidence for the 2028 licensing board.',
        'In 48 months, we sign the CSLB Affidavit that launches your independent career.',
      ],
    },
  ],
  
  pro_tips: [
    {
      title: 'The "Proof of Delivery" Photo',
      tip: 'The second the delivery truck leaves, take a photo of the materials on the homeowner\'s driveway. Attach it to your invoice.',
    },
    {
      title: 'The "Insurance" Pivot',
      tip: 'When materials are delivered, tell the homeowner: "Once these are paid for, you own them. You should notify your insurance so they are covered while they sit in your garage."',
    },
    {
      title: 'The "Joint Control" Trigger',
      tip: 'For large jobs ($50k+), use a Joint Control Service. The homeowner puts money in escrow, and the escrow company pays you and suppliers directly.',
    },
  ],
} as const;

// 30-Day Launch Calendar
export const LAUNCH_CALENDAR = {
  week_1: {
    title: 'Entity & Legal',
    tasks: [
      'File LLC via CA BizFile',
      'Submit BPPE Form 71395 (Exemption Verification)',
      'Open Business Bank Account',
      'Apply for EIN (Federal Tax ID)',
    ],
  },
  week_2: {
    title: 'Infrastructure',
    tasks: [
      'Secure GL Insurance with "Educational Rider"',
      'Set up professional email (SB 1455 compliance)',
      'Draft Student Handbook',
      'Create student contract templates',
      'Set up accounting system (QuickBooks/Wave)',
    ],
  },
  week_3: {
    title: 'Marketing',
    tasks: [
      'Launch website with BPPE Disclaimers',
      'Post on local forums (Nextdoor/Facebook) about "Trade Mentorship"',
      'Run "HIS Informational" webinar',
      'Create social media accounts',
      'Design student recruitment materials',
    ],
  },
  week_4: {
    title: 'Enrollment',
    tasks: [
      'Conduct interviews for "Founding Class"',
      'Sign first Enrollment Agreement ($1,000 max deposit)',
      'Submit student\'s HIS application to CSLB',
      'Schedule orientation session',
      'Prepare first week curriculum materials',
    ],
  },
} as const;

// Compliance Quiz (End of Week 1)
export const COMPLIANCE_QUIZ = {
  title: 'Week 1 Compliance Quiz',
  passing_score: 90,
  questions: [
    {
      id: 1,
      question: 'What is the maximum amount a project can cost under the AB 2622 handyman exemption?',
      options: ['$500', '$1,000', '$1,500', '$2,000'],
      correct: 1,
      explanation: 'AB 2622 increased the handyman exemption to $1,000 (labor + materials + tax).',
    },
    {
      id: 2,
      question: 'If a project requires a building permit, can you do it under the handyman exemption?',
      options: ['Yes, if under $1,000', 'No, never', 'Yes, if the homeowner gets the permit', 'Only for electrical work'],
      correct: 1,
      explanation: 'If a project requires a permit, the handyman exemption does NOT apply, regardless of price.',
    },
    {
      id: 3,
      question: 'When must you update your email address with the CSLB (per SB 1455)?',
      options: ['Within 7 days', 'Within 30 days', 'Within 60 days', 'At renewal only'],
      correct: 1,
      explanation: 'SB 1455 requires email updates within 30 days of any change.',
    },
    {
      id: 4,
      question: 'A project costs $600 for labor and $450 for materials. Can you do this as a handyman?',
      options: ['Yes', 'No', 'Only if no permit required', 'Only with written agreement'],
      correct: 1,
      explanation: '$600 + $450 = $1,050, which exceeds the $1,000 limit. This requires a license.',
    },
    {
      id: 5,
      question: 'When did the universal Workers Comp mandate get delayed to (per SB 1455)?',
      options: ['2026', '2027', '2028', '2029'],
      correct: 2,
      explanation: 'SB 1455 delayed the Workers Comp mandate from 2026 to January 1, 2028.',
    },
    {
      id: 6,
      question: 'What must your handyman flyers say?',
      options: [
        '"Licensed and Insured"',
        '"I am not a licensed contractor"',
        '"Bonded Professional"',
        'Nothing special',
      ],
      correct: 1,
      explanation: 'You MUST disclose "I am not a licensed contractor" when working under the exemption.',
    },
    {
      id: 7,
      question: 'Can you accept payments directly to your name as an HIS?',
      options: ['Yes', 'No', 'Only checks', 'Only cash under $500'],
      correct: 1,
      explanation: 'All payments must go to the licensed contractor (the school), never directly to you.',
    },
    {
      id: 8,
      question: 'How often must you submit work experience logs?',
      options: ['Daily', 'Weekly', 'Monthly', 'Quarterly'],
      correct: 2,
      explanation: 'Work logs must be submitted monthly with photos and hours breakdown.',
    },
    {
      id: 9,
      question: 'What is the new retention cap on private works contracts (per SB 61, effective 2026)?',
      options: ['10%', '7.5%', '5%', '2.5%'],
      correct: 2,
      explanation: 'SB 61 reduces retention from 10% to 5% effective January 1, 2026.',
    },
    {
      id: 10,
      question: 'How many journey-level hours do you need for CSLB General B licensure?',
      options: ['24 months', '36 months', '48 months', '60 months'],
      correct: 2,
      explanation: 'The CSLB requires 48 months (4 years) of journey-level experience.',
    },
  ],
} as const;

// Final Compliance Checklist
export const FINAL_COMPLIANCE_CHECKLIST = {
  title: 'Master Compliance Checklist',
  categories: [
    {
      name: 'BPPE Compliance',
      items: [
        { text: 'Form 71395 filed and approved', critical: true },
        { text: 'Website has exemption disclaimer in footer', critical: true },
        { text: 'All student fees total ≤ $2,500', critical: true },
        { text: 'No federal/state financial aid accepted', critical: true },
        { text: 'Student enrollment agreements signed', critical: true },
      ],
    },
    {
      name: 'CSLB Compliance',
      items: [
        { text: '48-month journey-level curriculum documented', critical: true },
        { text: 'Work experience log system operational', critical: true },
        { text: 'Monthly photo verification process established', critical: false },
        { text: 'Certifier affidavit template ready', critical: true },
        { text: 'All students have professional email (SB 1455)', critical: true },
      ],
    },
    {
      name: '2025/2026 Legal Updates',
      items: [
        { text: 'AB 2622: $1,000 handyman limit communicated', critical: true },
        { text: 'SB 1455: Workers Comp exemption understood (until 2028)', critical: false },
        { text: 'SB 61: 5% retention cap in contracts (2026)', critical: false },
        { text: 'AB 1327: Email cancellation in right-to-cancel notices', critical: true },
      ],
    },
    {
      name: 'Safety & Cal/OSHA',
      items: [
        { text: 'IIPP (Injury & Illness Prevention Program) written', critical: true },
        { text: 'Cal/OSHA 10-Hour training scheduled', critical: true },
        { text: '2025 Fall Protection (6ft rule) training materials', critical: true },
        { text: 'Respiratory fit-testing protocols established', critical: false },
        { text: 'Heat illness prevention plan posted', critical: true },
      ],
    },
    {
      name: 'HIS Program',
      items: [
        { text: 'HIS applications submitted for Year 1 students', critical: true },
        { text: 'Commission agreement signed', critical: true },
        { text: 'Payment tracking system set up', critical: true },
        { text: 'Contract templates approved by attorney', critical: true },
        { text: 'Student understands "no direct payments" rule', critical: true },
      ],
    },
    {
      name: 'Insurance & Risk',
      items: [
        { text: 'General Liability with Educational Rider active', critical: true },
        { text: 'Workers Comp policy (if applicable)', critical: false },
        { text: 'Professional Liability considered', critical: false },
        { text: 'Tool/equipment insurance', critical: false },
      ],
    },
  ],
} as const;

// Export all templates as a collection
export const LEGAL_TEMPLATES = {
  material_delivery_clause: MATERIAL_DELIVERY_CLAUSE,
  progress_payment_schedule: PROGRESS_PAYMENT_SCHEDULE_TEMPLATE,
  stop_work_notice: STOP_WORK_NOTICE_TEMPLATE,
  notice_of_completion: NOTICE_OF_COMPLETION_TEMPLATE,
  his_commission_agreement: HIS_COMMISSION_AGREEMENT_TEMPLATE,
  first_day_handout: FIRST_DAY_HANDOUT,
  compliance_quiz: COMPLIANCE_QUIZ,
} as const;


