import React, { memo } from "react";
import { SearchInput } from "./SearchInput";
import { FilterSelect, FilterOption } from "./FilterSelect";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type FilterConfig = 
  | { type: 'input'; key: 'search'; placeholder?: string }
  | { type: 'select'; key: string; options: FilterOption[]; placeholder?: string };

interface FilterBarProps {
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onReset?: () => void;
  config: FilterConfig[];
  className?: string;
}

export const FilterBar = memo(({ 
  filters, 
  onFilterChange, 
  onReset,
  config,
  className 
}: FilterBarProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'all');

  return (
    <div className={`flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center ${className}`}>
      {config.map((filter) => {
        if (filter.type === 'input' && filter.key === 'search') {
          return (
            <SearchInput 
              key={filter.key}
              value={filters[filter.key] || ""} 
              onChange={(val) => onFilterChange(filter.key, val)} 
              placeholder={filter.placeholder} 
            />
          );
        }
        
        if (filter.type === 'select') {
          return (
            <FilterSelect 
              key={filter.key}
              value={filters[filter.key]} 
              onChange={(val) => onFilterChange(filter.key, val)}
              options={filter.options}
              placeholder={filter.placeholder}
              className="w-[150px]"
            />
          );
        }

        return null;
      })}

      {hasActiveFilters && onReset && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="h-8 px-2 lg:px-3 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

FilterBar.displayName = "FilterBar";
