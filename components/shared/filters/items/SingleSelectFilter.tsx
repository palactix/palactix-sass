import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface OptionItem {
  label: string;
  value: string;
}

export interface SingleSelectFilterProps {
  value?: string;
  onChange: (value: string) => void;
  options: OptionItem[];
  placeholder?: string;
  className?: string;
}

export const SingleSelectFilter = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: SingleSelectFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

SingleSelectFilter.displayName = "SingleSelectFilter";
