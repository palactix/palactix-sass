import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatWidgetProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  valueClassName?: string;
  isLoading?: boolean;
}

export function StatWidget({
  title,
  value,
  icon: Icon,
  trend,
  valueClassName,
  isLoading = false,
}: StatWidgetProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Icon className="h-4 w-4" />
              <span>{title}</span>
            </div>
            <div className={cn("text-3xl font-bold", valueClassName)}>
              {value}
            </div>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
