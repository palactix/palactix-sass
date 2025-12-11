import { create } from 'zustand';
import { OrganizationPermissions, Features, Limits } from '../types/permissions.types';
import { Permission } from '@/utils/constants/permissions';

interface PermissionStore {
  data: OrganizationPermissions | null;
  isLoading: boolean;
  error: Error | null;
  setPermissions: (data: OrganizationPermissions) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  setPermissions: (data) => set({ data, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ data: null, isLoading: false, error: null }),
}));

// =============================================================================
// IMPERATIVE UTILITIES
// Use these outside React components (event handlers, utility functions, etc.)
// =============================================================================

/**
 * Check if user has a specific permission (imperative).
 * Use this in event handlers, utility functions, or anywhere outside React hooks.
 * 
 * @example
 * ```ts
 * import { can } from '@/features/organization/stores/permission.store';
 * import { PERMISSIONS } from '@/utils/constants/permissions';
 * 
 * const handleDelete = () => {
 *   if (!can(PERMISSIONS.STAFF.DELETE)) {
 *     toast.error('You do not have permission to delete staff');
 *     return;
 *   }
 *   // proceed with deletion
 * };
 * ```
 */
export function can(permission: Permission): boolean {
  return usePermissionStore.getState().data?.permissions.includes(permission) ?? false;
}

/**
 * Check if user has all of the specified permissions (imperative).
 * 
 * @example
 * ```ts
 * if (canAll([PERMISSIONS.STAFF.VIEW, PERMISSIONS.STAFF.UPDATE])) {
 *   // user can view and update staff
 * }
 * ```
 */
export function canAll(permissions: Permission[]): boolean {
  const userPermissions = usePermissionStore.getState().data?.permissions || [];
  return permissions.every(p => userPermissions.includes(p));
}

/**
 * Check if user has any of the specified permissions (imperative).
 * 
 * @example
 * ```ts
 * if (canAny([PERMISSIONS.STAFF.DELETE, PERMISSIONS.CLIENTS.DELETE])) {
 *   // user can delete either staff or clients
 * }
 * ```
 */
export function canAny(permissions: Permission[]): boolean {
  const userPermissions = usePermissionStore.getState().data?.permissions || [];
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * Check if a feature is enabled (imperative).
 * 
 * @example
 * ```ts
 * if (hasFeature('bulk_scheduling')) {
 *   // show bulk scheduling options
 * }
 * ```
 */
export function hasFeature(feature: keyof Features): boolean {
  return usePermissionStore.getState().data?.features[feature] ?? false;
}

/**
 * Get limit status for a resource (imperative).
 * 
 * @example
 * ```ts
 * const staffLimit = getLimitStatus('staff');
 * if (staffLimit.reached) {
 *   toast.error(`Staff limit reached (${staffLimit.current}/${staffLimit.max})`);
 * }
 * ```
 */
export function getLimitStatus(resource: keyof Limits) {
  return usePermissionStore.getState().data?.limits[resource] ?? {
    max: 0,
    current: 0,
    remaining: 0,
    reached: true
  };
}

/**
 * Check if a resource can be used (limit not reached) - imperative.
 * 
 * @example
 * ```ts
 * if (!canUseResource('channels')) {
 *   toast.error('Channel limit reached');
 *   return;
 * }
 * ```
 */
export function canUseResource(resource: keyof Limits): boolean {
  const limit = getLimitStatus(resource);
  return !limit.reached;
}

/**
 * Get the current role (imperative).
 */
export function getRole() {
  return usePermissionStore.getState().data?.role;
}

/**
 * Get the current plan (imperative).
 */
export function getPlan() {
  return usePermissionStore.getState().data?.plan;
}

/**
 * Check if permissions are still loading (imperative).
 */
export function isPermissionsLoading(): boolean {
  return usePermissionStore.getState().isLoading;
}
