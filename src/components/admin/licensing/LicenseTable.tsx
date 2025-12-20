
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
import { User, Calendar, Server, Network } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  max_hosts: number | null;
  allowed_networks: string[];
  concurrent_sessions: number;
  usage_hours_limit: number | null;
};

type LicenseTableProps = {
  licenses: License[];
  loading: boolean;
  onCopyKey: (key: string) => void;
};

const LicenseTable: React.FC<LicenseTableProps> = ({ licenses, loading, onCopyKey }) => {
  const colSpan = 10; // Total number of columns in the table

  const renderConstraints = (license: License) => {
    const hasConstraints = license.max_hosts || license.allowed_networks?.length > 0;
    
    if (!hasConstraints) {
      return <span className="text-muted-foreground text-xs">No limits</span>;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              {license.max_hosts && (
                <div className="flex items-center text-xs">
                  <Server className="h-3 w-3 mr-1" />
                  {license.max_hosts}
                </div>
              )}
              {license.allowed_networks?.length > 0 && (
                <div className="flex items-center text-xs">
                  <Network className="h-3 w-3 mr-1" />
                  {license.allowed_networks.length}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1 text-xs">
              {license.max_hosts && <p><strong>Max Hosts:</strong> {license.max_hosts}</p>}
              {license.concurrent_sessions > 1 && <p><strong>Concurrent Sessions:</strong> {license.concurrent_sessions}</p>}
              {license.usage_hours_limit && <p><strong>Usage Limit:</strong> {license.usage_hours_limit} hours</p>}
              {license.allowed_networks?.length > 0 && (
                <div>
                  <strong>Networks:</strong>
                  <ul className="mt-1">
                    {license.allowed_networks.map(net => <li key={net}>{net}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

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
            <TableHead>Constraints</TableHead>
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
                <TableCell>{renderConstraints(license)}</TableCell>
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
