"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/features/auth/api/auth.queries";
import { Loader2 } from "lucide-react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useUser();
  const user = data;

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, isError, router, pathname]);

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
