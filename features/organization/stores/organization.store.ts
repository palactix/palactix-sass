import { create } from "zustand";
import type { Organization } from "../types/organization.types";

interface OrganizationState {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  clearOrganization: () => void;
}

/**
 * Organization store - NO localStorage persistence needed
 * The organization is set from URL params in [org]/layout.tsx
 * URL is the single source of truth for current organization
 */
export const useOrganizationStore = create<OrganizationState>()((set) => ({
  currentOrganization: null,
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  clearOrganization: () => set({ currentOrganization: null }),
}));

/**
 * Hook to get current organization ID
 * Returns null if no organization is selected
 */
export function useCurrentOrgId(): number | null {
  return useOrganizationStore((state) => state.currentOrganization?.id ?? null);
}

/**
 * Hook to get current organization slug
 * Returns null if no organization is selected
 */
export function useCurrentOrgSlug(): string | null {
  return useOrganizationStore((state) => state.currentOrganization?.slug ?? null);
}
