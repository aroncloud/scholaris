import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IListStudent } from '@/types/staffType';

interface StudentState {
  studentStatuses: Record<string, string>;
  updateStudentStatus: (studentId: string, status: string) => void;
  updateStudentStatuses: (statuses: Record<string, string>) => void;
  getStudentStatus: (studentId: string) => string | undefined;
  initializeStudents: (students: IListStudent[]) => Record<string, string>;
  clearStatuses: () => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      studentStatuses: {},

      updateStudentStatus: (studentId, status) => {
        set((state) => ({
          studentStatuses: { ...state.studentStatuses, [studentId]: status },
        }));
        console.log(`[StudentStore] Status updated for ${studentId}:`, status);
      },

      getStudentStatus: (studentId) => get().studentStatuses[studentId],

      updateStudentStatuses: (statuses) => {
        set((state) => ({
          studentStatuses: { ...state.studentStatuses, ...statuses }
        }));
      },
      
      initializeStudents: (students: IListStudent[]) => {
        const statuses: Record<string, string> = {};
        students.forEach(student => {
          // Use the status from student data if available, otherwise default to 'PENDING'
          statuses[student.user_code] = student.status_code || 'PENDING';
        });
        
        // Only update the store if there are statuses to set
        if (Object.keys(statuses).length > 0) {
          set(state => ({
            studentStatuses: { ...state.studentStatuses, ...statuses }
          }));
        }
        
        return statuses;
      },

      clearStatuses: () => set({ studentStatuses: {} }),
    }),
    {
      name: 'student-status-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
