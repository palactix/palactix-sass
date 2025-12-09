"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/features/auth/api/auth.queries";
import { Loader2 } from "lucide-react";
import { buildLoginUrl, buildPostLoginRedirect } from "@/lib/utils/org-urls";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useUser();
  const user = data;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      const loginUrl = buildLoginUrl(pathname);
      router.push(loginUrl);
    }
  }, [user, isLoading, isError, router, pathname]);

  // Redirect to first org if user lands on /private root
  useEffect(() => {
    if (user?.organizations && user.organizations.length > 0 && pathname === '/') {
      const firstOrgSlug = user.organizations[0].slug;
      const redirectUrl = buildPostLoginRedirect(null, firstOrgSlug);
      router.replace(redirectUrl);
    }
  }, [user, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
