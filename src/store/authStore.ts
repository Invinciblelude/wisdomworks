import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setUserRole: (role: UserRole | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userRole: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),

  setUserRole: (role) => set({ userRole: role }),

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: userData as User,
          userRole: userData.role as UserRole,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, fullName: string, role: UserRole) => {
    set({ isLoading: true });
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // 2. Create user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
        })
        .select()
        .single();

      if (userError) throw userError;

      // 3. If student role, create student record
      if (role === 'student') {
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            enrollment_date: new Date().toISOString(),
            current_year: 1,
            current_quarter: 1,
            journey_level: 'trainee',
            total_fees_paid: 0,
            total_hours_logged: 0,
            cslb_eligible: false,
          });

        if (studentError) throw studentError;
      }

      set({
        user: userData as User,
        userRole: role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        userRole: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        set({
          user: userData as User,
          userRole: userData.role as UserRole,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          userRole: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        userRole: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));


