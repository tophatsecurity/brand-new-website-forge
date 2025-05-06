
import React from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import LicenseStatusBadge from './LicenseStatusBadge';
import LicenseFeatureDisplay from './LicenseFeatureDisplay';
import LicenseActionMenu from './LicenseActionMenu';
import LicenseKeyCell from './LicenseKeyCell';
import LicenseEmptyState from './LicenseEmptyState';
import { User, Calendar } from "lucide-react";

type License = {
  id: string;
  license_key: string;
  product_name: string;
  tier: {
    name: string;
  };
  assigned_to: string | null;
  expiry_date: string;
  status: string;
  seats: number;
  created_at: string;
  last_active: string | null;
  features: string[];
  addons: string[];
};

type LicenseTableProps = {
  licenses: License[];
  loading: boolean;
  onCopyKey: (key: string) => void;
};

const LicenseTable: React.FC<LicenseTableProps> = ({ licenses, loading, onCopyKey }) => {
  const colSpan = 9; // Total number of columns in the table

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">License Key</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Features & Add-ons</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading || licenses.length === 0 ? (
            <LicenseEmptyState loading={loading} colSpan={colSpan} />
          ) : (
            licenses.map((license) => (
              <TableRow key={license.id}>
                <TableCell className="font-mono text-xs">
                  <LicenseKeyCell 
                    licenseKey={license.license_key}
                    onCopyKey={onCopyKey}
                  />
                </TableCell>
                <TableCell>{license.product_name}</TableCell>
                <TableCell>{license.tier?.name}</TableCell>
                <TableCell>
                  {license.assigned_to ? (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {license.assigned_to}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{license.seats}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {format(parseISO(license.expiry_date), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <LicenseStatusBadge status={license.status} />
                </TableCell>
                <TableCell>
                  <LicenseFeatureDisplay 
                    features={license.features} 
                    addons={license.addons} 
                  />
                </TableCell>
                <TableCell className="text-right">
                  <LicenseActionMenu 
                    licenseKey={license.license_key}
                    status={license.status}
                    onCopyKey={onCopyKey}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LicenseTable;
