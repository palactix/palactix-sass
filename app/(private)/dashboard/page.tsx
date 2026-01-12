"use client";

import { useUser } from "@/features/auth/api/auth.queries";
import { buildPostLoginRedirect } from "@/lib/utils/index";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user } = useUser();
  
  useEffect(() => {
      if (user?.organizations && user.organizations.length > 0) {
        const firstOrgSlug = user.organizations[0].slug;
        const redirectUrl = buildPostLoginRedirect(null, firstOrgSlug);
        router.replace(redirectUrl);
      }
    }, [user, router]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Redirecting to your organization&apos;s dashboard...</p>
    </div>
  );
}