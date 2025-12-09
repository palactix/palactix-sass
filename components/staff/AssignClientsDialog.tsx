"use client";

import { useState, useMemo } from "react";
import { Check, Loader2, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchClients } from "@/features/clients/api/clients.queries";
import { useAssignClientsMutation } from "@/features/staff/api/staff.queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AssignClientsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff: {
    id: number;
    name: string;
    email: string;
  };
}

export function AssignClientsDialog({
  isOpen,
  onClose,
  staff,
}: AssignClientsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: clientList = [], isLoading: isSearching } = useSearchClients(debouncedSearchQuery);
  const assignClientsMutation = useAssignClientsMutation();

  const selectedClients = useMemo(
    () => clientList.filter((client) => selectedClientIds.includes(client.id)),
    [clientList, selectedClientIds]
  );

  const handleToggleClient = (clientId: number) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleRemoveClient = (clientId: number) => {
    setSelectedClientIds((prev) => prev.filter((id) => id !== clientId));
  };

  const handleAssign = async () => {
    if (selectedClientIds.length === 0) return;

    await assignClientsMutation.mutateAsync({
      userId: staff.id,
      clientIds: selectedClientIds,
    });

    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedClientIds([]);
    setIsPopoverOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Clients</DialogTitle>
          <DialogDescription>
            Assign multiple clients to <strong>{staff.name}</strong> ({staff.email})
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPopoverOpen}
                className="w-full justify-between"
              >
                {selectedClientIds.length > 0
                  ? `${selectedClientIds.length} client(s) selected`
                  : "Select clients..."}
                <span className="ml-2 h-4 w-4 shrink-0 opacity-50">▼</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search clients..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  {isSearching && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {!isSearching && clientList.length === 0 && (
                    <CommandEmpty>
                      {searchQuery.length > 0
                        ? "No clients found."
                        : "Start typing to search..."}
                    </CommandEmpty>
                  )}
                  {!isSearching && clientList.length > 0 && (
                    <CommandGroup>
                      {clientList.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={String(client.id)}
                          onSelect={() => handleToggleClient(client.id)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              selectedClientIds.includes(client.id)
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                          {client.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Selected Clients */}
          {selectedClients.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Selected Clients ({selectedClients.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedClients.map((client) => (
                  <Badge
                    key={client.id}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 gap-1"
                  >
                    {client.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveClient(client.id)}
                      className="ml-1 rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedClientIds.length === 0 || assignClientsMutation.isPending}
          >
            {assignClientsMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Assign {selectedClientIds.length > 0 && `(${selectedClientIds.length})`} Client
            {selectedClientIds.length !== 1 && "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
