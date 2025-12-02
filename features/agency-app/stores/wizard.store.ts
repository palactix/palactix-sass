import { create } from "zustand";

interface WizardState {
  appId: string | null;
  currentStep: number;
  isLive: number | null;

  setAppId: (id: string | null) => void;
  setStep: (step: number) => void;
  setIsLive: (isLive: number | null) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  appId: null,
  currentStep: 1,
  isLive: null,

  setAppId: (id) => set({ appId: id }),
  setStep: (step) => set({ currentStep: step }),
  setIsLive: (isLive) => set({ isLive }),
  reset: () => set({ appId: null, currentStep: 1, isLive: null }),
}));
