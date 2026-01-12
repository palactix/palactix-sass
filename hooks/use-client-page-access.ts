"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/features/auth/api/auth.queries";
import { useRecentClients, useTrackClientAccessMutation } from "@/features/staff/hooks/useRecentClients";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";

interface UseClientPageAccessOptions {
  pageModule: "scheduler" | "calendar" | "media" | string;
  onClientRequired?: () => void;
}

interface UseClientPageAccessResult {
  clientId: string | null;
  isLoading: boolean;
  showClientSelector: boolean;
  trackAccess: () => void;
}

/**
 * Reusable hook for pages that require client context (scheduler, calendar, media, etc.)
 * 
 * Handles:
 * - Role-based access control (clients vs agency members)
 * - Automatic redirection for clients to their own pages
 * - Recent client tracking and redirection for agency members
 * - First-time user client selection
 * 
 * @example
 * ```tsx
 * function SchedulerPage() {
 *   const { clientId, isLoading, showClientSelector, trackAccess } = useClientPageAccess({
 *     pageModule: "scheduler"
 *   });
 * 
 *   useEffect(() => {
 *     if (clientId) {
 *       trackAccess();
 *     }
 *   }, [clientId, trackAccess]);
 * 
 *   if (showClientSelector) {
 *     return <FirstTimeClientSelector open pageModule="scheduler" />;
 *   }
 * 
 *   if (!clientId) return <LoadingSpinner />;
 * 
 *   return <YourPageContent clientId={clientId} />;
 * }
 * ```
 */
export function useClientPageAccess({
  pageModule,
}: UseClientPageAccessOptions): UseClientPageAccessResult {
  const router = useRouter();
  const params = useParams();
  const currentOrg = useOrganizationStore((state) => state.currentOrganization);
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: recentClients, isLoading: isRecentLoading } = useRecentClients();
  const trackMutation = useTrackClientAccessMutation();

  // Extract clientId from URL params if present
  const clientIdFromUrl = params?.client && typeof params.client === 'string' 
    ? params.client 
    : null;

  // Determine if we should show client selector based on state
  const shouldShowSelector = Boolean(
    !isUserLoading && 
    !isRecentLoading && 
    !clientIdFromUrl && 
    currentOrg?.slug && 
    (!recentClients || recentClients.length === 0)
  );

  useEffect(() => {
    // Don't process until we have user data and org
    if (isUserLoading || !currentOrg?.slug) return;

    // If we already have a clientId in URL, no need to redirect
    if (clientIdFromUrl) {
      return;
    }

    const org = user?.organizations?.find(o => o.slug === currentOrg.slug);
    if (!org) return;

    // Check if user is a client (check is_admin flag - clients are not admins)
    const isClient = org.pivot.role_id === 4;
    
    if (isClient && user) {
      // Redirect client to their own page
      const clientUrl = `/${currentOrg.slug}/clients/${user.id}/${pageModule}`;
      router.replace(clientUrl);
      return;
    }

    // User is agency member (owner or staff)
    // Check for recent clients
    if (!isRecentLoading && recentClients && recentClients.length > 0) {
      // Find most recent client for this page module
      const recentForModule = recentClients.find(rc => rc.page_module === pageModule);
      const lastClient = recentForModule || recentClients[0];
      
      // Redirect to last accessed client
      const redirectUrl = `/${currentOrg.slug}/clients/${lastClient.client_id}/${pageModule}`;
      router.replace(redirectUrl);
    }
    // If no recent clients, shouldShowSelector will be true
  }, [
    user,
    isUserLoading,
    currentOrg,
    clientIdFromUrl,
    recentClients,
    isRecentLoading,
    pageModule,
    router,
  ]);

  // Function to track client access
  const trackAccess = () => {
    if (clientIdFromUrl) {
      trackMutation.mutate({
        client_id: Number(clientIdFromUrl),
        page_module: pageModule,
      });
    }
  };

  return {
    clientId: clientIdFromUrl,
    isLoading: isUserLoading || isRecentLoading,
    showClientSelector: shouldShowSelector,
    trackAccess,
  };
}
