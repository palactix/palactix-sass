"use client";

import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useCampaigns } from "@/features/campaigns/hooks/useCampaigns";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";

export function CampaignSelector() {
  const { control, setValue } = useFormContext();
  const campaignId = useWatch({ control, name: "campaign_id" }) as string | undefined;
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const orgId = useOrganizationStore((state) => state.currentOrganization?.slug ?? "");
  const { data: campaigns = [], isLoading } = useCampaigns();

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;
    const query = searchQuery.toLowerCase();
    return campaigns.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(query) ||
        campaign.description?.toLowerCase().includes(query)
    );
  }, [campaigns, searchQuery]);

  const selectedCampaign = useMemo(() => {
    return campaigns.find((c) => c.id === campaignId);
  }, [campaigns, campaignId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 text-sm"
          disabled={isLoading}
        >
          {selectedCampaign ? (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCampaign.color }}
              />
              <span className="truncate">{selectedCampaign.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select campaign (optional)</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search campaigns..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No campaign found.</CommandEmpty>
            <CommandGroup>
              {campaignId && (
                <CommandItem
                  value=""
                  onSelect={() => {
                    setValue("campaign_id", undefined, { shouldDirty: true });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !campaignId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="text-muted-foreground">None</span>
                </CommandItem>
              )}
              {filteredCampaigns.map((campaign) => (
                <CommandItem
                  key={campaign.id}
                  value={campaign.id}
                  onSelect={(currentValue) => {
                    setValue("campaign_id", currentValue === campaignId ? undefined : currentValue, {
                      shouldDirty: true,
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      campaignId === campaign.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: campaign.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{campaign.name}</div>
                    {campaign.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {campaign.description}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
