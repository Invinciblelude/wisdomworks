import { create } from 'zustand';
import { supabase, TABLES } from '../services/supabase';
import { Student, WorkExperienceLog, StudentProgress, SafetyCertification } from '../types';

interface StudentState {
  currentStudent: Student | null;
  workLogs: WorkExperienceLog[];
  safetyCertifications: SafetyCertification[];
  progress: StudentProgress | null;
  isLoading: boolean;

  // Actions
  fetchStudentProfile: (userId: string) => Promise<void>;
  fetchWorkLogs: (studentId: string) => Promise<void>;
  fetchSafetyCertifications: (studentId: string) => Promise<void>;
  calculateProgress: (studentId: string) => Promise<void>;
  submitWorkLog: (log: Partial<WorkExperienceLog>) => Promise<void>;
  updateWorkLog: (logId: string, updates: Partial<WorkExperienceLog>) => Promise<void>;
  deleteWorkLog: (logId: string) => Promise<void>;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  currentStudent: null,
  workLogs: [],
  safetyCertifications: [],
  progress: null,
  isLoading: false,

  fetchStudentProfile: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from(TABLES.STUDENTS)
        .select(`
          *,
          user:users(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      set({ currentStudent: data as Student, isLoading: false });
    } catch (error) {
      console.error('Error fetching student profile:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchWorkLogs: async (studentId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from(TABLES.WORK_LOGS)
        .select('*')
        .eq('student_id', studentId)
        .order('date_start', { ascending: false });

      if (error) throw error;

      set({ workLogs: data as WorkExperienceLog[], isLoading: false });
    } catch (error) {
      console.error('Error fetching work logs:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchSafetyCertifications: async (studentId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from(TABLES.SAFETY_CERTS)
        .select('*')
        .eq('student_id', studentId)
        .order('issue_date', { ascending: false });

      if (error) throw error;

      set({ 
        safetyCertifications: data as SafetyCertification[], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching safety certifications:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  calculateProgress: async (studentId: string) => {
    try {
      const { currentStudent, workLogs } = get();
      
      if (!currentStudent) {
        await get().fetchStudentProfile(studentId);
      }

      if (workLogs.length === 0) {
        await get().fetchWorkLogs(studentId);
      }

      const student = get().currentStudent;
      const logs = get().workLogs;

      if (!student) return;

      // Calculate hours by trade
      const hoursByTrade: Record<string, number> = {};
      logs.forEach(log => {
        if (log.status === 'approved' && log.duties_performed) {
          Object.entries(log.duties_performed).forEach(([trade, detail]) => {
            if (detail && detail.hours) {
              hoursByTrade[trade] = (hoursByTrade[trade] || 0) + detail.hours;
            }
          });
        }
      });

      // Calculate completion percentage based on current year
      const yearProgress = ((student.current_quarter - 1) / 4) * 100;
      const totalProgress = ((student.current_year - 1) / 4 * 100) + (yearProgress / 4);

      // Define milestones (4 per year = 16 total)
      const totalMilestones = 16;
      const completedMilestones = (student.current_year - 1) * 4 + (student.current_quarter);

      // Define required certifications based on year
      const requiredCertifications = student.current_year >= 1 ? 5 : 3;
      const certifications = get().safetyCertifications;

      const progress: StudentProgress = {
        current_phase: `Year ${student.current_year} - Quarter ${student.current_quarter}`,
        completion_percentage: Math.round(totalProgress),
        total_hours: student.total_hours_logged,
        hours_by_trade: hoursByTrade,
        certifications_earned: certifications.length,
        certifications_required: requiredCertifications,
        milestones_completed: completedMilestones,
        milestones_total: totalMilestones,
        financial_status: {
          paid: student.total_fees_paid,
          remaining: 2500 - student.total_fees_paid,
          percentage: Math.round((student.total_fees_paid / 2500) * 100),
        },
      };

      set({ progress });
    } catch (error) {
      console.error('Error calculating progress:', error);
      throw error;
    }
  },

  submitWorkLog: async (log: Partial<WorkExperienceLog>) => {
    try {
      const { currentStudent } = get();
      if (!currentStudent) throw new Error('No student profile loaded');

      const { data, error } = await supabase
        .from(TABLES.WORK_LOGS)
        .insert({
          ...log,
          student_id: currentStudent.id,
          status: 'submitted',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh work logs
      await get().fetchWorkLogs(currentStudent.id);

      return data;
    } catch (error) {
      console.error('Error submitting work log:', error);
      throw error;
    }
  },

  updateWorkLog: async (logId: string, updates: Partial<WorkExperienceLog>) => {
    try {
      const { error } = await supabase
        .from(TABLES.WORK_LOGS)
        .update(updates)
        .eq('id', logId);

      if (error) throw error;

      // Update local state
      set(state => ({
        workLogs: state.workLogs.map(log =>
          log.id === logId ? { ...log, ...updates } : log
        ),
      }));
    } catch (error) {
      console.error('Error updating work log:', error);
      throw error;
    }
  },

  deleteWorkLog: async (logId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.WORK_LOGS)
        .delete()
        .eq('id', logId);

      if (error) throw error;

      // Update local state
      set(state => ({
        workLogs: state.workLogs.filter(log => log.id !== logId),
      }));
    } catch (error) {
      console.error('Error deleting work log:', error);
      throw error;
    }
  },
}));


