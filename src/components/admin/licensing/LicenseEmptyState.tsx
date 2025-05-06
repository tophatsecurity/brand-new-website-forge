
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";

interface LicenseEmptyStateProps {
  loading: boolean;
  colSpan: number;
}

const LicenseEmptyState: React.FC<LicenseEmptyStateProps> = ({ loading, colSpan }) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center py-8">
          Loading licenses...
        </TableCell>
      </TableRow>
    );
  }
  
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8">
        No licenses found. Create a new license to get started.
      </TableCell>
    </TableRow>
  );
};

export default LicenseEmptyState;
