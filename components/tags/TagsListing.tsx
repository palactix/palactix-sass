"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    MoreHorizontal,
    ChevronDown,
    Plus,
    Download,
    Upload,
    Trash2,
    Calendar as CalendarIcon,
    RefreshCw,
    Filter,
    Search,
    X
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

// --- Types & Mock Data ---

type TagStatus = "active" | "inactive" | "archived";
type TagType = "marketing" | "product" | "support" | "internal";

interface Tag {
  id: string;
  name: string;
  slug: string;
  status: TagStatus;
  type: TagType;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
}

const GENERATE_COUNT = 87;

const MOCK_TAGS: Tag[] = Array.from({ length: GENERATE_COUNT }).map((_, i) => ({
  id: `tag-${i + 1}`,
  name: `Tag ${i + 1}`,
  slug: `tag-${i + 1}`,
  status: i % 3 === 0 ? "inactive" : i % 5 === 0 ? "archived" : "active",
  type: i % 4 === 0 ? "marketing" : i % 3 === 0 ? "product" : i % 2 === 0 ? "support" : "internal",
  usage_count: Math.floor(Math.random() * 1000),
  created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  updated_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
}));

// --- Main Component ---

export default function TagsListing() {
  // State
  const [data, setData] = React.useState<Tag[]>(MOCK_TAGS);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  
  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilters, setTypeFilters] = React.useState<string[]>([]);
  const [singleDate, setSingleDate] = React.useState<Date | undefined>();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // Use Memo for Filtering & Pagination to simulate backend
  const filteredData = React.useMemo(() => {
    let filtered = [...data];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) || 
        item.slug.toLowerCase().includes(lowerQuery)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (typeFilters.length > 0) {
      filtered = filtered.filter(item => typeFilters.includes(item.type));
    }

    if (singleDate) {
       filtered = filtered.filter(item => 
          new Date(item.created_at).toDateString() === singleDate.toDateString()
       );
    }

    if (dateRange?.from) {
        filtered = filtered.filter(item => {
            const date = new Date(item.created_at);
            if (dateRange.to) {
                return date >= dateRange.from! && date <= dateRange.to;
            }
            return date >= dateRange.from!;
        });
    }

    return filtered;
  }, [data, searchQuery, statusFilter, typeFilters, singleDate, dateRange]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Handlers
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedData.map(d => d.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilters([]);
    setSingleDate(undefined);
    setDateRange(undefined);
    setCurrentPage(1);
  };

  const handleBulkAction = (action: string) => {
      alert(`Performing bulk action: ${action} on ${selectedIds.size} items`);
      setSelectedIds(new Set());
  };

  // derived state for bulk actions
  const isBulkActionsVisible = selectedIds.size > 0;
  const isAllSelected = paginatedData.length > 0 && paginatedData.every(d => selectedIds.has(d.id));

  return (
    <div className="space-y-6">
      
      {/* --- Action Bar --- */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
         <h1 className="text-2xl font-bold tracking-tight">Tags Listing</h1>
         <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
                <Upload className="items-center h-4 w-4" />
                Import
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                    <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Create Tag
            </Button>
         </div>
      </div>

      {/* --- Filters --- */}
      <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search tags..." 
                    className="pl-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-background">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
            </Select>

             {/* Type Filter (Multi-select simulated with Dropdown) */}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-dashed gap-2 bg-background">
                        <Filter className="h-4 w-4" />
                        Type
                        {typeFilters.length > 0 && (
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {typeFilters.length}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {["marketing", "product", "support", "internal"].map((type) => (
                        <DropdownMenuCheckboxItem
                            key={type}
                            checked={typeFilters.includes(type)}
                            onCheckedChange={(checked) => {
                                if (checked) setTypeFilters([...typeFilters, type]);
                                else setTypeFilters(typeFilters.filter(t => t !== type));
                            }}
                        >
                            <span className="capitalize">{type}</span>
                        </DropdownMenuCheckboxItem>
                    ))}
                    {typeFilters.length > 0 && (
                         <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onSelect={() => setTypeFilters([])}
                                className="justify-center text-center"
                            >
                                Clear filters
                            </DropdownMenuItem>
                         </>
                    )}
                </DropdownMenuContent>
             </DropdownMenu>

            {/* Single Date Picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[180px] justify-start text-left font-normal bg-background",
                            !singleDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {singleDate ? format(singleDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={singleDate}
                        onSelect={setSingleDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            {/* Date Range Picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-[240px] justify-start text-left font-normal bg-background",
                        !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Date Range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>


            {/* Reset Filters */}
            <Button 
                variant="ghost" 
                onClick={resetFilters}
                className="gap-2 text-muted-foreground hover:text-foreground"
            >
                <X className="h-4 w-4" />
                Reset
            </Button>
        </div>
      </div>

      {/* --- Bulk Actions Bar --- */}
      {isBulkActionsVisible && (
        <div className="sticky top-0 z-10 bg-primary/5 border rounded-md p-2 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
                <Badge variant="default" className="ml-2">{selectedIds.size} Selected</Badge>
                <span className="text-sm text-muted-foreground hidden sm:inline-block">Apply actions to selected items.</span>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Activate")}>
                   Activate
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Deactivate")}>
                   Deactivate
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction("Delete")} className="gap-2">
                   <Trash2 className="h-3.5 w-3.5" />
                   Delete
                </Button>
            </div>
        </div>
      )}


      {/* --- Table --- */}
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                   <TableHead className="w-[50px]">
                        <Checkbox 
                            checked={isAllSelected}
                            onCheckedChange={toggleAll}
                        />
                   </TableHead>
                   <TableHead>Name</TableHead>
                   <TableHead>Slug</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Type</TableHead>
                   <TableHead className="text-right">Usage</TableHead>
                   <TableHead>Created</TableHead>
                   <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((tag) => (
                        <TableRow key={tag.id} data-state={selectedIds.has(tag.id) ? "selected" : undefined}>
                             <TableCell>
                                <Checkbox 
                                    checked={selectedIds.has(tag.id)}
                                    // @ts-ignore
                                    onCheckedChange={() => toggleSelection(tag.id)}
                                />
                             </TableCell>
                             <TableCell>
                                <div className="font-medium text-foreground">{tag.name}</div>
                             </TableCell>
                             <TableCell className="text-muted-foreground font-mono text-xs">{tag.slug}</TableCell>
                             <TableCell>
                                <StatusBadge status={tag.status} />
                             </TableCell>
                             <TableCell>
                                <Badge variant="outline" className="capitalize font-normal text-muted-foreground">
                                    {tag.type}
                                </Badge>
                             </TableCell>
                             <TableCell className="text-right font-medium">
                                {tag.usage_count.toLocaleString()}
                             </TableCell>
                             <TableCell className="text-muted-foreground text-sm">
                                {format(tag.created_at, "MMM dd, yyyy")}
                             </TableCell>
                             <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                            Delete Tag
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            No results found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </div>

       {/* --- Pagination --- */}
       <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
             Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
          </div>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
                 <Select 
                    value={pageSize.toString()} 
                    onValueChange={(v) => {
                        setPageSize(Number(v));
                        setCurrentPage(1);
                    }}
                 >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 50, 100].map(size => (
                            <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
              </div>
              <div className="flex items-center gap-2">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                     disabled={currentPage === 1}
                   >
                     Previous
                   </Button>
                   <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                          let pageNum = i + 1;
                          if (totalPages > 5 && currentPage > 3) {
                              pageNum = currentPage - 3 + i + 1;
                              if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                          }
                          
                          return (
                            <Button
                                key={i}
                                variant={currentPage === pageNum ? "default" : "ghost"}
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </Button>
                          )
                      })}
                   </div>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                     disabled={currentPage === totalPages}
                   >
                     Next
                   </Button>
              </div>
          </div>
       </div>

    </div>
  );
}

function StatusBadge({ status }: { status: TagStatus }) {
    const styles = {
        active: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
        inactive: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200",
        archived: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200",
    }
    return (
        <Badge variant="secondary" className={cn("capitalize font-medium border", styles[status])}>
            {status}
        </Badge>
    )
}