"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostsListing } from "@/features/posts/hooks/usePostsListing";
import { Search, Filter, X, ChevronUp, ChevronDown, Calendar as CalendarIcon, User as UserIcon, Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

export const PostsFilterBar = ({ 
  filters, 
  setParams, 
  resetFilters 
}: ReturnType<typeof usePostsListing>) => {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const tabs = [
    { value: "all", label: "All Posts" },
    { value: "draft", label: "Drafts" },
    { value: "pending_approval", label: "Needs Approval" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
    { value: "rejected", label: "Rejected" },
  ];

  const handleSearch = () => {
    setParams({ search: localSearch });
  };
  
  const activeFiltersCount = [
    filters.date_from, 
    filters.date_to, 
    filters.user_id,
    filters.client_id
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 bg-background">
      {/* Quick Filters (Tabs) */}
      <div className="flex items-center gap-1 border-b overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setParams({ status: tab.value })}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              filters.status === tab.value
                ? "border-[#2ea44f] text-[#2ea44f]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 w-full">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search posts..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-9 h-9 bg-background"
                    />
                </div>
                
                <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <CollapsibleTrigger asChild>
                        <Button 
                            variant={isFiltersOpen ? "secondary" : "outline"} 
                            size="sm" 
                            className="h-9 gap-2 relative bg-background"
                        >
                            <Filter className="h-3.5 w-3.5" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px] ml-0.5 rounded-full">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                            {isFiltersOpen ? <ChevronUp className="h-3.5 w-3.5 ml-1 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 ml-1 text-muted-foreground" />}
                        </Button>
                    </CollapsibleTrigger>
                </Collapsible>

                {/* Clear Filters Button - visible if filters active */}
                {(activeFiltersCount > 0 || filters.search) && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                            resetFilters();
                            setLocalSearch("");
                        }}
                        className="h-9 px-2 text-muted-foreground hover:text-destructive"
                    >
                        Clear all
                    </Button>
                )}
            </div>
            
            <div className="flex items-center gap-2">
                 {/* Right side actions if any */}
            </div>
          </div>

          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleContent className="space-y-4 pt-2">
                  <div className="p-4 border rounded-lg bg-muted/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    {/* Date Information */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <CalendarIcon className="h-3.5 w-3.5" /> Date Range
                        </Label>
                        <div className="flex items-center gap-2">
                             <Input 
                                type="date" 
                                value={filters.date_from || ""} 
                                onChange={(e) => setParams({ date_from: e.target.value })}
                                className="h-9 bg-background text-sm"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input 
                                type="date" 
                                value={filters.date_to || ""} 
                                onChange={(e) => setParams({ date_to: e.target.value })}
                                className="h-9 bg-background text-sm"
                            />
                        </div>
                    </div>

                    {/* Created By */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                             <UserIcon className="h-3.5 w-3.5" /> Created By
                        </Label>
                        <Select 
                            value={filters.user_id || "all"} 
                            onValueChange={(val) => setParams({ user_id: val === "all" ? undefined : val })}
                        >
                            <SelectTrigger className="h-9 bg-background">
                            <SelectValue placeholder="All Users" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="me">Me</SelectItem>
                            {/* Map users... */}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Client */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                             <Building2 className="h-3.5 w-3.5" /> Client
                        </Label>
                        <Select 
                            value={filters.client_id || "all"} 
                            onValueChange={(val) => setParams({ client_id: val === "all" ? undefined : val })}
                        >
                            <SelectTrigger className="h-9 bg-background">
                            <SelectValue placeholder="All Clients" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Clients</SelectItem>
                            {/* We would map clients here if we had the list */}
                            <SelectItem value="1">Client 1</SelectItem>
                            <SelectItem value="2">Client 2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              </CollapsibleContent>
          </Collapsible>
      </div>
    </div>
  );
};
