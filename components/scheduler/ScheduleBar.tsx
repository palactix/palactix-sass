import { useFormContext, useWatch } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { DateTimePicker } from "./DateTimePicker";
import { cn } from "@/lib/utils";

interface ScheduleBarProps {
  rightActions?: ReactNode;
}

export function ScheduleBar({ rightActions }: ScheduleBarProps) {
  const { control, setValue } = useFormContext();
  const scheduledDate = useWatch({ control, name: "scheduled_date" }) as string;
  const scheduledTime = useWatch({ control, name: "scheduled_time" }) as string;
  const timezone = useWatch({ control, name: "timezone" }) as string;
  const [open, setOpen] = useState(false);

  const defaultTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const timezoneOptions = useMemo(() => {
    try {
      // Get all available IANA timezones
      const allTimezones = Intl.supportedValuesOf('timeZone');
      
      // Ensure user's timezone is included
      if (!allTimezones.includes(defaultTimezone)) {
        return [...allTimezones, defaultTimezone].sort();
      }
      
      return allTimezones.sort();
    } catch (error) {
      // Fallback to common timezones if supportedValuesOf is not available
      return [
        "UTC",
        "America/Los_Angeles",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Phoenix",
        "America/Toronto",
        "America/Vancouver",
        "America/Mexico_City",
        "America/Sao_Paulo",
        "America/Buenos_Aires",
        "Europe/London",
        "Europe/Paris",
        "Europe/Berlin",
        "Europe/Rome",
        "Europe/Madrid",
        "Europe/Amsterdam",
        "Europe/Brussels",
        "Europe/Vienna",
        "Europe/Stockholm",
        "Europe/Warsaw",
        "Europe/Prague",
        "Europe/Budapest",
        "Europe/Athens",
        "Europe/Istanbul",
        "Europe/Moscow",
        "Africa/Cairo",
        "Africa/Johannesburg",
        "Africa/Lagos",
        "Africa/Nairobi",
        "Asia/Dubai",
        "Asia/Kolkata",
        "Asia/Mumbai",
        "Asia/Karachi",
        "Asia/Dhaka",
        "Asia/Bangkok",
        "Asia/Singapore",
        "Asia/Kuala_Lumpur",
        "Asia/Jakarta",
        "Asia/Manila",
        "Asia/Hong_Kong",
        "Asia/Shanghai",
        "Asia/Beijing",
        "Asia/Tokyo",
        "Asia/Seoul",
        "Asia/Taipei",
        "Australia/Sydney",
        "Australia/Melbourne",
        "Australia/Brisbane",
        "Australia/Perth",
        "Pacific/Auckland",
        "Pacific/Fiji",
        "Pacific/Honolulu",
        defaultTimezone,
      ].filter((v, idx, arr) => arr.indexOf(v) === idx).sort();
    }
  }, [defaultTimezone]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <DateTimePicker
          dateValue={scheduledDate}
          timeValue={scheduledTime}
          onDateChange={(value) => setValue("scheduled_date", value, { shouldDirty: true })}
          onTimeChange={(value) => setValue("scheduled_time", value, { shouldDirty: true })}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-9 w-44 justify-between text-sm font-normal"
            >
              {timezone || "Select timezone..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search timezone..." />
              <CommandList>
                <CommandEmpty>No timezone found.</CommandEmpty>
                <CommandGroup>
                  {timezoneOptions.map((tz) => (
                    <CommandItem
                      key={tz}
                      value={tz}
                      onSelect={(currentValue) => {
                        setValue("timezone", currentValue, { shouldDirty: true });
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          timezone === tz ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tz}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-3">
        <Separator orientation="vertical" className="h-8" />
        {rightActions}
      </div>
    </div>
  );
}
