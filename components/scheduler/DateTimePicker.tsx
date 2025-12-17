import { useCallback, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface DateTimePickerProps {
  dateValue: string;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

export function DateTimePicker({ dateValue, timeValue, onDateChange, onTimeChange }: DateTimePickerProps) {
  const parsedDate = useMemo(() => (dateValue ? new Date(dateValue + 'T12:00:00') : undefined), [dateValue]);
  const [open, setOpen] = useState(false);

  const handleDateSelect = useCallback((next: Date | undefined) => {
    if (!next) return;
    const localDate = next.toLocaleDateString('en-CA');
    onDateChange(localDate);
    setOpen(false);
  }, [onDateChange]);

  const handleTimeChange = useCallback((value: string) => {
    onTimeChange(value);
  }, [onTimeChange]);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal h-9 w-36", !dateValue && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {parsedDate ? format(parsedDate, "PP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-auto" align="start">
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={handleDateSelect}
            locale={enUS}
          />
        </PopoverContent>
      </Popover>

      <div className="relative">
        <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="time"
          value={timeValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="pl-8 h-9 w-28"
        />
      </div>
    </div>
  );
}
