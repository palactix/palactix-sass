import React, { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string | React.ReactNode;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  sortConfig?: SortConfig | null;
  onSort?: (key: string) => void;
  selectedRows?: (string | number)[];
  onRowSelect?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  isLoading?: boolean;
}

interface DataTableRowProps<T> {
  item: T;
  columns: Column<T>[];
  isSelected: boolean;
  onRowSelect?: (id: string | number, checked: boolean) => void;
  keyField: keyof T;
}

// Generic Row Component to preserve T through memo
function DataTableRowBase<T>({ 
  item, 
  columns, 
  isSelected, 
  onRowSelect, 
  keyField 
}: DataTableRowProps<T>) {

  const id = item[keyField] as unknown as string | number;

  return (
    <TableRow className={isSelected ? "bg-muted/50" : ""}>
      {onRowSelect && (
        <TableCell className="pl-4 w-10">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onRowSelect(id, checked as boolean)}
          />
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell key={column.key} className={column.className}>
          {column.render ? column.render(item) : (item as Record<string, unknown>)[column.key] as React.ReactNode}
        </TableCell>
      ))}
    </TableRow>
  );
}

const areRowsEqual = <T,>(prev: DataTableRowProps<T>, next: DataTableRowProps<T>) => {
  return (
    prev.isSelected === next.isSelected &&
    prev.item === next.item &&
    prev.columns === next.columns &&
    prev.onRowSelect === next.onRowSelect
  );
};

type DataTableRowComponent = <T>(props: DataTableRowProps<T>) => React.ReactElement | null;

const DataTableRow = memo(
  DataTableRowBase as <T>(props: DataTableRowProps<T>) => React.ReactElement | null,
  areRowsEqual as <T>(prev: DataTableRowProps<T>, next: DataTableRowProps<T>) => boolean
) as DataTableRowComponent & { displayName?: string };

DataTableRow.displayName = "DataTableRow";

// Generic DataTable Component
const DataTableComponent = <T,>({
  data,
  columns,
  keyField,
  sortConfig,
  onSort,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  isLoading
}: DataTableProps<T>) => {
  
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const isPartiallySelected = selectedRows.length > 0 && selectedRows.length < data.length;

  if (isLoading) {
    return null; 
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelectAll && (
            <TableHead className="w-10 pl-4">
              <Checkbox 
                checked={allSelected || (isPartiallySelected ? "indeterminate" : false)}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
          )}
          {columns.map((column) => (
            <TableHead 
              key={column.key} 
              className={`${column.headerClassName} ${column.sortable ? "cursor-pointer select-none" : ""}`}
              onClick={() => column.sortable && onSort && onSort(column.key)}
            >
              <div className="flex items-center gap-1">
                {column.label}
                {column.sortable && sortConfig?.key === column.key && (
                  sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                )}
                {column.sortable && sortConfig?.key !== column.key && (
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length + (onSelectAll ? 1 : 0)} className="h-24 text-center">
              No results found.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => {
            const id = item[keyField] as unknown as string | number;
            return (
              <DataTableRow
                key={id}
                item={item}
                columns={columns}
                keyField={keyField}
                isSelected={selectedRows.includes(id)}
                onRowSelect={onRowSelect}
              />
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;
