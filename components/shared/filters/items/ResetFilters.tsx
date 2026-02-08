import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface ResetFiltersProps {
  onReset: () => void;
  className?: string;
}

export const ResetFilters = ({ onReset, className }: ResetFiltersProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onReset}
      className={className || "gap-2 text-muted-foreground hover:text-foreground"}
    >
      <X className="h-4 w-4" />
      Reset
    </Button>
  );
};

ResetFilters.displayName = "ResetFilters";
