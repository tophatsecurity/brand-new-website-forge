
import React from 'react';
import { Badge } from "@/components/ui/badge";

type LicenseStatus = 'active' | 'expiring-soon' | 'expired' | 'unassigned' | 'suspended' | string;

interface LicenseStatusBadgeProps {
  status: LicenseStatus;
}

const LicenseStatusBadge: React.FC<LicenseStatusBadgeProps> = ({ status }) => {
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

export default LicenseStatusBadge;
