"use client";

import { memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

export interface PostsFiltersProps {
  clients?: Array<{ id: string; name: string }>;
  platforms?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string }>;
}

export const PostsFilters = memo(function PostsFilters({
  clients = [],
  platforms = [],
  users = [],
}: PostsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read filters from URL
  const status = searchParams.get("status") || "all";
  const clientId = searchParams.get("client_id") || "all";
  const platform = searchParams.get("platform") || "all";
  const createdBy = searchParams.get("created_by") || "all";
  const approval = searchParams.get("approval") || "all";
  const dateFromStr = searchParams.get("date_from");
  const dateToStr = searchParams.get("date_to");
  const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
  const dateTo = dateToStr ? new Date(dateToStr) : undefined;

  // Update URL with new filter value
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Reset to page 1 when filters change
    params.delete("page");
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl, { scroll: false });
  };

  // Reset all filters
  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Keep only pagination and drawer params
    const keysToKeep = ["page", "pageSize", "postId"];
    const newParams = new URLSearchParams();
    keysToKeep.forEach((key) => {
      const value = params.get(key);
      if (value) newParams.set(key, value);
    });
    const newUrl = newParams.toString() ? `?${newParams.toString()}` : window.location.pathname;
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Status */}
      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select
          value={status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client */}
      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Client</label>
        <Select
          value={clientId}
          onValueChange={(value) => updateFilter("client_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Platform */}
      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Platform</label>
        <Select
          value={platform}
          onValueChange={(value) => updateFilter("platform", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platforms.map((platform) => (
              <SelectItem key={platform.id} value={platform.id}>
                {platform.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Created By */}
      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Created By</label>
        <Select
          value={createdBy}
          onValueChange={(value) => updateFilter("created_by", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Anyone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Anyone</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Approval */}
      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Approval</label>
        <Select
          value={approval}
          onValueChange={(value) => updateFilter("approval", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="requires_approval">Requires Approval</SelectItem>
            <SelectItem value="approved_by_me">Approved by me</SelectItem>
            <SelectItem value="waiting_on_me">Waiting on me</SelectItem>
            <SelectItem value="no_approval">No approval required</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Date Range</label>
        <div className="flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom && dateTo
                  ? `${format(dateFrom, "MMM dd")} - ${format(dateTo, "MMM dd")}`
                  : "Last 30 days"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: dateFrom,
                  to: dateTo,
                }}
                onSelect={(range) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (range?.from) {
                    params.set("date_from", range.from.toISOString());
                  } else {
                    params.delete("date_from");
                  }
                  if (range?.to) {
                    params.set("date_to", range.to.toISOString());
                  } else {
                    params.delete("date_to");
                  }
                  params.delete("page");
                  router.push(`?${params.toString()}`, { scroll: false });
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {(dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("date_from");
                params.delete("date_to");
                params.delete("page");
                const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
                router.push(newUrl, { scroll: false });
              }}
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="ghost" onClick={handleReset} className="self-end">
        Reset
      </Button>
    </div>
  );
});
