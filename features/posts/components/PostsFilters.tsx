"use client";

import { memo } from "react";
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
  filters: {
    status?: string;
    client_id?: string;
    platform?: string;
    created_by?: string;
    approval?: string;
    date_from?: Date;
    date_to?: Date;
  };
  onFilterChange: (key: string, value: string | Date | undefined) => void;
  onReset: () => void;
  clients?: Array<{ id: string; name: string }>;
  platforms?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string }>;
}

export const PostsFilters = memo(function PostsFilters({
  filters,
  onFilterChange,
  onReset,
  clients = [],
  platforms = [],
  users = [],
}: PostsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Status */}
      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onFilterChange("status", value === "all" ? undefined : value)}
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
          value={filters.client_id || "all"}
          onValueChange={(value) => onFilterChange("client_id", value === "all" ? undefined : value)}
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
          value={filters.platform || "all"}
          onValueChange={(value) => onFilterChange("platform", value === "all" ? undefined : value)}
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
          value={filters.created_by || "all"}
          onValueChange={(value) => onFilterChange("created_by", value === "all" ? undefined : value)}
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
          value={filters.approval || "all"}
          onValueChange={(value) => onFilterChange("approval", value === "all" ? undefined : value)}
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
                {filters.date_from && filters.date_to
                  ? `${format(filters.date_from, "MMM dd")} - ${format(filters.date_to, "MMM dd")}`
                  : "Last 30 days"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: filters.date_from,
                  to: filters.date_to,
                }}
                onSelect={(range) => {
                  onFilterChange("date_from", range?.from);
                  onFilterChange("date_to", range?.to);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {(filters.date_from || filters.date_to) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onFilterChange("date_from", undefined);
                onFilterChange("date_to", undefined);
              }}
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="ghost" onClick={onReset} className="self-end">
        Reset
      </Button>
    </div>
  );
});
