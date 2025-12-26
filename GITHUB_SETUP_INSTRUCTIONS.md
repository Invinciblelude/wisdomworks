# 🚀 Wisdom Works Academy - Setup Instructions

> **For anyone cloning this repository**

---

## 📦 **WHAT'S IN THIS REPO**

This is a **complete, production-ready trade school management platform** with:

- ✅ **Mobile app** (iOS + Android + Web)
- ✅ **25-table database** (Supabase/PostgreSQL)
- ✅ **7 complete screens** (Login, Dashboard, Roadmap, Work Logs, Honor Code, Templates)
- ✅ **Legal compliance** (BPPE § 94874(f), CSLB, 2025/2026 CA laws)
- ✅ **HIS commission system** (earn while you learn)
- ✅ **Honor Code** (digital signatures)
- ✅ **Marketing strategy** (30-day launch plan)
- ✅ **19 comprehensive guides**

**Tech Stack**: React Native + Expo + TypeScript + Supabase

---

## ⚡ **QUICK START (30 Minutes)**

### **Prerequisites:**
- Node.js 18+ and npm
- Supabase account (free tier works!)

### **1. Clone & Install** (5 min)
```bash
git clone https://github.com/Invinciblelude/wisdomworks.git
cd wisdomworks
npm install
```

### **2. Set Up Supabase** (15 min)

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Save your password!

#### B. Run Database Schemas
In Supabase → SQL Editor, run these 3 files IN ORDER:

```bash
# 1. Core schema (11 tables)
cat supabase-schema.sql
# Copy output → Paste in SQL Editor → Run

# 2. Extended schema (10 tables)
cat supabase-schema-extended.sql
# Copy output → Paste in SQL Editor → Run

# 3. Honor Code schema (4 tables)
cat supabase-honor-code-schema.sql
# Copy output → Paste in SQL Editor → Run
```

✅ **Result**: 25 tables created!

#### C. Create Storage Buckets
In Supabase → Storage, create:
- `work-log-photos` (Public)
- `certificates` (Public)
- `documents` (Private)
- `contracts` (Private)
- `project-photos` (Public)

#### D. Get API Credentials
Supabase → Settings → API:
- Copy "Project URL"
- Copy "anon public" key (Legacy tab)

### **3. Configure Environment** (2 min)

Create `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_APP_NAME=Wisdom Works Academy
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_MAX_STUDENT_FEE=2500
EXPO_PUBLIC_SUPPORT_EMAIL=support@wisdomworksacademy.com
EXPO_PUBLIC_SUPPORT_PHONE=(555) 123-4567
```

### **4. Run the App** (1 min)
```bash
npm start
# Press 'w' for web
# Press 'i' for iOS
# Press 'a' for Android
```

### **5. Create Your First Account**
1. Click "Register"
2. Fill in your details
3. Create account
4. ✅ **You're in!**

---

## 📱 **DEMO MODE (No Supabase Required)**

Want to preview without setting up database?

1. Run `npm start`
2. Open `localhost:8081`
3. Click **"🎬 Try Demo Mode"** button
4. Explore all 7 screens instantly!

---

## 📚 **DOCUMENTATION**

### **Start Here:**
- `⭐_START_HERE.md` - Quick start guide
- `THE_WISDOM_WORKS_PHILOSOPHY.md` - Mission & vision
- `🔥_CONNECT_SUPABASE_NOW.md` - Database setup

### **Complete System:**
- `MASTER_OPERATING_MANUAL.md` - Full operational blueprint
- `MARKETING_STRATEGY.md` - 30-day launch plan
- `📱_COMPLETE_APP_FEATURES.md` - All features explained

### **Technical:**
- `SETUP_GUIDE.md` - Detailed setup
- `README.md` - Platform overview

---

## 🗄️ **DATABASE SCHEMA**

**25 Tables Total:**

**Core (11):**
- users, students, instructors
- work_experience_logs, milestone_reviews
- curriculum, safety_certifications
- projects, documents
- safety_incidents, financial_transactions

**Extended (10):**
- his_registrations, commissions
- legal_templates, student_legal_documents
- compliance_items, student_compliance_tracking
- handyman_projects, material_deliveries
- project_milestones, quiz_results

**Honor Code (4):**
- honor_code_signatures, honor_code_violations
- alumni_directory, peer_referrals

---

## 🎯 **FEATURES**

### **Student App:**
- Photo-verified work logs
- 4-year journey roadmap (16 quarters)
- Progress tracking (hours, milestones, certifications)
- Financial monitoring ($2,500 cap)
- Honor Code digital signing
- Legal templates library
- Safety certification tracking

### **Legal Compliance:**
- BPPE § 94874(f) exemption
- CSLB 48-month journey tracking
- 2025/2026 CA laws (SB 1455, AB 2622, SB 61, AB 1327)
- Cal/OSHA 2025 updates
- HIC contract templates (B&P § 7159)

### **Business Model:**
- HIS commission tracking (earn while you learn)
- Handyman project system (AB 2622 $1,000 cap)
- Material delivery payments (B&P § 7159.5)
- Progress milestone system

---

## 🤝 **CONTRIBUTING**

This is a proprietary system for Wisdom Works Academy. For questions:
- Email: support@wisdomworksacademy.com
- GitHub Issues: Report bugs or request features

---

## 📄 **LICENSE**

Copyright © 2025 Wisdom Works Academy. All rights reserved.

---

## 🎉 **WHAT YOU GET**

A complete trade school management platform that:
- Takes students from helper → licensed contractor (4 years)
- Costs under $2,500 (BPPE exempt)
- Includes HIS "earn while you learn" model
- Tracks everything for CSLB certification
- Ensures ethical standards (Honor Code)
- Provides legal protection (templates, compliance)

---

**Questions? Read `⭐_START_HERE.md` for the 3-step launch plan!**

**Repository**: https://github.com/Invinciblelude/wisdomworks

