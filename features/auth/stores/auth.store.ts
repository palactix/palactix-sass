import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  pendingEmail?: string;
  setPendingEmail: (email?: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (v) => set({ isAuthenticated: v }),
  pendingEmail: undefined,
  setPendingEmail: (email) => set({ pendingEmail: email }),
}));