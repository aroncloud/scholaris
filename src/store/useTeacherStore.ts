/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { showToast } from "@/components/ui/showToast";
import { getTeachers } from "@/actions/teacherActions";
import { Teacher } from "@/types/teacherTypes";

interface TeacherStoreState {
  teacherList: Teacher[];
  loading: boolean;
  error: string | null;

  setTeacher: (users: Teacher[]) => void;
  resetTeacher: () => void;

  fetchTeacher: () => Promise<void>;
  refreshTeacher: () => Promise<void>;
}

export const useTeacherStore = create<TeacherStoreState>()(
  persist(
    (set, get) => ({
      teacherList: [],
      loading: false,
      error: null,

      setTeacher: (users) => set({ teacherList: users }),
      resetTeacher: () => set({ teacherList: [] }),

      fetchTeacher: async () => {
        set({ loading: true, error: null });
        try {
          const result = await getTeachers();
          if (result.code === "success") {
            set({ teacherList: result.data.body as Teacher[], loading: false });
          } else {
            showToast({
              variant: "error-solid",
              message: "Erreur lors de la récupération de l'enseignant",
              description: result.code,
              position: "top-center",
            });
            set({ error: result.code, loading: false });
          }
        } catch (err: any) {
          set({ error: err.message || "Erreur inconnue", loading: false });
        }
      },

      refreshTeacher: async () => {
        await get().fetchTeacher();
      },
    }),
    {
      name: "teacher-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
