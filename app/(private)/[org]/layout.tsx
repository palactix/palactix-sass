"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/api/auth.queries";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";
import { Loader2 } from "lucide-react";
import { buildPostLoginRedirect } from "@/lib/utils/org-urls";
import { use } from "react";

import { useOrganizationAuth } from "@/features/organization/hooks/useOrganizationAuth";

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ org: string }>;
}

export default function OrgLayout({ children, params }: OrgLayoutProps) {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { currentOrganization, setCurrentOrganization } = useOrganizationStore();
  const { org } = use(params);
  
  // Initialize organization permissions
  useOrganizationAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Find organization by slug from URL
      const organization = user.organizations?.find(o => o.slug === org);
      
      if (!organization) {
        // User doesn't have access to this org
        // Redirect to first available org or unauthorized page
        if (user.organizations && user.organizations.length > 0) {
          const firstOrgSlug = user.organizations[0].slug;
          const redirectUrl = buildPostLoginRedirect(null, firstOrgSlug);
          router.replace(redirectUrl);
        } else {
          router.replace('/unauthorized');
        }
        return;
      }

      // Set current organization in store based on URL
      if (currentOrganization?.id !== organization.id) {
        setCurrentOrganization(organization);
      }
    }
  }, [org, user, isLoading, currentOrganization, setCurrentOrganization, router]);

  // Show loading while validating org access
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Check if user has access to this org
  const hasAccess = user.organizations?.some(o => o.slug === org);
  
  if (!hasAccess) {
    // This will trigger the redirect in useEffect
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
