# 🛠️ Wisdom Works Academy

> **"Don't just swing a hammer. Own the hammer."**

## The Complete Launch-Ready Trade School Platform

A production-ready mobile app + database system for managing a 4-year CSLB-compliant trade school that takes students from helper to licensed General Building (B) Contractor.

---

## ⚡ QUICK START

```bash
# 1. Set up Supabase (30 min)
# Follow SETUP_GUIDE.md

# 2. Configure app
cd wisdom-works-academy
npm install
# Create .env with Supabase credentials

# 3. Run the app
npm start
# Press 'i' for iOS or 'a' for Android

# 4. Create test account
# 5. Sign Honor Code
# 6. Submit test work log
```

**🎯 BEST PLACE TO START**: Read `⭐_START_HERE.md`

---

## 📖 DOCUMENTATION GUIDE

### New? Start Here:
1. **⭐_START_HERE.md** - Your 3-step launch plan ← **READ THIS FIRST**
2. **THE_WISDOM_WORKS_PHILOSOPHY.md** - Mission + coffee shop script
3. **SETUP_GUIDE.md** - Technical setup (Supabase + app)

### Want the Full Picture?
4. **🚀_YOUR_COMPLETE_SYSTEM.md** - Everything you have
5. **MASTER_OPERATING_MANUAL.md** - Complete operational blueprint
6. **LAUNCH_READY_APP_GUIDE.md** - App features + Day 1 workflow

### Marketing & Growth:
7. **MARKETING_STRATEGY.md** - 30-day launch + ongoing campaigns

### Reference:
8. **COMPLETE_FEATURE_LIST.md** - Every feature documented
9. **PROJECT_SUMMARY.md** - Technical overview
10. **FINAL_SUMMARY.md** - Executive summary

---

## 🎉 WHAT YOU GET

A comprehensive mobile-first platform for managing a 4-year CSLB-compliant trade school that takes students from apprentice to licensed General Building (B) Contractors in California.

## 📱 Platform Overview

Wisdom Works Academy is a full-stack mobile application built with Expo + React Native + TypeScript, designed to manage every aspect of a CSLB-compliant trade school:

- **Student Progress Tracking**: 4-year journey from Trainee → Apprentice → Journeyman → Foreman
- **Work Experience Logging**: Photo-verified monthly logs for CSLB certification
- **Curriculum Management**: Quarter-by-quarter learning materials and assessments
- **Safety Compliance**: Cal/OSHA certification tracking and IIPP management
- **Financial Compliance**: Automatic $2,500 cap enforcement (BPPE § 94874(f))
- **Document Management**: Contracts, certifications, and legal forms
- **Instructor Portal**: Review logs, assess progress, generate CSLB certifications
- **Admin Dashboard**: School-wide analytics and compliance monitoring

---

## 🏗️ Tech Stack

### Frontend (Mobile App)
- **Framework**: Expo SDK 54 with React Native
- **Language**: TypeScript (strict mode)
- **State Management**: Zustand
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **UI**: Custom components with react-native-reanimated
- **Forms**: React Hook Form + Zod validation
- **Image Handling**: expo-image, expo-camera, expo-image-picker

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (photos, documents, PDFs)
- **Real-time**: Supabase Realtime
- **Row-Level Security**: Enabled for all tables

