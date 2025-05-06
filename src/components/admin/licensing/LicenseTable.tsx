
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Copy, 
  MoreHorizontal, 
  Calendar, 
  PauseCircle,
  User,
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";

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
};

type LicenseTableProps = {
  licenses: License[];
  loading: boolean;
  onCopyKey: (key: string) => void;
};

const LicenseTable: React.FC<LicenseTableProps> = ({ licenses, loading, onCopyKey }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'expiring-soon':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
      case 'unassigned':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Unassigned</Badge>;
      case 'suspended':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Loading licenses...
              </TableCell>
            </TableRow>
          ) : licenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No licenses found. Create a new license to get started.
              </TableCell>
            </TableRow>
          ) : (
            licenses.map((license) => (
              <TableRow key={license.id}>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-1">
                    {license.license_key}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => onCopyKey(license.license_key)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{license.product_name}</TableCell>
                <TableCell>{license.tier?.name}</TableCell>
                <TableCell>
                  {license.assigned_to || (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{license.seats}</TableCell>
                <TableCell>{format(parseISO(license.expiry_date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{getStatusBadge(license.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onCopyKey(license.license_key)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copy Key</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Extend License</span>
                      </DropdownMenuItem>
                      {license.status === "active" && (
                        <DropdownMenuItem>
                          <PauseCircle className="mr-2 h-4 w-4" />
                          <span>Suspend License</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
