import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/domain/entities/user";
import { mergeUserRoleFromToken } from "@/presentation/lib/auth-routes";

export interface AuthSlice {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  clearSession: () => void;
  /** Sincroniza role desde el JWT tras hidratar localStorage. */
  syncUserFromToken: () => void;
}

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSession: (token, user) =>
        set({ token, user: mergeUserRoleFromToken(user, token) }),
      clearSession: () => set({ token: null, user: null }),
      syncUserFromToken: () => {
        const { token, user } = get();
        if (!token || !user) return;
        const merged = mergeUserRoleFromToken(user, token);
        if (merged.role !== user.role) set({ user: merged });
      },
    }),
    { name: "mi-boleta-auth" },
  ),
);
