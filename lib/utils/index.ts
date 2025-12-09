/**
 * Organization URL Utilities
 * 
 * Central barrel export for all organization-scoped URL building functions.
 * Import from this file for clean, consistent URL management.
 * 
 * @example
 * import { useOrgPaths, buildOrgUrl } from '@/lib/utils/org-urls'
 */

export {
  buildOrgUrl,
  useBuildOrgUrl,
  getOrgSlugFromPath,
  getPagePathFromUrl,
  buildLoginUrl,
  buildPostLoginRedirect,
  buildOrgSwitchUrl,
  getOrgPaths,
  useOrgPaths,
} from './org-urls';
