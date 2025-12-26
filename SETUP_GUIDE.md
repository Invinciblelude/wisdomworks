# Wisdom Works Academy - Complete Setup Guide

Follow these steps to get your Wisdom Works Academy app running locally and prepare for production deployment.

---

## Step 1: Verify Prerequisites

### Check Installations

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if Expo CLI is installed
expo --version

# If Expo CLI is not installed:
npm install -g expo-cli
```

### Install Mobile Development Tools

#### For iOS (Mac only):
1. Install Xcode from the Mac App Store
2. Open Xcode and install additional components when prompted
3. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
4. Open iOS Simulator:
   ```bash
   open -a Simulator
   ```

#### For Android:
1. Download and install Android Studio from [developer.android.com](https://developer.android.com/studio)
2. Open Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK
3. Install the latest Android SDK and SDK tools
4. Set up Android Emulator in AVD Manager

---

## Step 2: Set Up Supabase

### Create Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter:
   - **Name**: Wisdom Works Academy
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to your users
5. Wait for project to finish initializing (~2 minutes)

### Run Database Schema

1. In your Supabase dashboard, navigate to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open `supabase-schema.sql` from your project directory
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. Verify success - you should see "Success. No rows returned"

### Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see 11 tables:
   - users
   - students
   - instructors
   - work_experience_logs
   - milestone_reviews
   - curriculum
   - safety_certifications
   - projects
   - documents
   - safety_incidents
   - financial_transactions

### Create Storage Buckets

1. Navigate to **Storage** in the left sidebar
2. Click "Create a new bucket"
3. Create the following buckets (one at a time):

   **Bucket 1: work-log-photos**
   - Name: `work-log-photos`
   - Public bucket: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: image/*
   - Click "Save"

   **Bucket 2: certificates**
   - Name: `certificates`
   - Public bucket: ✅ Yes
   - File size limit: 10 MB
   - Allowed MIME types: application/pdf, image/*
   - Click "Save"

   **Bucket 3: documents**
   - Name: `documents`
   - Public bucket: ❌ No (private)
   - File size limit: 10 MB
   - Allowed MIME types: application/pdf, application/msword
   - Click "Save"

   **Bucket 4: contracts**
   - Name: `contracts`
   - Public bucket: ❌ No (private)
   - File size limit: 10 MB
   - Allowed MIME types: application/pdf
   - Click "Save"

   **Bucket 5: project-photos**
   - Name: `project-photos`
   - Public bucket: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: image/*
   - Click "Save"

### Get API Credentials

1. Navigate to **Settings** → **API** in the left sidebar
2. You'll need two values:
   - **Project URL**: Copy from "Project URL" section
   - **Anon Public Key**: Copy from "Project API keys" → "anon public"

**Save these securely** - you'll need them in the next step!

---

## Step 3: Configure Environment Variables

1. In your project directory, create a `.env` file:
   ```bash
   cd /Users/invinciblelude/trade\ school/wisdom-works-academy
   touch .env
   ```

2. Open `.env` in your code editor and paste:
   ```env
   # Supabase Configuration
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
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

3. **Replace the following**:
   - `EXPO_PUBLIC_SUPABASE_URL`: Paste your Project URL from Step 2
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Paste your Anon Public Key from Step 2
   - Update support email and phone if desired

4. Save the file

**⚠️ IMPORTANT**: Never commit `.env` to version control! It's already in `.gitignore`.

---

## Step 4: Install Dependencies

```bash
# Make sure you're in the project directory
cd /Users/invinciblelude/trade\ school/wisdom-works-academy

# Install all dependencies
npm install
```

This will install:
- Expo SDK 54
- React Navigation
- Supabase client
- Zustand (state management)
- React Hook Form
- Zod (validation)
- All other dependencies

**Expected time**: ~2-3 minutes

---

## Step 5: Start the Development Server

```bash
npm start
```

This will:
1. Start the Expo Metro bundler
2. Open a browser with the Expo DevTools
3. Display a QR code in your terminal

