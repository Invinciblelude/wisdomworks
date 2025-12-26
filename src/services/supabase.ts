import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not found. Please check your environment variables.');
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database table names
export const TABLES = {
  USERS: 'users',
  STUDENTS: 'students',
  INSTRUCTORS: 'instructors',
  WORK_LOGS: 'work_experience_logs',
  MILESTONES: 'milestone_reviews',
  CURRICULUM: 'curriculum',
  SAFETY_CERTS: 'safety_certifications',
  PROJECTS: 'projects',
  DOCUMENTS: 'documents',
  INCIDENTS: 'safety_incidents',
  TRANSACTIONS: 'financial_transactions',
} as const;

// Storage buckets
export const STORAGE_BUCKETS = {
  WORK_LOG_PHOTOS: 'work-log-photos',
  CERTIFICATES: 'certificates',
  DOCUMENTS: 'documents',
  CONTRACTS: 'contracts',
  PROJECT_PHOTOS: 'project-photos',
} as const;

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}


