import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SingleDateFilterProps {
  selected?: Date;
  onSelect: (date?: Date) => void;
  className?: string;
  placeholder?: string;
}

export const SingleDateFilter = ({
  selected,
  onSelect,
  className,
  placeholder = "Pick a date",
}: SingleDateFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            className || "w-[180px] justify-start text-left font-normal bg-background",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(selected) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={onSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

SingleDateFilter.displayName = "SingleDateFilter";
