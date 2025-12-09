"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchStaff } from "@/features/staff/api/staff.queries";
import { useAssignStaffMutation } from "@/features/clients/api/clients.queries";
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
import { cn } from "@/lib/utils";

interface AssignStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: number;
    name: string;
    email: string;
  };
}

export function AssignStaffDialog({
  isOpen,
  onClose,
  client,
}: AssignStaffDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: staffList = [], isLoading: isSearching } = useSearchStaff(debouncedSearchQuery);
  const assignStaffMutation = useAssignStaffMutation();

  const selectedStaff = useMemo(
    () => staffList.find((staff) => staff.id === selectedStaffId),
    [staffList, selectedStaffId]
  );

  const handleAssign = async () => {
    if (!selectedStaffId) return;

    await assignStaffMutation.mutateAsync({
      userId: client.id,
      staffId: selectedStaffId,
    });

    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedStaffId(null);
    setIsPopoverOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Staff</DialogTitle>
          <DialogDescription>
            Assign a staff member to <strong>{client.name}</strong> ({client.email})
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPopoverOpen}
                className="w-full justify-between"
              >
                {selectedStaff ? selectedStaff.name : "Select staff member..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search staff members..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  {isSearching && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {!isSearching && staffList.length === 0 && (
                    <CommandEmpty>
                      {searchQuery.length > 0
                        ? "No staff members found."
                        : "Start typing to search..."}
                    </CommandEmpty>
                  )}
                  {!isSearching && staffList.length > 0 && (
                    <CommandGroup>
                      {staffList.map((staff) => (
                        <CommandItem
                          key={staff.id}
                          value={String(staff.id)}
                          onSelect={() => {
                            setSelectedStaffId(staff.id);
                            setIsPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStaffId === staff.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {staff.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedStaffId || assignStaffMutation.isPending}
          >
            {assignStaffMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Assign Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
