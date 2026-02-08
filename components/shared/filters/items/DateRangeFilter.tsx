import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export type SimpleDateRange = { from?: Date; to?: Date };

export interface DateRangeFilterProps {
  value?: DateRange | SimpleDateRange;
  onChange: (value?: DateRange | SimpleDateRange) => void;
  className?: string;
}

export const DateRangeFilter = ({ value, onChange, className }: DateRangeFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            className || "w-[240px] justify-start text-left font-normal bg-background",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {value.from.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })} - {value.to.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}
              </>
            ) : (
              <>{value.from.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}</>
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
          defaultMonth={(value as DateRange | SimpleDateRange)?.from}
          selected={value as DateRange}
          onSelect={(v: DateRange | Date | undefined) => {
            // Calendar onSelect for range returns DateRange | undefined
            // Normalize and forward to consumer
            onChange(v as DateRange | undefined);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

DateRangeFilter.displayName = "DateRangeFilter";
