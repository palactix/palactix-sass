import React, { memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TableContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

export const TableContainer = memo(({ children, header, footer, isLoading }: TableContainerProps) => {
  return (
    <Card>
      {header && <CardHeader className="p-4 sm:p-6">{header}</CardHeader>}
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer}
    </Card>
  );
});

TableContainer.displayName = "TableContainer";
