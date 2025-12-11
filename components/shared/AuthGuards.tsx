import { ReactNode } from 'react';
import { 
  usePermission, 
  usePermissions,
  useLimit, 
  useFeature,
  usePermissionLoading 
} from '@/features/organization/hooks/useOrganizationAuth';
import { Permission } from '@/utils/constants/permissions';
import { Limits, Features } from '@/features/organization/types/permissions.types';

// =============================================================================
// PERMISSION GUARD
// =============================================================================

interface PermissionGuardProps {
  /** Single permission to check */
  permission?: Permission;
  /** Multiple permissions to check (use with mode) */
  permissions?: Permission[];
  /** 'all' = require all permissions, 'any' = require at least one */
  mode?: 'all' | 'any';
  /** Content to show when permission is granted */
  children: ReactNode;
  /** Content to show when permission is denied (default: null) */
  fallback?: ReactNode;
  /** Content to show while permissions are loading (default: null) */
  loading?: ReactNode;
  /** If true, show children while loading (default: false) */
  showWhileLoading?: boolean;
}

/**
 * Guard component that conditionally renders children based on permissions.
 * 
 * @example Single permission
 * ```tsx
 * <PermissionGuard permission={PERMISSIONS.STAFF.DELETE}>
 *   <DeleteButton />
 * </PermissionGuard>
 * ```
 * 
 * @example Multiple permissions (all required)
 * ```tsx
 * <PermissionGuard 
 *   permissions={[PERMISSIONS.STAFF.VIEW, PERMISSIONS.STAFF.UPDATE]} 
 *   mode="all"
 * >
 *   <StaffEditor />
 * </PermissionGuard>
 * ```
 * 
 * @example Multiple permissions (any required)
 * ```tsx
 * <PermissionGuard 
 *   permissions={[PERMISSIONS.STAFF.DELETE, PERMISSIONS.CLIENTS.DELETE]} 
 *   mode="any"
 *   fallback={<span>No delete access</span>}
 * >
 *   <DeleteButton />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({ 
  permission, 
  permissions,
  mode = 'all',
  children, 
  fallback = null,
  loading = null,
  showWhileLoading = false
}: PermissionGuardProps) {
  const isLoading = usePermissionLoading();
  
  // Single permission check
  const hasSinglePermission = usePermission(permission!);
  // Multiple permissions check
  const hasMultiplePermissions = usePermissions(permissions || [], mode);
  
  // Handle loading state
  if (isLoading && !showWhileLoading) {
    return <>{loading}</>;
  }
  
  // Determine which check to use
  let hasAccess: boolean;
  if (permissions && permissions.length > 0) {
    hasAccess = hasMultiplePermissions;
  } else if (permission) {
    hasAccess = hasSinglePermission;
  } else {
    // No permission specified, allow access
    hasAccess = true;
  }

  if (!hasAccess) return <>{fallback}</>;
  return <>{children}</>;
}

// =============================================================================
// LIMIT GUARD
// =============================================================================

interface LimitGuardProps {
  /** Resource to check limit for */
  resource: keyof Limits;
  /** Content to show when limit is not reached */
  children: ReactNode;
  /** Content to show when limit is reached (default: null) */
  fallback?: ReactNode;
  /** Content to show while loading (default: null) */
  loading?: ReactNode;
}

/**
 * Guard component that conditionally renders children based on resource limits.
 * 
 * @example
 * ```tsx
 * <LimitGuard 
 *   resource="staff" 
 *   fallback={<UpgradePrompt message="Staff limit reached" />}
 * >
 *   <InviteStaffButton />
 * </LimitGuard>
 * ```
 */
export function LimitGuard({ 
  resource, 
  children, 
  fallback = null,
  loading = null 
}: LimitGuardProps) {
  const isLoading = usePermissionLoading();
  const limit = useLimit(resource);
  
  if (isLoading) return <>{loading}</>;
  if (limit.reached) return <>{fallback}</>;
  return <>{children}</>;
}

// =============================================================================
// FEATURE GUARD
// =============================================================================

interface FeatureGuardProps {
  /** Feature to check */
  feature: keyof Features;
  /** Content to show when feature is enabled */
  children: ReactNode;
  /** Content to show when feature is disabled (default: null) */
  fallback?: ReactNode;
  /** Content to show while loading (default: null) */
  loading?: ReactNode;
}

/**
 * Guard component that conditionally renders children based on feature flags.
 * 
 * @example
 * ```tsx
 * <FeatureGuard 
 *   feature="bulk_scheduling" 
 *   fallback={<UpgradePrompt feature="Bulk Scheduling" />}
 * >
 *   <BulkScheduler />
 * </FeatureGuard>
 * ```
 */
export function FeatureGuard({ 
  feature, 
  children, 
  fallback = null,
  loading = null 
}: FeatureGuardProps) {
  const isLoading = usePermissionLoading();
  const hasFeature = useFeature(feature);
  
  if (isLoading) return <>{loading}</>;
  if (!hasFeature) return <>{fallback}</>;
  return <>{children}</>;
}

// =============================================================================
// COMBINED GUARD
// =============================================================================

interface CombinedGuardProps {
  /** Permission(s) required */
  permission?: Permission;
  permissions?: Permission[];
  permissionMode?: 'all' | 'any';
  /** Resource limit to check */
  resource?: keyof Limits;
  /** Feature to check */
  feature?: keyof Features;
  /** Content to show when all checks pass */
  children: ReactNode;
  /** Content to show when any check fails (default: null) */
  fallback?: ReactNode;
  /** Content to show while loading (default: null) */
  loading?: ReactNode;
}

/**
 * Combined guard that checks permissions, limits, and features together.
 * All specified checks must pass for children to render.
 * 
 * @example
 * ```tsx
 * <CombinedGuard 
 *   permission={PERMISSIONS.STAFF.INVITE}
 *   resource="staff"
 *   fallback={<AccessDenied />}
 * >
 *   <InviteStaffForm />
 * </CombinedGuard>
 * ```
 */
export function CombinedGuard({
  permission,
  permissions,
  permissionMode = 'all',
  resource,
  feature,
  children,
  fallback = null,
  loading = null
}: CombinedGuardProps) {
  const isLoading = usePermissionLoading();
  const hasSinglePermission = usePermission(permission!);
  const hasMultiplePermissions = usePermissions(permissions || [], permissionMode);
  const limit = useLimit(resource!);
  const hasFeature = useFeature(feature!);

  if (isLoading) return <>{loading}</>;

  // Check permissions
  if (permission && !hasSinglePermission) return <>{fallback}</>;
  if (permissions && permissions.length > 0 && !hasMultiplePermissions) return <>{fallback}</>;
  
  // Check limit
  if (resource && limit.reached) return <>{fallback}</>;
  
  // Check feature
  if (feature && !hasFeature) return <>{fallback}</>;

  return <>{children}</>;
}