You should see output like:
```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

---

## Step 6: Run on a Device or Simulator

### Option A: iOS Simulator (Mac only)

1. Press `i` in the terminal (or type `npm run ios`)
2. The iOS Simulator will launch automatically
3. The app will build and install
4. First launch may take 1-2 minutes

### Option B: Android Emulator

1. Open Android Studio → AVD Manager → Launch an emulator
2. Once emulator is running, press `a` in the terminal (or type `npm run android`)
3. The app will build and install
4. First launch may take 2-3 minutes

### Option C: Physical Device

#### iOS:
1. Install "Expo Go" from the App Store
2. Open Camera app and scan the QR code
3. Tap the notification to open in Expo Go

#### Android:
1. Install "Expo Go" from the Play Store
2. Open Expo Go and scan the QR code
3. App will load

### Option D: Web Browser

1. Press `w` in the terminal (or type `npm run web`)
2. Browser will open at `http://localhost:19006`
3. **Note**: Some features (camera, native components) won't work on web

---

## Step 7: Create Your First Account

1. When the app loads, you'll see the **Login Screen**
2. Tap "**Register**"
3. Fill in the registration form:
   - Full Name: Your name
   - Email: A valid email address
   - Password: At least 8 characters
   - Confirm Password: Same as above
   - ✅ Check "I agree to the Terms of Service"
4. Tap "**Create Account**"
5. Check your email for a verification link (check spam folder)
6. Click the verification link
7. Return to the app and tap "**Sign In**"
8. Enter your email and password
9. Tap "**Sign In**"

You should now see the **Student Dashboard**! 🎉

---

## Step 8: Verify Everything Works

### Check the Dashboard

You should see:
- Your name in the header
- "TRAINEE" journey badge
- Current phase: "Year 1 - Quarter 1: Safety First"
- Progress overview (all zeros for a new account)
- Financial status: $0.00 paid, $2,500.00 remaining
- Quick action buttons

### Test Database Connection

1. Open Supabase dashboard → **Table Editor** → **students**
2. You should see your student record:
   - `user_id`: Your user ID
   - `current_year`: 1
   - `current_quarter`: 1
   - `journey_level`: trainee
   - `total_fees_paid`: 0.00

### Test Navigation

1. Try tapping the quick action buttons on the dashboard
2. Most screens are placeholders (showing "Coming Soon" or error)
3. This is expected - you'll build these next!

---

## Step 9: Seed Initial Curriculum Data (Optional)

If you want to populate the curriculum with all 4 years worth of content:

1. Go to Supabase SQL Editor
2. Run the following to insert Year 2-4 curriculum:

```sql
-- Year 2
INSERT INTO curriculum (year, quarter, title, description, learning_outcomes, safety_focus) VALUES
(2, 1, 'Structural Framing', 'Wall framing, floor/ceiling joists, roof systems, shear walls', 
  ARRAY['Frame load-bearing walls', 'Install floor/ceiling joists', 'Build roof systems'], 
  ARRAY['Ladder Safety', 'Fall Protection']),
(2, 2, 'Electrical Basics', 'Wiring rough-in, circuit layout, outlet/switch installation',
  ARRAY['Wire circuits per NEC', 'Install electrical boxes', 'Rough-in circuits'],
  ARRAY['Electrical Safety', 'Arc Flash Awareness']),
(2, 3, 'Plumbing Fundamentals', 'PEX/Copper supply, DWV piping, fixture rough-in',
  ARRAY['Install supply lines', 'Size and install DWV systems', 'Rough-in fixtures'],
  ARRAY['Water Safety', 'Pressure Testing']),
(2, 4, 'Interior Finishes', 'Drywall, texture, finish carpentry, window/door installation',
  ARRAY['Hang and finish drywall', 'Apply texture', 'Install trim and doors'],
  ARRAY['Dust Control', 'VOC Awareness']);

-- Year 3
INSERT INTO curriculum (year, quarter, title, description, learning_outcomes, safety_focus) VALUES
(3, 1, 'Project Flow & Sequencing', 'Scheduling, coordinating trades, material ordering',
  ARRAY['Create project schedules', 'Coordinate subcontractors', 'Manage materials'],
  ARRAY['Site Logistics', 'Delivery Safety']),
(3, 2, 'Independent Structural Execution', 'Advanced framing, deck construction, foundation repairs',
  ARRAY['Build complex roof systems', 'Construct decks', 'Perform foundation work'],
  ARRAY['Advanced Fall Protection', 'Excavation Safety']),
(3, 3, 'Advanced Systems & Code', 'HVAC basics, energy efficiency, CBC overview',
  ARRAY['Understand HVAC systems', 'Apply energy codes', 'Navigate CBC'],
  ARRAY['HVAC Safety', 'Code Compliance']),
(3, 4, 'Troubleshooting & Problem Solving', 'Diagnosing issues, corrective actions, client communication',
  ARRAY['Diagnose construction defects', 'Implement repairs', 'Communicate with clients'],
  ARRAY['Risk Assessment', 'Professional Conduct']);

-- Year 4
INSERT INTO curriculum (year, quarter, title, description, learning_outcomes, safety_focus) VALUES
(4, 1, 'Legal Foundations & Business Organization', 'Business entities, RMO/RME, advertising rules',
  ARRAY['Choose business structure', 'Understand RMO/RME roles', 'Comply with advertising laws'],
  ARRAY['Legal Compliance', 'Ethics']),
(4, 2, 'Contracts, Liens, & Payments', 'B&P § 7159, Preliminary Notice, Mechanics Liens',
  ARRAY['Draft compliant contracts', 'File preliminary notices', 'Protect lien rights'],
  ARRAY['Contract Compliance', 'Payment Protection']),
(4, 3, 'Employment, Safety, & Project Management', 'AB5, Workers Comp, Cal/OSHA, site safety',
  ARRAY['Classify workers correctly', 'Manage Workers Comp', 'Create safety plans'],
  ARRAY['Employer Liability', 'IIPP Management']),
(4, 4, 'Estimating, Finance, & CSLB Exam Prep', 'Estimating, project costing, exam preparation',
  ARRAY['Estimate projects accurately', 'Manage project finances', 'Pass CSLB exams'],
  ARRAY['Financial Risk', 'Business Continuity']);
```

