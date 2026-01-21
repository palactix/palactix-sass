"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { ApprovalInfo } from "../types";

export interface ApprovalBadgeProps {
  approval: ApprovalInfo;
}

export const ApprovalBadge = memo(function ApprovalBadge({
  approval,
}: ApprovalBadgeProps) {
  if (!approval.required) {
    return (
      <Badge variant="outline" className="gap-1">
        Not Required
      </Badge>
    );
  }

  const getApprovalConfig = () => {
    switch (approval.status) {
      case "approved":
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          variant: "default" as const,
          className: "bg-green-600 hover:bg-green-600",
          label: approval.approver
            ? `Approved by ${approval.approver.name}`
            : "Approved",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-3 w-3" />,
          variant: "destructive" as const,
          className: "",
          label: "Rejected",
        };
      case "pending":
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          variant: "secondary" as const,
          className: "border-amber-500 text-amber-700",
          label: approval.approver
            ? `Waiting for ${approval.approver.name}`
            : "Waiting for Approval",
        };
    }
  };

  const config = getApprovalConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={config.variant} className={`gap-1 ${config.className}`}>
            {config.icon}
            {config.label}
          </Badge>
        </TooltipTrigger>
        {approval.reasons && approval.reasons.length > 0 && (
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">Required because:</p>
              <ul className="list-disc list-inside text-sm">
                {approval.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});
