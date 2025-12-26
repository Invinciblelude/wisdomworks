// Wisdom Works Academy Honor Code
// "Integrity in the Build. Honor in the Contract."

export const HONOR_CODE = {
  title: 'The Wisdom Works Academy Honor Code',
  tagline: '"Integrity in the Build. Honor in the Contract."',
  
  preamble: 'As a student of Wisdom Works Academy, I understand that a California Contractor\'s License is a privilege, not a right. I pledge to uphold the following standards of conduct:',
  
  principles: [
    {
      number: 1,
      title: 'Professionalism over Profit',
      rules: [
        {
          name: 'The $1,000 Rule',
          commitment: 'I will never knowingly accept a down payment exceeding 10% or $1,000, whichever is less. I recognize that "cash flow" never justifies a misdemeanor.',
        },
        {
          name: 'Transparent Change Orders',
          commitment: 'I will never perform extra work without a signed, written Change Order. I will not use "surprises" to inflate a project\'s cost.',
        },
      ],
    },
    {
      number: 2,
      title: 'Respect for the Craft & Code',
      rules: [
        {
          name: 'No Cut Corners',
          commitment: 'I will build to the California Building Code (CBC) or higher. I understand that a "hidden" mistake is a future failure.',
        },
        {
          name: 'Permit Integrity',
          commitment: 'I will never suggest a homeowner "skip the permit" to save time or money. I protect the property value and safety of my clients.',
        },
      ],
    },
    {
      number: 3,
      title: 'The Alumni Shield',
      rules: [
        {
          name: 'Brotherhood/Sisterhood of Builders',
          commitment: 'I will not undercut a fellow Wisdom Works graduate on a bid through deceptive pricing. We compete on quality, not by "racing to the bottom."',
        },
        {
          name: 'No Poisoning the Well',
          commitment: 'I will never speak ill of a competitor\'s work to a client. I will let my own craftsmanship and documentation speak for itself.',
        },
      ],
    },
    {
      number: 4,
      title: 'Absolute Financial Honesty',
      rules: [
        {
          name: 'Trust Funds',
          commitment: 'I recognize that progress payments are held in trust. I will pay my material suppliers and subcontractors promptly. I will never use "Job B" money to pay for "Job A" materials.',
        },
        {
          name: 'The HIS Pledge',
          commitment: 'As a registered Home Improvement Salesperson, I will never represent myself as a licensed contractor until the CSLB officially grants me my license number.',
        },
      ],
    },
    {
      number: 5,
      title: 'Safety as a Duty',
      rules: [
        {
          name: 'The 6-Foot Stand',
          commitment: 'I will not work at heights above 6 feet without proper fall protection, nor will I allow anyone under my supervision to do so. A life is worth more than a deadline.',
        },
      ],
    },
  ],
  
  acknowledgment: 'I understand that violating this Honor Code is grounds for immediate dismissal from Wisdom Works Academy and the termination of my HIS registration. I am building a legacy, and that build starts with my character.',
  
  full_text: `THE WISDOM WORKS ACADEMY HONOR CODE

"Integrity in the Build. Honor in the Contract."

As a student of Wisdom Works Academy, I understand that a California Contractor's License is a privilege, not a right. I pledge to uphold the following standards of conduct:

1. PROFESSIONALISM OVER PROFIT

The $1,000 Rule: I will never knowingly accept a down payment exceeding 10% or $1,000, whichever is less. I recognize that "cash flow" never justifies a misdemeanor.

Transparent Change Orders: I will never perform extra work without a signed, written Change Order. I will not use "surprises" to inflate a project's cost.

2. RESPECT FOR THE CRAFT & CODE

No Cut Corners: I will build to the California Building Code (CBC) or higher. I understand that a "hidden" mistake is a future failure.

Permit Integrity: I will never suggest a homeowner "skip the permit" to save time or money. I protect the property value and safety of my clients.

3. THE ALUMNI SHIELD

Brotherhood/Sisterhood of Builders: I will not undercut a fellow Wisdom Works graduate on a bid through deceptive pricing. We compete on quality, not by "racing to the bottom."

No Poisoning the Well: I will never speak ill of a competitor's work to a client. I will let my own craftsmanship and documentation speak for itself.

4. ABSOLUTE FINANCIAL HONESTY

Trust Funds: I recognize that progress payments are held in trust. I will pay my material suppliers and subcontractors promptly. I will never use "Job B" money to pay for "Job A" materials.

The HIS Pledge: As a registered Home Improvement Salesperson, I will never represent myself as a licensed contractor until the CSLB officially grants me my license number.

5. SAFETY AS A DUTY

The 6-Foot Stand: I will not work at heights above 6 feet without proper fall protection, nor will I allow anyone under my supervision to do so. A life is worth more than a deadline.

STUDENT ACKNOWLEDGMENT

I understand that violating this Honor Code is grounds for immediate dismissal from Wisdom Works Academy and the termination of my HIS registration. I am building a legacy, and that build starts with my character.

Signature: _________________________

Date: _________________________

Printed Name: _________________________`,
} as const;