---

## Step 10: Development Workflow

### Making Code Changes

1. Edit files in `src/` directory
2. Save the file
3. The app will **automatically reload** (Fast Refresh)
4. Check the terminal for any errors

### Common Commands

```bash
# Start development server
npm start

# Clear cache and restart
npm start -- --clear

# Run TypeScript type checking
npx tsc --noEmit

# Format code (if you have Prettier configured)
npx prettier --write .
```

### Debugging

1. Press `j` in the terminal to open the debugger
2. Or shake your device and tap "Debug"
3. Chrome DevTools will open
4. Use `console.log()` statements in your code

---

## Troubleshooting

### Issue: "Supabase client error"
**Solution**: Check that your `.env` file has the correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Issue: "Network request failed"
**Solution**: 
1. Make sure your device/simulator and computer are on the same WiFi network
2. Restart the Expo server (`Ctrl+C`, then `npm start`)
3. Try running on web (`npm run web`) to isolate the issue

### Issue: "Unable to resolve module"
**Solution**:
```bash
# Clear cache
npm start -- --clear

# If that doesn't work, delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: iOS build fails
**Solution**:
```bash
# Clear iOS build cache
rm -rf ios/Pods
cd ios && pod install && cd ..
npm run ios
```

### Issue: Android build fails
**Solution**:
```bash
# Clear Android build cache
cd android
./gradlew clean
cd ..
npm run android
```

---

## Next Steps

Now that your app is running, you can:

1. **Build the Work Log Submission Screen**
   - Create `src/screens/student/WorkLogSubmissionScreen.tsx`
   - Implement photo upload functionality
   - Add form validation

2. **Build the 4-Year Roadmap Screen**
   - Create `src/screens/student/StudentJourneyScreen.tsx`
   - Visualize the full 4-year curriculum
   - Show progress indicators

3. **Build the Instructor Portal**
   - Create instructor screens
   - Implement log review workflow
   - Add milestone assessment forms

4. **Test with Real Data**
   - Create multiple student accounts
   - Submit work logs
   - Test the approval workflow

---

## Production Deployment (When Ready)

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure the project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Submit to App Stores

```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

---

## Support

If you encounter issues:

1. Check the error message in the terminal
2. Review the `README.md` for additional documentation
3. Check the Expo documentation: [https://docs.expo.dev](https://docs.expo.dev)
4. Check the Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)

---

**Congratulations! Your Wisdom Works Academy app is now running. Time to build the future of trade education. 🛠️**


