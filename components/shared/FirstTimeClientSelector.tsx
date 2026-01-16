"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface FirstTimeClientSelectorProps {
  open: boolean;
  pageModule: "scheduler" | "calendar" | "media" | string;
}

export function FirstTimeClientSelector({
  open,
  pageModule,
}: FirstTimeClientSelectorProps) {
  const router = useRouter();
  const currentOrg = useOrganizationStore((state) => state.currentOrganization);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: clientList = [], isLoading } = useSearchClients(
    debouncedSearchQuery || " "
  );

  const handleClientSelect = (clientId: string) => {
    if (!currentOrg?.slug) return;

    // Build URL with selected client and page module
    const newUrl = `/${currentOrg.slug}/clients/${clientId}/${pageModule}`;
    router.push(newUrl);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="p-0 gap-0 max-w-md [&>button]:hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Select a Client</DialogTitle>
          <DialogDescription>
            Choose a client to access their {pageModule}
          </DialogDescription>
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