// Marketing & Social Media Strategy
export const MARKETING_MATERIALS = {
  social_media_ads: [
    {
      platform: 'Facebook / Instagram',
      campaign: 'Earn While You Learn',
      headline: 'STOP WORKING FOR AN HOURLY WAGE. START BUILDING A LICENSED CAREER. 🛠️',
      body: `Are you tired of being the "helper" with no path to the top? In California, you need 4 years of experience to get your Contractor's License. Most people spend that time struggling.

At Wisdom Works Academy, we do it differently.

✅ YEAR 1: Get your HIS registration. Start earning 10% commissions on the projects you sell.
✅ YEAR 2 & 3: Master the "Big 5" trades and clock your 48 months of journey-level hours.
✅ YEAR 4: We prep you for the CSLB Exam and sign your experience affidavit.

We are an exempt vocational program (CEC § 94874(f)). Total tuition is capped at $2,500. Most of our students earn their tuition back in their first 30 days.

Don't just swing a hammer. Own the hammer.`,
      call_to_action: 'Apply Now - Limited Spots Available',
      target_audience: 'Construction workers, helpers, laborers aged 21-45',
      budget_suggestion: '$500-$1,000/month',
    },
    {
      platform: 'Nextdoor',
      campaign: 'Local Trade School',
      headline: 'Local Trade School Helping Workers Get Their Contractor License 🏗️',
      body: `I'm excited to announce Wisdom Works Academy, a new vocational program in [Your City] that's helping construction workers earn their California Contractor's License while they work.

If you know someone who:
- Works in construction but doesn't have a path to ownership
- Wants to become a licensed contractor
- Is tired of hourly wages with no future

Tell them about us. We're an exempt program (total cost under $2,500), and our students start earning commissions from Day 1 through our Home Improvement Salesperson program.

4 years from enrollment to license. No debt. Real skills. Real future.`,
      call_to_action: 'Learn More at WisdomWorksAcademy.com',
      target_audience: 'Local community members, homeowners',
      notes: 'Post in multiple neighborhood groups weekly',
    },
    {
      platform: 'LinkedIn',
      campaign: 'Professional Development',
      headline: 'California\'s Skilled Trade Shortage Has a Solution',
      body: `The construction industry needs 30,000+ new licensed contractors by 2030. But the traditional path—4 years of "hoping someone will sign your experience affidavit"—leaves most workers stuck.

Wisdom Works Academy is changing that.

We've created a structured, CSLB-compliant 4-year program that:
• Provides documented journey-level experience
• Allows students to earn while they learn (HIS commissions)
• Stays under $2,500 (BPPE exempt)
• Guarantees a signed experience affidavit at graduation

If you're a GC looking to mentor the next generation, or a skilled worker ready to level up, let's connect.`,
      call_to_action: 'Connect with me to learn more',
      target_audience: 'GCs, construction professionals, industry leaders',
    },
    {
      platform: 'YouTube / TikTok',
      campaign: 'Day in the Life',
      video_concepts: [
        'Day 1 as a Wisdom Works Student - HIS Registration Process',
        'From $25/hour Helper to Licensed Contractor in 4 Years',
        'How I Earned My First $2,000 Commission at Age 23',
        'The $1,000 Handyman Rule - How to Work Legally Without a License',
        'CSLB Exam Prep: What They Don\'t Tell You',
      ],
      hashtags: [
        '#ConstructionLife',
        '#ContractorLife',
        '#SkillsTraining',
        '#TradeSchool',
        '#CSLB',
        '#CaliforniaConstruction',
        '#WisdomWorks',
        '#EarnWhileYouLearn',
      ],
    },
  ],
  
  email_campaigns: [
    {
      sequence: 'Welcome Series',
      emails: [
        {
          day: 0,
          subject: 'Welcome to Wisdom Works Academy - Your Journey Starts Now',
          preview: 'Everything you need for Day 1',
        },
        {
          day: 3,
          subject: 'Your HIS Application Status + First Week Checklist',
          preview: 'Track your HIS registration progress',
        },
        {
          day: 7,
          subject: 'Week 1 Complete - Your Compliance Quiz Awaits',
          preview: 'Test your knowledge of AB 2622 and SB 1455',
        },
        {
          day: 14,
          subject: 'Your First Commission Opportunity',
          preview: 'How to close your first contract',
        },
        {
          day: 30,
          subject: 'Month 1 Milestone - Work Log Submission Due',
          preview: 'Don\'t forget your monthly log!',
        },
      ],
    },
    {
      sequence: 'Re-Engagement (for prospects)',
      emails: [
        {
          day: 1,
          subject: 'Still Interested in Getting Your Contractor License?',
          preview: '3 reasons Wisdom Works is different',
        },
        {
          day: 5,
          subject: 'The Real Cost of Staying an "Employee" for 10 More Years',
          preview: 'Calculate what you\'re losing',
        },
        {
          day: 10,
          subject: 'Last Chance: Founding Class Closes This Friday',
          preview: 'Limited spots remaining',
        },
      ],
    },
  ],
  
  print_materials: [
    {
      type: 'Flyer',
      title: 'Wisdom Works Academy - Trade School With a Twist',
      one_liner: 'Earn while you learn. Licensed in 4 years. Under $2,500 total.',
      qr_code_destination: 'wisdomworksacademy.com/apply',
      distribution: ['Lumber yards', 'Hardware stores', 'Community centers', 'Job sites'],
    },
    {
      type: 'Business Card',
      front: 'Wisdom Works Academy - Building California\'s Future Contractors',
      back: 'QR code + contact info',
    },
    {
      type: 'Yard Sign',
      message: 'This Crew Trained at Wisdom Works Academy',
      purpose: 'Place at job sites where students are working',
    },
  ],
  
  partnerships: [
    {
      partner_type: 'Lumber Suppliers',
      pitch: 'Offer a student discount (5-10%) and we\'ll send all our students to you.',
      benefit: 'Loyalty + bulk purchasing',
    },
    {
      partner_type: 'Tool Rental Companies',
      pitch: 'Sponsor a student\'s "First 10 Tools" and get your logo on our website.',
      benefit: 'Brand exposure + goodwill',
    },
    {
      partner_type: 'Local GCs (for guest lectures)',
      pitch: 'Come speak to our Year 4 students about running a business. We\'ll refer overflow clients to you.',
      benefit: 'Talent pipeline + referrals',
    },
  ],
  
  success_metrics: [
    'Website visits per month (goal: 500+)',
    'Application submissions (goal: 20+ per cohort)',
    'Cost per acquisition (goal: under $100)',
    'Social media engagement rate (goal: 5%+)',
    'Email open rate (goal: 30%+)',
    'Student referrals (goal: 30% of new enrollments)',
  ],
} as const;

