/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { showToast } from "@/components/ui/showToast";
import { ICreateClassroom, IGetClassroom } from "@/types/classroomType";
import { getClassroomList } from "@/actions/classroomAction";

interface ClassroomStoreState {
  classrooms: IGetClassroom[];
  loading: boolean;
  error: string | null;

  setClassrooms: (data: IGetClassroom[]) => void;
  addClassroom: (data: IGetClassroom) => void;
  updateClassroom: (resource_code: string, classroom: Partial<ICreateClassroom>) => void;
  resetClassrooms: () => void;

  fetchClassrooms: () => Promise<void>;
  refreshClassrooms: () => Promise<void>;
}

export const useClassroomStore = create<ClassroomStoreState>()(
  persist(
    (set, get) => ({
      classrooms: [],
      loading: false,
      error: null,

      setClassrooms: (data) => set({ classrooms: data }),
      addClassroom: (data) =>
        set((state) => ({ classrooms: [...state.classrooms, data] })),
      updateClassroom: (resource_code, classroom) =>
        set((state) => ({
          classrooms: state.classrooms.map((c) =>
            c.resource_code === resource_code ? { ...c, ...classroom } : c
          ),
        })),
      resetClassrooms: () => set({ classrooms: [] }),

      fetchClassrooms: async () => {
        set({ loading: true, error: null });
        try {
          const result = await getClassroomList();
          if (result.code === "success") {
            set({ classrooms: result.data.body as IGetClassroom[], loading: false });
          } else {
            showToast({
              variant: "error-solid",
              message: "Store.Erreur lors de la récupération des salles",
              description: result.code,
              position: "top-center",
            });
            set({ error: result.code, loading: false });
          }
        } catch (err: any) {
          set({ error: err.message || "Erreur inconnue", loading: false });
        }
      },

      refreshClassrooms: async () => {
        await get().fetchClassrooms();
      },
    }),
    {
      name: "classrooms-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);