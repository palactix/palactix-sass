import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, Lock } from "lucide-react";
import { StepStatus } from "./types";

interface OnboardingStepProps {
  title: string;
  description: string;
  status: StepStatus;
  actionLabel: string;
  actionHref: string;
  secondaryText?: string;
  notice?: string;
  isRequired: boolean;
  isBlocked?: boolean;
}

const statusConfig = {
  "not-started": {
    icon: Clock,
    iconColor: "text-muted-foreground",
    bgColor: "bg-muted/50",
    label: "Not started",
    labelColor: "text-muted-foreground",
  },
  "in-progress": {
    icon: Clock,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    label: "In progress",
    labelColor: "text-blue-600",
  },
  completed: {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    label: "Completed",
    labelColor: "text-green-600",
  },
  blocked: {
    icon: Lock,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    label: "Blocked",
    labelColor: "text-orange-600",
  },
  failed: {
    icon: AlertCircle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    label: "Verification failed",
    labelColor: "text-red-600",
  },
};

export function OnboardingStep({
  title,
  description,
  status,
  actionLabel,
  actionHref,
  secondaryText,
  notice,
  isRequired,
  isBlocked = false,
}: OnboardingStepProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isCompleted = status === "completed";
  const isActionDisabled = isBlocked || isCompleted;

  return (
    <div
      className={`rounded-lg border p-6 transition-colors ${
        isCompleted
          ? "border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {isRequired && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                Required
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
          <span className={`text-xs font-medium ${config.labelColor}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {secondaryText && (
            <p className="text-xs text-muted-foreground mb-2">
              {secondaryText}
            </p>
          )}
          {notice && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                {notice}
              </p>
            </div>
          )}
        </div>

        <Button
          asChild={!isActionDisabled}
          disabled={isActionDisabled}
          variant={isCompleted ? "outline" : "default"}
          size="sm"
        >
          {isActionDisabled ? (
            <span>{isCompleted ? "Completed" : actionLabel}</span>
          ) : (
            <Link href={actionHref}>{actionLabel}</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
