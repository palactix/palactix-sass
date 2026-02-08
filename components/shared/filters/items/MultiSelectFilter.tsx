import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

export interface OptionItem {
  label: string;
  value: string;
}

export interface MultiSelectFilterProps {
  selected?: string[];
  onChange: (values: string[]) => void;
  options: OptionItem[];
  className?: string;
  label?: string;
}

export const MultiSelectFilter = ({
  selected = [],
  onChange,
  options,
  className,
  label = "Filter",
}: MultiSelectFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className || "border-dashed gap-2 bg-background"}>
          <Filter className="h-4 w-4" />
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
              {selected.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Select options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            checked={selected.includes(opt.value)}
            onCheckedChange={(checked) => {
              if (checked) onChange([...selected, opt.value]);
              else onChange(selected.filter((v) => v !== opt.value));
            }}
          >
            <span className="capitalize">{opt.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onChange([])} className="justify-center text-center">
              Clear
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

MultiSelectFilter.displayName = "MultiSelectFilter";
