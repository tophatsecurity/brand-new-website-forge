import React from 'react';
import { format, parseISO } from 'date-fns';
import { Copy, Key, User, Calendar, Server, Network, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import LicenseStatusBadge from './LicenseStatusBadge';

type License = {
  id: string;
  license_key: string;
  product_name: string;
  tier: { name: string };
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
  activation_date?: string | null;
};

interface ViewLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: License | null;
  onCopyKey: (key: string) => void;
}

const ViewLicenseDialog: React.FC<ViewLicenseDialogProps> = ({
  open,
  onOpenChange,
  license,
  onCopyKey
}) => {
  if (!license) return null;

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: any }) => (
    <div className="flex items-start justify-between py-2">
      <span className="text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            License Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* License Key */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">License Key</span>
              <Button variant="ghost" size="sm" onClick={() => onCopyKey(license.license_key)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="font-mono text-sm mt-1 break-all">{license.license_key}</p>
          </div>

          <Separator />

          {/* Basic Info */}
          <div>
            <h4 className="font-medium mb-2">Basic Information</h4>
            <div className="space-y-1">
              <InfoRow label="Product" value={license.product_name} />
              <InfoRow label="Tier" value={license.tier?.name || 'N/A'} />
              <InfoRow 
                label="Status" 
                value={<LicenseStatusBadge status={license.status} />} 
              />
              <InfoRow 
                label="Assigned To" 
                value={license.assigned_to || <span className="text-muted-foreground italic">Unassigned</span>}
                icon={User}
              />
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div>
            <h4 className="font-medium mb-2">Dates</h4>
            <div className="space-y-1">
              <InfoRow 
                label="Created" 
                value={format(parseISO(license.created_at), 'MMM dd, yyyy')}
                icon={Calendar}
              />
              <InfoRow 
                label="Expiry" 
                value={format(parseISO(license.expiry_date), 'MMM dd, yyyy')}
                icon={Calendar}
              />
              {license.last_active && (
                <InfoRow 
                  label="Last Active" 
                  value={format(parseISO(license.last_active), 'MMM dd, yyyy HH:mm')}
                  icon={Clock}
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Limits & Constraints */}
          <div>
            <h4 className="font-medium mb-2">Limits & Constraints</h4>
            <div className="space-y-1">
              <InfoRow label="Seats" value={license.seats} icon={Users} />
              <InfoRow 
                label="Max Hosts" 
                value={license.max_hosts || 'Unlimited'} 
                icon={Server}
              />
              <InfoRow 
                label="Concurrent Sessions" 
                value={license.concurrent_sessions || 1} 
              />
              {license.usage_hours_limit && (
                <InfoRow 
                  label="Usage Hours Limit" 
                  value={`${license.usage_hours_limit} hours`}
                  icon={Clock}
                />
              )}
            </div>
          </div>

          {/* Networks */}
          {license.allowed_networks?.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Allowed Networks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {license.allowed_networks.map((net) => (
                    <Badge key={net} variant="outline" className="font-mono text-xs">
                      {net}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Features */}
          {license.features?.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {license.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Add-ons */}
          {license.addons?.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Add-ons</h4>
                <div className="flex flex-wrap gap-2">
                  {license.addons.map((addon) => (
                    <Badge key={addon} variant="outline">
                      {addon}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLicenseDialog;
