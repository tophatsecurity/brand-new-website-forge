import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Users, Briefcase, Headphones, UserCheck } from 'lucide-react';

// All roles from the app_role enum
const APP_ROLES = [
  { value: 'user', label: 'User', description: 'Standard user with basic access', icon: User, color: 'bg-blue-100 text-blue-800' },
  { value: 'admin', label: 'Admin', description: 'Full administrative access', icon: Shield, color: 'bg-purple-100 text-purple-800' },
  { value: 'moderator', label: 'Moderator', description: 'Content and user moderation', icon: UserCheck, color: 'bg-green-100 text-green-800' },
  { value: 'var', label: 'VAR', description: 'Value Added Reseller partner', icon: Briefcase, color: 'bg-orange-100 text-orange-800' },
  { value: 'customer_rep', label: 'Customer Rep', description: 'Customer support representative', icon: Headphones, color: 'bg-cyan-100 text-cyan-800' },
  { value: 'customer', label: 'Customer', description: 'Licensed customer account', icon: Users, color: 'bg-indigo-100 text-indigo-800' },
] as const;

export type AppRole = typeof APP_ROLES[number]['value'];

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userEmail: string;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  currentRole?: string;
}

const ChangeRoleDialog = ({
  open,
  onOpenChange,
  onConfirm,
  userEmail,
  selectedRole,
  onRoleChange,
  currentRole
}: ChangeRoleDialogProps) => {
  const currentRoleInfo = APP_ROLES.find(r => r.value === currentRole);
  const selectedRoleInfo = APP_ROLES.find(r => r.value === selectedRole);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for <span className="font-medium">{userEmail}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {currentRoleInfo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Current role:</span>
              <Badge variant="outline" className={currentRoleInfo.color}>
                <currentRoleInfo.icon className="h-3 w-3 mr-1" />
                {currentRoleInfo.label}
              </Badge>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">New Role</label>
            <Select value={selectedRole} onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role">
                  {selectedRoleInfo && (
                    <div className="flex items-center gap-2">
                      <selectedRoleInfo.icon className="h-4 w-4" />
                      {selectedRoleInfo.label}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {APP_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <role.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">{role.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedRole === 'admin' && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
              <strong>Warning:</strong> Admin role grants full system access including user management and configuration.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={selectedRole === currentRole}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRoleDialog;
export { APP_ROLES };
