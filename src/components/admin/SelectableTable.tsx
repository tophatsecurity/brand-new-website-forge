
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BulkActionBar from "./BulkActionBar";

interface BulkAction {
  value: string;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface Column<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface SelectableTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  bulkActions: BulkAction[];
  onBulkAction: (action: string, selectedIds: string[]) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  isProcessingBulkAction?: boolean;
}

function SelectableTable<T extends { id: string }>({
  data,
  columns,
  bulkActions,
  onBulkAction,
  loading = false,
  emptyState,
  isProcessingBulkAction = false,
}: SelectableTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    onBulkAction(action, selectedRows);
  };

  return (
    <div>
      <BulkActionBar
        selectedItems={selectedRows}
        actions={bulkActions}
        onAction={handleBulkAction}
        isProcessing={isProcessingBulkAction}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  disabled={data.length === 0 || loading}
                />
              </TableHead>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  {emptyState || "No data found."}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className={selectedRows.includes(item.id) ? "bg-accent/50" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={() => handleSelectRow(item.id)}
                      aria-label={`Select row ${item.id}`}
                    />
                  </TableCell>
                  {columns.map((column, columnIndex) => (
                    <TableCell key={columnIndex}>
                      {column.cell 
                        ? column.cell(item)
                        : column.accessorKey 
                          ? String(item[column.accessorKey] || '')
                          : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default SelectableTable;
