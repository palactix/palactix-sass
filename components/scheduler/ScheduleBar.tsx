import { useFormContext, useWatch } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
import { DateTimePicker } from "./DateTimePicker";

interface ScheduleBarProps {
  timezoneOptions: string[];
  rightActions?: ReactNode;
}

export function ScheduleBar({ timezoneOptions, rightActions }: ScheduleBarProps) {
  const { control, setValue } = useFormContext();
  const scheduledDate = useWatch({ control, name: "scheduled_date" }) as string;
  const scheduledTime = useWatch({ control, name: "scheduled_time" }) as string;
  const timezone = useWatch({ control, name: "timezone" }) as string;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <DateTimePicker
          dateValue={scheduledDate}
          timeValue={scheduledTime}
          onDateChange={(value) => setValue("scheduled_date", value, { shouldDirty: true })}
          onTimeChange={(value) => setValue("scheduled_time", value, { shouldDirty: true })}
        />
        <Select value={timezone} onValueChange={(value) => setValue("timezone", value, { shouldDirty: true })}>
          <SelectTrigger className="h-9 w-44">
            <SelectValue placeholder="Timezone" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {timezoneOptions.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <Separator orientation="vertical" className="h-8" />
        {rightActions}
      </div>
    </div>
  );
}
