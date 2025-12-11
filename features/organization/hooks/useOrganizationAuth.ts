import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOrganizationStore } from '@/features/organization/stores/organization.store';
import { usePermissionStore } from '@/features/organization/stores/permission.store';
import { getOrganizationPermissions } from '@/features/organization/api/permissions.api';
import { Permission } from '@/utils/constants/permissions';
import { Features, Limits } from '@/features/organization/types/permissions.types';

// Stable empty array reference to prevent infinite loops in selectors
const EMPTY_PERMISSIONS: Permission[] = [];

/**
 * Main hook to initialize and manage organization permissions.
 * Call this in your org layout to fetch and sync permissions.
 */
export function useOrganizationAuth() {
  const currentOrg = useOrganizationStore((state) => state.currentOrganization);
  const { setPermissions, setLoading, setError } = usePermissionStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['organization-permissions', currentOrg?.slug],
    queryFn: () => {
      if (!currentOrg?.slug) throw new Error('No organization selected');
      return getOrganizationPermissions(currentOrg.slug);
    },
    enabled: !!currentOrg?.slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync with store
  useEffect(() => {
    setLoading(isLoading);
    if (data) setPermissions(data);
    if (error) setError(error as Error);
  }, [data, isLoading, error, setPermissions, setLoading, setError]);

  /**
   * Invalidate and refetch permissions.
   * Call this after role changes, plan upgrades, etc.
   */
  const invalidatePermissions = () => {
    queryClient.invalidateQueries({
      queryKey: ['organization-permissions', currentOrg?.slug]
    });
  };

  return {
    isLoading,
    error,
    data,
    refetch,
    invalidatePermissions,
  };
}

/**
 * Check if user has a specific permission.
 * @param permission - The permission to check
 * @returns boolean indicating if user has the permission
 */
export function usePermission(permission: Permission) {
  const permissions = usePermissionStore((state) => state.data?.permissions ?? EMPTY_PERMISSIONS);
  return permissions.includes(permission);
}

/**
 * Check if user has multiple permissions.
 * @param permissions - Array of permissions to check
 * @param mode - 'all' requires all permissions, 'any' requires at least one
 * @returns boolean based on the mode
 */
export function usePermissions(
  permissions: Permission[],
  mode: 'all' | 'any' = 'all'
): boolean {
  const userPermissions = usePermissionStore((state) => state.data?.permissions ?? EMPTY_PERMISSIONS);

  if (permissions.length === 0) return true;

  if (mode === 'all') {
    return permissions.every(p => userPermissions.includes(p));
  }
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * Get the loading state of permissions.
 * Useful for showing loading states in guards.
 */
export function usePermissionLoading() {
  return usePermissionStore((state) => state.isLoading);
}

/**
 * Get resource limit information.
 * @param resource - The resource to get limits for
 * @returns Limit object with max, current, remaining, and reached
 */
export function useLimit(resource: keyof Limits) {
  const limits = usePermissionStore((state) => state.data?.limits);
  return limits?.[resource] || {
    max: 0,
    current: 0,
    remaining: 0,
    reached: true
  };
}

/**
 * Check if a specific feature is enabled.
 * @param feature - The feature to check
 * @returns boolean indicating if feature is enabled
 */
export function useFeature(feature: keyof Features) {
  const features = usePermissionStore((state) => state.data?.features);
  return features?.[feature] || false;
}

/**
 * Get the current plan information.
 * @returns Plan object or undefined
 */
export function usePlan() {
  return usePermissionStore((state) => state.data?.plan);
}

/**
 * Get detailed plan status with helper booleans.
 * @returns Object with computed plan status properties
 */
export function usePlanStatus() {
  const plan = usePlan();

  return {
    /** Raw plan data */
    plan,
    /** Whether user is currently on a trial */
    isOnTrial: plan?.on_trial ?? false,
    /** Whether plan status is 'trialing' */
    isTrialing: plan?.status === 'trialing',
    /** Whether plan status is 'active' */
    isActive: plan?.status === 'active',
    /** Whether plan status is 'canceled' */
    isCanceled: plan?.status === 'canceled',
    /** Whether plan status is 'past_due' */
    isPastDue: plan?.status === 'past_due',
    /** Trial end date as Date object */
    trialEndsAt: plan?.trial_ends_at ? new Date(plan.trial_ends_at) : null,
    /** Whether app creation is required */
    requiresAppCreation: plan?.requires_app_creation ?? false,
    /** Days remaining until app creation deadline */
    daysUntilAppDeadline: plan?.days_until_app_deadline ?? null,
    /** App creation deadline as Date object */
    appCreationDeadline: plan?.app_creation_deadline
      ? new Date(plan.app_creation_deadline)
      : null,
    /** Whether user has created a developer app */
    hasDeveloperApp: plan?.has_developer_app ?? false,
  };
}

/**
 * Get the current user's role in the organization.
 * @returns Role object or undefined
 */
export function useRole() {
  return usePermissionStore((state) => state.data?.role);
}
