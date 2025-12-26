import { create } from 'zustand';
import { User, UserRole, Student } from '../types';

// Demo mode authentication store (bypasses Supabase for preview)
interface DemoAuthState {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  
  // Actions
  demoLogin: (role?: UserRole) => void;
  signOut: () => void;
}

export const useDemoAuthStore = create<DemoAuthState>((set) => ({
  user: null,
  userRole: null,
  isLoading: false,
  isAuthenticated: false,
  isDemoMode: true,

  demoLogin: (role: UserRole = 'student') => {
    const demoUser: User = {
      id: 'demo-user-id',
      email: 'demo@wisdomworks.com',
      full_name: 'Demo Student',
      role: role,
      phone: '(555) 123-4567',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set({
      user: demoUser,
      userRole: role,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  signOut: () => {
    set({
      user: null,
      userRole: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

// Demo student data
export const DEMO_STUDENT: Student = {
  id: 'demo-student-id',
  user_id: 'demo-user-id',
  enrollment_date: '2025-01-01',
  current_year: 1,
  current_quarter: 1,
  journey_level: 'trainee',
  total_fees_paid: 500,
  total_hours_logged: 120,
  cslb_eligible: false,
};

