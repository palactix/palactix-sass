"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchClients } from "@/features/clients/api/clients.queries";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";
import { useTrackClientAccessMutation } from "@/features/staff/hooks/useRecentClients";

interface ClientSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentClientId: string;
}

export function ClientSelectorDialog({
  open,
  onOpenChange,
  currentClientId,
}: ClientSelectorDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentOrg = useOrganizationStore((state) => state.currentOrganization);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const trackMutation = useTrackClientAccessMutation();

  // Always search with at least empty string to load all clients initially
  const { data: clientList = [], isLoading } = useSearchClients(debouncedSearchQuery || " ");

  // Detect current page type (scheduler or calendar)
  const pageType = useMemo(() => {
    if (pathname.includes("/scheduler")) return "scheduler";
    if (pathname.includes("/calendar")) return "calendar";
    return "scheduler"; // default
  }, [pathname]);

  const handleClientSelect = (clientId: string) => {
    if (!currentOrg?.slug) return;

    // Track client access
    trackMutation.mutate({
      client_id: Number(clientId),
      page_module: pageType,
    });

    // Build new URL with selected client
    const newUrl = `/${currentOrg.slug}/clients/${clientId}/${pageType}`;
    
    onOpenChange(false);
    router.push(newUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-md">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Switch Client</DialogTitle>
        </DialogHeader>
        <Command className="border-none" shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            
            <CommandInput
              placeholder="Search clients..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-none focus:ring-0"
            />
          </div>
          <CommandList>
            {clientList.length === 0 ? (
              <CommandEmpty>
                {isLoading ? "Searching..." : "No clients found."}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {clientList.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={String(client.id)}
                    onSelect={() => handleClientSelect(String(client.id))}
                    className="cursor-pointer"
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs">
                        {client.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1">{client.name}</span>
                    {String(client.id) === currentClientId && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