// Branding Guidelines
export const BRAND_IDENTITY = {
  mission: 'Transforming Time into Wisdom, Opportunity into Mastery',
  
  taglines: [
    'Don\'t just swing a hammer. Own the hammer.',
    'Integrity in the Build. Honor in the Contract.',
    'From Helper to Owner in 4 Years',
    'Earn While You Learn. Licensed While You Build.',
    'California\'s Premier Exempt Trade School',
  ],
  
  brand_voice: {
    tone: 'Professional yet accessible, aspirational but grounded',
    style: 'Direct, honest, empowering',
    avoid: 'Over-promising, hype, "get rich quick" language',
    emphasize: 'Hard work, integrity, legal compliance, community',
  },
  
  brand_colors: {
    primary: '#2563EB', // Blue (trust, professionalism)
    secondary: '#F59E0B', // Amber (craftsmanship, warning/safety)
    success: '#10B981', // Green (growth, completion)
    text: '#111827', // Near-black (readability)
  },
  
  logo_concepts: [
    'A hammer and diploma crossed',
    'A blueprint with rising stairs (representing the 4-year journey)',
    'A hardhat with a graduation tassel',
    '"WW" monogram styled like construction blueprints',
  ],
  
  visual_identity: {
    photography_style: 'Real job sites, real students, authentic work',
    never_use: 'Stock photos, staged "clean" construction scenes',
    show: 'Dirt under fingernails, safety gear in action, proud students with their work',
  },
  
  competitive_positioning: {
    vs_traditional_trade_schools: 'We\'re under $2,500, they charge $15k-$50k',
    vs_apprenticeships: 'We guarantee the experience affidavit, they hope someone signs',
    vs_community_college: 'We focus on licensure, they focus on theory',
    vs_online_courses: 'We provide real hours and real documentation, they provide videos',
  },
} as const;

