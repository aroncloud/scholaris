// src/store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SessionPayload } from "@/types/authTypes";
import { IUserDetailedInfo } from "@/types/userType";

interface UserState {
  user: SessionPayload | null;
  userDetailled: IUserDetailedInfo | null;
  isHydrated: boolean;
  setUser: (user: SessionPayload) => void;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      userDetailled: null,
      isHydrated: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: "user-storage",
    }
  )
);