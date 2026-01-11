import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { DashboardAlert } from "@/features/organization/types/dashboard.types";

interface AlertWidgetProps {
  alerts: DashboardAlert[];
  onReviewClick?: () => void;
}

export function AlertWidget({ alerts, onReviewClick }: AlertWidgetProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Alerts & Attention Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="flex-1">{alert.message}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onReviewClick}>
          Review Issues
        </Button>
      </CardContent>
    </Card>
  );
}