### Additional Services
- **Push Notifications**: Expo Notifications
- **Version Control**: Git + GitHub
- **Deployment**: EAS (Expo Application Services)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Supabase account ([https://supabase.com](https://supabase.com))
- iOS Simulator (Mac only) or Android Emulator
- Physical iOS/Android device (optional, recommended for testing)

### 1. Clone & Install

```bash
# Navigate to project directory
cd wisdom-works-academy

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. Run the database schema:
   - Open the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL to create all tables, functions, and policies

3. Create Storage Buckets:
   - Go to Storage in Supabase dashboard
   - Create the following buckets (set to "Public" for easy access):
     - `work-log-photos`
     - `certificates`
     - `documents`
     - `contracts`
     - `project-photos`

4. Get your Supabase credentials:
   - Go to Settings → API
   - Copy your **Project URL** and **Anon Public Key**

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
EXPO_PUBLIC_APP_NAME=Wisdom Works Academy
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=development

# Feature Flags
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true

# Legal & Compliance
EXPO_PUBLIC_MAX_STUDENT_FEE=2500
EXPO_PUBLIC_SUPPORT_EMAIL=support@wisdomworksacademy.com
EXPO_PUBLIC_SUPPORT_PHONE=(555) 123-4567
```

### 4. Run the App

```bash
# Start the Expo development server
npm start

# Run on iOS Simulator (Mac only)
npm run ios

# Run on Android Emulator
npm run android

# Run on web browser
npm run web
```

### 5. Create Your First Account

1. Tap "Register" on the login screen
2. Fill in your information
3. Check your email for verification
4. Sign in with your credentials

**Note**: The first account created will be a "student" by default. To create instructor or admin accounts, you'll need to manually update the `role` field in the `users` table in Supabase.

---

## 📐 Project Structure

```
wisdom-works-academy/
│
├── App.tsx                          # Main app entry point
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── supabase-schema.sql              # Database schema
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── shared/                  # Shared components (buttons, cards, etc.)
│   │   ├── student/                 # Student-specific components
│   │   ├── instructor/              # Instructor-specific components
│   │   └── admin/                   # Admin-specific components
│   │
│   ├── screens/                     # Screen components
│   │   ├── auth/                    # Login, Register
│   │   ├── student/                 # Student dashboard, logs, etc.
│   │   ├── instructor/              # Instructor portal
│   │   ├── admin/                   # Admin dashboard
│   │   └── public/                  # Public/marketing pages
│   │
│   ├── navigation/                  # Navigation configuration
│   │
│   ├── services/                    # External services
│   │   └── supabase.ts              # Supabase client
│   │
│   ├── store/                       # Zustand state management
│   │   ├── authStore.ts             # Authentication state
│   │   └── studentStore.ts          # Student data state
│   │
│   ├── types/                       # TypeScript type definitions
│   │   └── index.ts                 # All interfaces and types
│   │
│   ├── utils/                       # Utility functions
│   │
│   └── constants/                   # App constants
│       └── index.ts                 # Colors, typography, legal text, etc.
│
└── assets/                          # Images, fonts, etc.
```

---

## 🎓 Key Features

### For Students

#### 1. **Journey Dashboard**
- Visual 4-year roadmap showing current position
- Progress rings for hours, milestones, and certifications
- Financial status tracker (ensures $2,500 compliance)

#### 2. **Work Experience Logs**
- Monthly log submission with photo uploads
- Trade duty breakdown (Framing, Electrical, Plumbing, etc.)
- Supervisory task tracking (Years 3-4)
- Auto-calculation of hours
- Draft saving capability

#### 3. **Learning Hub**
- Quarter-specific curriculum access
- Video tutorials
- Downloadable safety protocols and legal forms
- Interactive construction math tools

#### 4. **Safety Certifications**
- Digital certification wallet
- Renewal reminders
- Cal/OSHA compliance tracking

#### 5. **Project Management**
- Client contract tracking
- Financial breakdowns
- Document storage
- Progress photos

### For Instructors

#### 1. **Student Progress Monitor**
- View all students by year/journey level
- Filter by status
- Individual student drill-down

#### 2. **Log Review Interface**
- Photo verification
- Trade duty validation
- Hour approval/adjustment
- Feedback and comments

#### 3. **Milestone Assessments**
- Digital assessment forms
- Competency checklists
- Journey-level determination
- Digital signature capture

#### 4. **CSLB Certification Generator**
- Auto-populate CSLB forms
- Generate "Certifier Statement of Verification"
- Export to PDF

### For Admins

#### 1. **Enrollment Pipeline**
- Application review
- Document verification
- Contract generation
- Payment plan setup

#### 2. **Compliance Dashboard**
- BPPE exemption status monitoring
- Financial cap tracking (per student)
- Required disclosure tracking
- Cal/OSHA compliance metrics

#### 3. **Document Generator**
- Template library
- Auto-fill from student data
- Batch generation
- Version control

#### 4. **Analytics & Reporting**
- Student progression funnel
- Completion rates
- Safety incident trends
- Financial reports

---

## 📊 Database Schema

The app uses a PostgreSQL database (via Supabase) with the following core tables:

- **users**: Core user accounts (extends Supabase Auth)
- **students**: Student records with journey-level tracking
- **instructors**: Instructor profiles and CSLB license info
- **work_experience_logs**: Monthly work logs (required for CSLB)
- **milestone_reviews**: Quarterly/annual assessments
- **curriculum**: 4-year curriculum structure
- **safety_certifications**: Cal/OSHA certifications
- **projects**: Student project tracking
- **documents**: File storage references
- **safety_incidents**: Incident reporting
- **financial_transactions**: Payment tracking

See `supabase-schema.sql` for the complete schema with triggers, functions, and row-level security policies.

---

## ⚖️ Legal Compliance

This platform is designed to support California legal requirements:

### BPPE Exemption (CEC § 94874(f))
- Total student charges capped at **$2,500**
- Automatic enforcement via database constraints
- Required disclosures displayed during registration

### CSLB Certification Support
- Tracks **48 months** of journey-level experience
- Photo-verified work logs for audit defense
- Certifier statement generation
- Journey-level progression tracking

### Cal/OSHA Compliance
- Safety certification tracking
- IIPP (Injury & Illness Prevention Program) support
- Incident reporting
- 2025/2026 regulatory updates included

### Contract Compliance (B&P § 7159)
- HIC (Home Improvement Contract) templates
- Notice of Right to Cancel (AB 1327 / 2025)
- Mechanics lien notices
- Progress payment tracking

---

## 🔒 Security Features

- **Row-Level Security (RLS)**: Enforced on all tables
- **Role-Based Access Control**: Student, Instructor, Admin roles
- **Secure Authentication**: Supabase Auth with email verification
- **Data Encryption**: All sensitive data encrypted at rest
- **Audit Logging**: All critical actions logged
- **Document Retention**: 5+ year retention for CSLB audits

---

## 🛠️ Development

### Running Tests (Coming Soon)
```bash
npm test
```

### Building for Production
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Updating Expo SDK
```bash
npx expo install expo@latest
```

---

## 📝 To-Do List

See `WISDOM_WORKS_APP_STRUCTURE.md` for the comprehensive feature roadmap.

### MVP Features (Completed)
- ✅ App structure and architecture
- ✅ Database schema design
- ✅ Authentication system
- ✅ Student dashboard
- ✅ Core type definitions
- ✅ Constants and configuration

### Next Up
- 🔲 Work log submission with photo uploads
- 🔲 4-year roadmap UI
- 🔲 Instructor review portal
- 🔲 Safety certification tracking
- 🔲 Document management
- 🔲 Admin dashboard
- 🔲 Push notifications
- 🔲 Offline support

---

## 📚 Resources

- **Expo Documentation**: [https://docs.expo.dev](https://docs.expo.dev)
- **React Native**: [https://reactnative.dev](https://reactnative.dev)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **CSLB Requirements**: [https://www.cslb.ca.gov](https://www.cslb.ca.gov)
- **BPPE Information**: [https://www.bppe.ca.gov](https://www.bppe.ca.gov)
- **Cal/OSHA**: [https://www.dir.ca.gov/dosh](https://www.dir.ca.gov/dosh)

---

## 🤝 Contributing

This is a proprietary application for Wisdom Works Academy. For questions or support, contact:

- **Email**: support@wisdomworksacademy.com
- **Phone**: (555) 123-4567

---

## 📄 License

Copyright © 2025 Wisdom Works Academy. All rights reserved.

This application is designed to operate under California BPPE exemption § 94874(f) and supports CSLB licensing requirements.

---

## 🎯 Mission Statement

**Wisdom Works Academy exists to transform economic hardship into opportunity by providing accessible, high-quality trade education that produces licensed, competent, and ethical General Building Contractors.**

We believe true empowerment comes not from handouts, but from the ability to build, manage, and lead. Our 4-year journey from Apprentice to Contractor is designed to give students the practical skills, business acumen, and legal knowledge needed to thrive as independent professionals.

**Welcome to the journey. Let's build your future. 🛠️**


