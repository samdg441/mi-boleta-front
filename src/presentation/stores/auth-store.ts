import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/domain/entities/user";

export interface AuthSlice {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    { name: "mi-boleta-auth" },
  ),
);
