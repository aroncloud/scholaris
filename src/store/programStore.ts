/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ICreateProgram, ICurriculumDetail, IFactorizedProgram, IGetUECurriculum } from '@/types/programTypes';
import { getCurriculumList } from '@/actions/programsAction';
import { showToast } from '@/components/ui/showToast';

interface ProgramStoreState {
  factorizedPrograms: IFactorizedProgram[];
  loading: boolean;
  error: string | null;

  setPrograms: (data: IFactorizedProgram[]) => void;
  updateProgram: (program_code: string, program: Partial<ICreateProgram>) => void;
  updateCurriculums: (program_code: string, curriculums: ICurriculumDetail[]) => void;
  resetPrograms: () => void;

  fetchPrograms: () => Promise<void>;
  refreshPrograms: () => Promise<void>;
}

// Store Zustand avec persistance
export const useFactorizedProgramStore = create<ProgramStoreState>()(
  persist(
    (set, get) => ({
      factorizedPrograms: [],
      // initialisation correcte pour un Record
      UEPerCurriculumList: {} as Record<string, IGetUECurriculum[]>,
      loading: false,
      error: null,

      setPrograms: (data) => set({ factorizedPrograms: data }),
      updateProgram: (program_code, program) =>
        set((state) => ({
          factorizedPrograms: state.factorizedPrograms.map((p) =>
            p.program.program_code === program_code
              ? { ...p, program: { ...p.program, ...program } }
              : p
          ),
        })),
      updateCurriculums: (program_code, curriculums) =>
        set((state) => ({
          factorizedPrograms: state.factorizedPrograms.map((p) =>
            p.program.program_code === program_code
              ? { ...p, curriculums }
              : p
          ),
        })),
      resetPrograms: () => set({ factorizedPrograms: [] }),

      // Async fetch
      fetchPrograms: async () => {
        set({ loading: true, error: null });
        try {
          const result = await getCurriculumList();
          if (result.code === "success") {
            const grouped: { [key: string]: IFactorizedProgram } = {};
            result.data.body.forEach((item: ICurriculumDetail) => {
              const { program, training_sequences, ...curriculumInfo } = item;

              if (!grouped[item.program_code]) {
                grouped[item.program_code] = {
                  program,
                  curriculums: [],
                };
              }

              grouped[item.program_code].curriculums.push({
                ...curriculumInfo,
                program,
                training_sequences,
              });
            });
            console.log("-->factorizedPrograms.grouped", grouped);
            set({
              factorizedPrograms: Object.values(grouped),
              loading: false,
            });


          } else {
            showToast({
              variant: "error-solid",
              message: "Erreur lors de la récupération des programmes",
              description: result.code,
              position: "top-center",
            });
            set({ error: result.code, loading: false });
          }
        } catch (err: any) {
          set({ error: err.message || "Erreur inconnue", loading: false });
        }
      },

      refreshPrograms: async () => {
        await get().fetchPrograms();
      },
    }),
    {
      name: "factorized-programs-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