// Student Testimonial Templates (for future use)
export const TESTIMONIAL_TEMPLATES = [
  {
    student_type: 'Year 1 (HIS)',
    quote_template: '"I\'m 3 months in and I\'ve already earned [AMOUNT] in commissions. I\'m paying for my tuition with the money I\'m making while learning. This is the smartest investment I\'ve ever made."',
    photo_context: 'Student on job site with HIS badge visible',
  },
  {
    student_type: 'Year 3 (Journeyman)',
    quote_template: '"I\'m finally doing the work I always watched other people do. My hours are counting toward my license, and I\'m building my reputation at the same time."',
    photo_context: 'Student working independently on a framing project',
  },
  {
    student_type: 'Year 4 Graduate',
    quote_template: '"I walked away with my CSLB application signed, $10k in tools, and 3 clients already lined up. Wisdom Works didn\'t just train me—they launched my business."',
    photo_context: 'Student holding CSLB license or standing in front of their truck',
  },
] as const;

// Content Calendar Template
export const CONTENT_CALENDAR = {
  weekly_posts: [
    {
      day: 'Monday',
      theme: 'Motivation Monday',
      example: 'Spotlight a student success story or career transformation',
    },
    {
      day: 'Tuesday',
      theme: 'Tip Tuesday',
      example: 'Share a construction tip, safety reminder, or legal update',
    },
    {
      day: 'Wednesday',
      theme: 'Work-in-Progress Wednesday',
      example: 'Show current student projects with before/after photos',
    },
    {
      day: 'Thursday',
      theme: 'Throwback Thursday',
      example: 'Share a founding story or early student memory',
    },
    {
      day: 'Friday',
      theme: 'Feature Friday',
      example: 'Highlight a tool, technique, or upcoming event',
    },
  ],
  
  monthly_campaigns: [
    'January: New Year, New Career',
    'February: Safety Month (Cal/OSHA updates)',
    'March: Women in Construction',
    'April: Spring Renovation Season (HIS opportunities)',
    'May: Graduate Spotlight Month',
    'June: Summer Intensive (accelerated training)',
    'July: Independence Day = Financial Independence',
    'August: Back to School (new cohort enrollment)',
    'September: Trade Skills Challenge',
    'October: Safety Refresh (fall protection)',
    'November: Thanksgiving = Gratitude for Growth',
    'December: Year-End Reflection + New Cohort Preview',
  ],
} as const;

// Launch Day Checklist
export const LAUNCH_DAY_CHECKLIST = {
  minus_30_days: [
    'Finalize LLC formation and BPPE exemption filing',
    'Secure business insurance (GL with educational rider)',
    'Build website with all required disclaimers',
    'Create social media accounts (FB, IG, LinkedIn)',
    'Design and print marketing materials',
  ],
  
  minus_14_days: [
    'Launch social media ad campaign',
    'Post in Nextdoor/local FB groups',
    'Reach out to lumber yards for student discounts',
    'Prepare first week curriculum materials',
    'Set up student management system',
  ],
  
  minus_7_days: [
    'Conduct enrollment interviews',
    'Send welcome emails to accepted students',
    'Prepare Honor Code signing ceremony',
    'Order first week supplies (safety gear, tools)',
    'Finalize classroom/training site',
  ],
  
  launch_day: [
    'Welcome ceremony (8:00 AM)',
    'Honor Code signing (all students)',
    'HIS application submission',
    'Cal/OSHA 10-Hour training begins',
    'First day photo (post to social media)',
    'Distribute First Day Handout',
    'Assign Week 1 Compliance Quiz',
  ],
  
  week_1: [
    'Daily safety briefings',
    'Tool familiarization sessions',
    'Blueprint reading basics',
    'Friday: Week 1 Compliance Quiz',
    'Friday: First work log submission',
  ],
} as const;


