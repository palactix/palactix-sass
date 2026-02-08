"use client";

import React from "react";
import { SearchInput } from "./items/SearchInput";
import { SingleSelectFilter } from "./items/SingleSelectFilter";
import { MultiSelectFilter } from "./items/MultiSelectFilter";
import { SingleDateFilter } from "./items/SingleDateFilter";
import { DateRangeFilter } from "./items/DateRangeFilter";
import { ResetFilters } from "./items/ResetFilters";
import { FilterConfig, UseSharedFiltersResult } from "./useSharedFilters";

interface DynamicFiltersProps<T extends FilterConfig> {
  config: T;
  form: UseSharedFiltersResult<T>;
}

export function DynamicFilters<T extends FilterConfig>({ config, form }: DynamicFiltersProps<T>) {
  const { fields, reset } = form;

  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {Object.entries(config).map(([key, cfg]) => {
          const field = fields[key];
          
          switch (cfg.type) {
            case "search":
              return (
                <SearchInput
                  key={key}
                  wrapperClass={field.wrapperClass}
                  inputProps={field.inputProps}
                />
              );
            
            case "singleSelect":
              return (
                <SingleSelectFilter
                  key={key}
                  value={field.value as string | undefined}
                  onChange={field.onChange}
                  options={field.options || []}
                  placeholder={field.placeholder}
                  className={field.className}
                />
              );
            
            case "multiSelect":
              return (
                <MultiSelectFilter
                  key={key}
                  selected={(field.selected as string[]) || []}
                  onChange={field.onChange}
                  options={field.options || []}
                  label={field.label}
                  className={field.className}
                />
              );
            
            case "singleDate":
              return (
                <SingleDateFilter
                  key={key}
                  selected={field.selected as Date | undefined}
                  onSelect={field.onSelect}
                  className={field.className}
                />
              );
            
            case "dateRange":
              return (
                <DateRangeFilter
                  key={key}
                  value={field.value as { from?: Date; to?: Date } | undefined}
                  onChange={field.onChange}
                  className={field.className}
                />
              );
            
            default:
              return null;
          }
        })}
        
        <ResetFilters onReset={reset} />
      </div>
    </div>
  );
}
