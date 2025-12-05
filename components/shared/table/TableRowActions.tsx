import React, { memo } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowAction<T> {
  label: string | ((item: T) => string);
  onClick: (item: T) => void;
  className?: string;
  separator?: boolean;
  hidden?: (item: T) => boolean;
}

interface TableRowActionsProps<T> {
  row: T;
  actions: RowAction<T>[];
}

// We use a generic component here, but for memoization to work effectively with generics,
// we need to be careful. React.memo works with generics.
const TableRowActionsComponent = <T,>({ row, actions }: TableRowActionsProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions.map((action, index) => {
          if (action.hidden && action.hidden(row)) return null;
          
          const label = typeof action.label === 'function' ? action.label(row) : action.label;

          return (
            <React.Fragment key={index}>
              {action.separator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => action.onClick(row)}
                className={action.className}
              >
                {label}
              </DropdownMenuItem>
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Casting to any to avoid complex generic memoization issues in TypeScript if needed, 
// but usually this is fine.
export const TableRowActions = memo(TableRowActionsComponent) as typeof TableRowActionsComponent;
