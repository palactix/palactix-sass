import { ComponentType, ReactNode } from 'react';
import { usePermission, usePermissions, usePermissionLoading } from '@/features/organization/hooks/useOrganizationAuth';
import { Permission } from '@/utils/constants/permissions';
import { Loader2 } from 'lucide-react';

// =============================================================================
// DEFAULT FALLBACK COMPONENTS
// =============================================================================

function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function DefaultUnauthorizedFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <svg 
          className="h-8 w-8 text-destructive" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
      <p className="text-muted-foreground max-w-md">
        You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
    </div>
  );
}

// =============================================================================
// withPermission HOC
// =============================================================================

interface WithPermissionOptions {
  /** Loading component to show while checking permissions */
  LoadingComponent?: ComponentType;
  /** Component to show when permission is denied */
  UnauthorizedComponent?: ComponentType;
}

/**
 * Higher-Order Component for protecting entire pages/routes with permissions.
 * 
 * @example Basic usage
 * ```tsx
 * // pages/staff/page.tsx
 * import { withPermission } from '@/components/shared/withPermission';
 * import { PERMISSIONS } from '@/utils/constants/permissions';
 * 
 * function StaffPage() {
 *   return <div>Staff Management</div>;
 * }
 * 
 * export default withPermission(StaffPage, PERMISSIONS.STAFF.VIEW);
 * ```
 * 
 * @example With custom fallbacks
 * ```tsx
 * export default withPermission(
 *   AdminDashboard, 
 *   PERMISSIONS.ORGANIZATION.UPDATE,
 *   {
 *     LoadingComponent: CustomLoader,
 *     UnauthorizedComponent: CustomUnauthorized
 *   }
 * );
 * ```
 */
export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredPermission: Permission,
  options: WithPermissionOptions = {}
) {
  const {
    LoadingComponent = DefaultLoadingFallback,
    UnauthorizedComponent = DefaultUnauthorizedFallback
  } = options;

  function WithPermissionComponent(props: P) {
    const isLoading = usePermissionLoading();
    const hasPermission = usePermission(requiredPermission);
    
    if (isLoading) {
      return <LoadingComponent />;
    }
    
    if (!hasPermission) {
      return <UnauthorizedComponent />;
    }
    
    return <WrappedComponent {...props} />;
  }

  // Set display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithPermissionComponent.displayName = `withPermission(${displayName})`;

  return WithPermissionComponent;
}

// =============================================================================
// withPermissions HOC (Multiple permissions)
// =============================================================================

interface WithPermissionsOptions extends WithPermissionOptions {
  /** 'all' = require all permissions, 'any' = require at least one */
  mode?: 'all' | 'any';
}

/**
 * Higher-Order Component for protecting pages with multiple permissions.
 * 
 * @example Require all permissions
 * ```tsx
 * export default withPermissions(
 *   StaffEditor, 
 *   [PERMISSIONS.STAFF.VIEW, PERMISSIONS.STAFF.UPDATE],
 *   { mode: 'all' }
 * );
 * ```
 * 
 * @example Require any permission
 * ```tsx
 * export default withPermissions(
 *   DeletePage, 
 *   [PERMISSIONS.STAFF.DELETE, PERMISSIONS.CLIENTS.DELETE],
 *   { mode: 'any' }
 * );
 * ```
 */
export function withPermissions<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredPermissions: Permission[],
  options: WithPermissionsOptions = {}
) {
  const {
    mode = 'all',
    LoadingComponent = DefaultLoadingFallback,
    UnauthorizedComponent = DefaultUnauthorizedFallback
  } = options;

  function WithPermissionsComponent(props: P) {
    const isLoading = usePermissionLoading();
    const hasPermissions = usePermissions(requiredPermissions, mode);
    
    if (isLoading) {
      return <LoadingComponent />;
    }
    
    if (!hasPermissions) {
      return <UnauthorizedComponent />;
    }
    
    return <WrappedComponent {...props} />;
  }

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithPermissionsComponent.displayName = `withPermissions(${displayName})`;

  return WithPermissionsComponent;
}

// =============================================================================
// ProtectedRoute Component (Alternative to HOC)
// =============================================================================

interface ProtectedRouteProps {
  /** Single permission required */
  permission?: Permission;
  /** Multiple permissions required */
  permissions?: Permission[];
  /** 'all' = require all permissions, 'any' = require at least one */
  mode?: 'all' | 'any';
  /** The page/component to render when authorized */
  children: ReactNode;
  /** Custom loading component */
  loadingFallback?: ReactNode;
  /** Custom unauthorized component */
  unauthorizedFallback?: ReactNode;
}

/**
 * Component wrapper for protecting routes/pages.
 * Alternative to HOC pattern - useful for layouts.
 * 
 * @example
 * ```tsx
 * // In a layout or page
 * <ProtectedRoute permission={PERMISSIONS.BILLING.MANAGE}>
 *   <BillingPage />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  permission,
  permissions,
  mode = 'all',
  children,
  loadingFallback,
  unauthorizedFallback
}: ProtectedRouteProps) {
  const isLoading = usePermissionLoading();
  const hasSinglePermission = usePermission(permission!);
  const hasMultiplePermissions = usePermissions(permissions || [], mode);

  if (isLoading) {
    return <>{loadingFallback || <DefaultLoadingFallback />}</>;
  }

  // Determine which check to use
  let hasAccess: boolean;
  if (permissions && permissions.length > 0) {
    hasAccess = hasMultiplePermissions;
  } else if (permission) {
    hasAccess = hasSinglePermission;
  } else {
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{unauthorizedFallback || <DefaultUnauthorizedFallback />}</>;
  }

  return <>{children}</>;
}
