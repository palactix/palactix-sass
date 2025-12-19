import React, { memo } from "react";
import { Button } from "@/components/ui/button";

export interface BulkAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  icon?: React.ReactNode;
}

interface TableBulkActionsProps {
  selectedCount: number;
  actions: BulkAction[];
}

export const TableBulkActions = memo(({ selectedCount, actions }: TableBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <Button 
          key={index} 
          variant={action.variant || "default"} 
          size="sm" 
          onClick={action.onClick}
        >
          {action.icon}
          {action.label} ({selectedCount})
        </Button>
      ))}
    </div>
  );
});

TableBulkActions.displayName = "TableBulkActions";
