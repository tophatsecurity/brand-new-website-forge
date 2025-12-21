
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import LicenseStatusBadge from './LicenseStatusBadge';
import LicenseFeatureDisplay from './LicenseFeatureDisplay';
import LicenseActionMenu from './LicenseActionMenu';
import LicenseKeyCell from './LicenseKeyCell';
import LicenseEmptyState from './LicenseEmptyState';
import BulkActionBar from '../BulkActionBar';
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
  onBulkAction?: (action: string, licenseIds: string[]) => void;
};

const BULK_ACTIONS = [
  { value: 'activate', label: 'Activate', variant: 'default' as const },
  { value: 'suspend', label: 'Suspend', variant: 'secondary' as const },
  { value: 'revoke', label: 'Revoke', variant: 'destructive' as const },
  { value: 'extend_30', label: 'Extend 30 Days', variant: 'outline' as const },
  { value: 'extend_90', label: 'Extend 90 Days', variant: 'outline' as const },
  { value: 'export', label: 'Export Selected', variant: 'outline' as const },
];

const LicenseTable: React.FC<LicenseTableProps> = ({ licenses, loading, onCopyKey, onBulkAction }) => {
  const colSpan = 11; // Total number of columns in the table (added checkbox column)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(licenses.map(l => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (onBulkAction) {
      setIsProcessing(true);
      await onBulkAction(action, selectedIds);
      setIsProcessing(false);
      setSelectedIds([]);
    }
  };

  const allSelected = licenses.length > 0 && selectedIds.length === licenses.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < licenses.length;

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
    <div className="space-y-4">
      <BulkActionBar
        selectedItems={selectedIds}
        actions={BULK_ACTIONS}
        onAction={handleBulkAction}
        isProcessing={isProcessing}
      />
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) (el as any).indeterminate = someSelected;
                  }}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
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
                <TableRow key={license.id} className={selectedIds.includes(license.id) ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(license.id)}
                      onCheckedChange={(checked) => handleSelectOne(license.id, !!checked)}
                      aria-label={`Select license ${license.license_key}`}
                    />
                  </TableCell>
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
    </div>
  );
};

export default LicenseTable;
