/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { showToast } from "@/components/ui/showToast";
import { IGetAcademicYears, ICreateAcademicYear } from "@/types/planificationType";
import { getAcademicYear } from "@/actions/planificationAction";

interface AcademicYearStoreState {
  academicYears: IGetAcademicYears[];
  loading: boolean;
  error: string | null;
  selectedAcademicYear: string | null;
  isChangingYear: boolean;
  newYearLabel: string;

  setAcademicYears: (data: IGetAcademicYears[]) => void;
  addAcademicYear: (data: IGetAcademicYears) => void;
  getCurrentAcademicYear: () => IGetAcademicYears | null;
  updateAcademicYear: (year_code: string, academicYear: Partial<ICreateAcademicYear>) => void;
  resetAcademicYears: () => void;

  fetchAcademicYears: () => Promise<void>;
  refreshAcademicYears: () => Promise<void>;

  setSelectedAcademicYear: (yearCode: string) => void;
  clearSelectedAcademicYear: () => void;
  setIsChangingYear: (isChanging: boolean, yearLabel?: string) => void;
}

export const useAcademicYearStore = create<AcademicYearStoreState>()(
  persist(
    (set, get) => ({
      academicYears: [],
      loading: false,
      error: null,
      selectedAcademicYear: null,
      isChangingYear: false,
      newYearLabel: "",

      setAcademicYears: (data) => set({ academicYears: data }),
      addAcademicYear: (data) =>
        set((state) => ({ academicYears: [...state.academicYears, data] })),
      updateAcademicYear: (year_code, academicYear) =>
        set((state) => ({
          academicYears: state.academicYears.map((ay) =>
            ay.year_code === year_code ? { ...ay, ...academicYear } : ay
          ),
        })),
      resetAcademicYears: () => set({ academicYears: [] }),

      fetchAcademicYears: async () => {
        set({ loading: true, error: null });
        try {
          const result = await getAcademicYear();
          if (result.code === "success") {
            set({
              academicYears: result.data.body as IGetAcademicYears[],
              loading: false,
            });
          } else {
            showToast({
              variant: "error-solid",
              message: "Erreur lors de la récupération des années académiques",
              description: result.code,
              position: "top-center",
            });
            set({ error: result.code, loading: false });
          }
        } catch (err: any) {
          set({ error: err.message || "Erreur inconnue", loading: false });
        }
      },

      getCurrentAcademicYear: () => {
        const { academicYears } = get();
        return academicYears.find((ay) => ay.status_code === "IN_PROGRESS") || null;
      },
      refreshAcademicYears: async () => {
        await get().fetchAcademicYears();
      },

      // ✅ new methods
      setSelectedAcademicYear: (yearCode) => {
        set({ selectedAcademicYear: yearCode });
        console.log(`[AcademicYearStore] Selected year set: ${yearCode}`);
      },
      clearSelectedAcademicYear: () => {
        set({ selectedAcademicYear: null });
        console.log("[AcademicYearStore] Cleared selected year");
      },
      setIsChangingYear: (isChanging, yearLabel = "") => {
        set({ isChangingYear: isChanging, newYearLabel: yearLabel });
        console.log(`[AcademicYearStore] Changing year state: ${isChanging}, label: ${yearLabel}`);
      },
    }),
    {
      name: "academic-years-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);




// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { showToast } from "@/components/ui/showToast";
// import { IGetAcademicYears, ICreateAcademicYear } from "@/types/planificationType";
// import { getAcademicYear } from "@/actions/planificationAction";

// interface AcademicYearStoreState {
//   academicYears: IGetAcademicYears[];
//   loading: boolean;
//   error: string | null;

//   setAcademicYears: (data: IGetAcademicYears[]) => void;
//   addAcademicYear: (data: IGetAcademicYears) => void;
//   getCurrentAcademicYear: () => IGetAcademicYears | null;
//   updateAcademicYear: (year_code: string, academicYear: Partial<ICreateAcademicYear>) => void;
//   resetAcademicYears: () => void;

//   fetchAcademicYears: () => Promise<void>;
//   refreshAcademicYears: () => Promise<void>;
// }

// export const useAcademicYearStore = create<AcademicYearStoreState>()(
//     persist(
//         (set, get) => ({
//         academicYears: [],
//         loading: false,
//         error: null,

//         setAcademicYears: (data) => set({ academicYears: data }),
//         addAcademicYear: (data) =>
//             set((state) => ({ academicYears: [...state.academicYears, data] })),
//         updateAcademicYear: (year_code, academicYear) =>
//             set((state) => ({
//             academicYears: state.academicYears.map((ay) =>
//                 ay.year_code === year_code ? { ...ay, ...academicYear } : ay
//             ),
//             })),
//         resetAcademicYears: () => set({ academicYears: [] }),

//         fetchAcademicYears: async () => {
//             set({ loading: true, error: null });
//             try {
//                 const result = await getAcademicYear();
//                 if (result.code === "success") {
//                     set({ academicYears: result.data.body as IGetAcademicYears[], loading: false });
//                 } else {
//                     showToast({
//                     variant: "error-solid",
//                     message: "Erreur lors de la récupération des années académiques",
//                     description: result.code,
//                     position: "top-center",
//                     });
//                     set({ error: result.code, loading: false });
//                 }
//             } catch (err: any) {
//                 set({ error: err.message || "Erreur inconnue", loading: false });
//             }
//         },

//         getCurrentAcademicYear: () => {
//             const { academicYears } = get();
//             return academicYears.find(ay => ay.status_code === "IN_PROGRESS") || null;
//         },
//         refreshAcademicYears: async () => {
//             await get().fetchAcademicYears();
//         },
//         }),
//         {
//         name: "academic-years-storage",
//         storage: createJSONStorage(() => localStorage),
//         }
//     )
// );
