/**
 * Central URL builder utilities for organization-scoped routing
 * 
 * All navigation and redirects should use these functions to ensure
 * organization slug is properly included in URLs
 */

import { useOrganizationStore } from "@/features/organization/stores/organization.store";

/**
 * Build an organization-scoped URL path
 * @param path - The path without org slug (e.g., '/dashboard', '/staff')
 * @param orgSlug - Optional org slug. If not provided, uses current org from store
 * @returns Full path with org slug (e.g., '/acme-corp/dashboard')
 * 
 * @example
 * buildOrgUrl('/dashboard') // '/acme-corp/dashboard'
 * buildOrgUrl('/staff', 'tech-startup') // '/tech-startup/staff'
 */
export function buildOrgUrl(path: string, orgSlug?: string): string {
  const slug = orgSlug || useOrganizationStore.getState().currentOrganization?.slug;
  if (!slug) {
    console.warn('No organization slug available for building URL');
    return path;
  }
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `/${slug}/${cleanPath}`;
}

/**
 * React hook to build organization-scoped URLs
 * Use this in components for reactive org changes
 * 
 * @example
 * const buildUrl = useBuildOrgUrl();
 * <Link href={buildUrl('/dashboard')}>Dashboard</Link>
 */
export function useBuildOrgUrl() {
  const currentOrg = useOrganizationStore((state) => state.currentOrganization);
  
  return (path: string, orgSlug?: string) => {
    const slug = orgSlug || currentOrg?.slug;
    
    if (!slug) {
      console.warn('No organization slug available for building URL');
      return path;
    }
    
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${slug}/${cleanPath}`;
  };
}

/**
 * Extract org slug from pathname
 * @param pathname - Current pathname from router
 * @returns Organization slug or null
 * 
 * @example
 * getOrgSlugFromPath('/acme-corp/dashboard') // 'acme-corp'
 */
export function getOrgSlugFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || null;
}

/**
 * Extract the page path without org slug
 * @param pathname - Current pathname from router
 * @returns Page path without org slug
 * 
 * @example
 * getPagePathFromUrl('/acme-corp/staff/create') // 'staff/create'
 */
export function getPagePathFromUrl(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  return segments.slice(1).join('/') || 'dashboard';
}

/**
 * Build login redirect URL with organization context
 * @param returnUrl - The URL to return to after login
 * @param firstOrgSlug - The first organization slug from user data
 * @returns Login URL with proper redirect
 * 
 * @example
 * buildLoginUrl('/staff', 'acme-corp') 
 * // '/auth/login?returnUrl=%2Facme-corp%2Fstaff'
 */
export function buildLoginUrl(returnUrl?: string, firstOrgSlug?: string): string {
  if (returnUrl) {
    return `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
  
  if (firstOrgSlug) {
    const defaultUrl = `/${firstOrgSlug}/dashboard`;
    return `/auth/login?returnUrl=${encodeURIComponent(defaultUrl)}`;
  }
  
  return '/auth/login';
}

/**
 * Build redirect URL after successful login
 * @param returnUrl - Query param from login page
 * @param firstOrgSlug - First organization slug from user data
 * @returns URL to redirect to after login
 * 
 * @example
 * buildPostLoginRedirect(undefined, 'acme-corp') // '/acme-corp/dashboard'
 * buildPostLoginRedirect('/acme-corp/staff', 'acme-corp') // '/acme-corp/staff'
 */
export function buildPostLoginRedirect(returnUrl?: string | null, firstOrgSlug?: string): string {
  // If returnUrl is provided and valid, use it
  if (returnUrl && returnUrl.startsWith('/')) {
    return returnUrl;
  }
  
  // Otherwise, redirect to first org's dashboard
  if (firstOrgSlug) {
    return `/${firstOrgSlug}/dashboard`;
  }
  
  // Fallback to root (will be handled by layout)
  return '/';
}

/**
 * Navigate to a page in a different organization
 * Preserves the current page type when switching orgs
 * 
 * @param targetOrgSlug - The organization to switch to
 * @param currentPathname - Current pathname from router
 * @param preservePath - Whether to preserve current page (default: true)
 * @returns URL in the target organization
 * 
 * @example
 * buildOrgSwitchUrl('tech-startup', '/acme-corp/staff/create', true)
 * // '/tech-startup/staff/create'
 * 
 * buildOrgSwitchUrl('tech-startup', '/acme-corp/staff', false)
 * // '/tech-startup/dashboard'
 */
export function buildOrgSwitchUrl(
  targetOrgSlug: string,
  currentPathname: string,
  preservePath: boolean = true
): string {
  if (!preservePath) {
    return `/${targetOrgSlug}/dashboard`;
  }
  
  const pagePath = getPagePathFromUrl(currentPathname);
  return `/${targetOrgSlug}/${pagePath}`;
}

/**
 * Common navigation paths builder
 * Returns an object with all common navigation paths for current org
 * 
 * @example
 * const paths = getOrgPaths();
 * router.push(paths.dashboard)
 * <Link href={paths.staff}>Staff</Link>
 */
export function getOrgPaths(orgSlug?: string) {
  const slug = orgSlug || useOrganizationStore.getState().currentOrganization?.slug;
  
  if (!slug) {
    console.warn('No organization slug available');
    return {
      dashboard: '/dashboard',
      staff: '/staff',
      agencyApp: '/agency-app',
      settings: '/settings',
      billing: '/billing',
      analytics: '/analytics',
      clients: '/clients',
      scheduler: '/scheduler',
      inbox: '/inbox',
      upgrade: '/upgrade',
    };
  }
  
  return {
    dashboard: `/${slug}/dashboard`,
    staff: `/${slug}/staff`,
    staffCreate: `/${slug}/staff/create`,
    agencyApp: `/${slug}/agency-app`,
    settings: `/${slug}/settings`,
    billing: `/${slug}/billing`,
    analytics: `/${slug}/analytics`,
    clients: `/${slug}/clients`,
    scheduler: `/${slug}/scheduler`,
    inbox: `/${slug}/inbox`,
    upgrade: `/${slug}/upgrade`,
  };
}

/**
 * React hook version of getOrgPaths
 * Use this in components for reactive updates
 */
export function useOrgPaths(orgSlug?: string) {
  const currentOrg = useOrganizationStore((state) => state.currentOrganization);
  const slug = orgSlug || currentOrg?.slug;
  
  if (!slug) {
    console.warn('No organization slug available');
    return {
      dashboard: '/dashboard',
      staff: '/staff',
      agencyApp: '/agency-app',
      settings: '/settings',
      billing: '/billing',
      analytics: '/analytics',
      clients: '/clients',
      scheduler: '/scheduler',
      inbox: '/inbox',
      upgrade: '/upgrade',
    };
  }
  
  return {
    dashboard: `/${slug}/dashboard`,
    staff: `/${slug}/staff`,
    staffCreate: `/${slug}/staff/create`,
    agencyApp: `/${slug}/agency-app`,
    settings: `/${slug}/settings`,
    billing: `/${slug}/billing`,
    analytics: `/${slug}/analytics`,
    clients: `/${slug}/clients`,
    scheduler: `/${slug}/scheduler`,
    inbox: `/${slug}/inbox`,
    upgrade: `/${slug}/upgrade`,
  };
}
