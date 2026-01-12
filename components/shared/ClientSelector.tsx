"use client";

import { useState, useMemo } from "react";
import { usePathname, useParams } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClientSelectorDialog } from "./ClientSelectorDialog";
import { useCurrentClient } from "@/features/clients/hooks/useCurrentClient";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientSelector() {
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);

  // Check if we're on a client page (scheduler or calendar)
  const isClientPage = useMemo(() => {
    return pathname.includes("/clients/") && 
           (pathname.includes("/scheduler") || pathname.includes("/calendar"));
  }, [pathname]);

  // Extract clientId from URL params
  const clientId = useMemo(() => {
    if (params?.client && typeof params.client === 'string') {
      return params.client;
    }
    return null;
  }, [params]);

  const { data: client, isLoading } = useCurrentClient(clientId);

  // Don't render if not on a client page
  if (!isClientPage || !clientId) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        className="gap-2 h-9 px-3"
        onClick={() => setOpen(true)}
      >
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </>
        ) : (
          <>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {client?.name?.charAt(0).toUpperCase() || <User className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[150px] truncate">
              {client?.name || "Select Client"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </>
        )}
      </Button>

      <ClientSelectorDialog
        open={open}
        onOpenChange={setOpen}
        currentClientId={clientId}
      />
    </>
  );
}
