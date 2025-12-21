import React, { useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Users } from 'lucide-react';
import { APP_ROLES, AppRole } from './ChangeRoleDialog';

interface BulkRoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userIds: string[], role: AppRole) => Promise<void>;
  selectedUsers: any[];
}

const BulkRoleChangeDialog = ({
  open,
  onOpenChange,
  onConfirm,
  selectedUsers
}: BulkRoleChangeDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const userIds = selectedUsers.map(u => u.id);
      await onConfirm(userIds, selectedRole);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoleInfo = APP_ROLES.find(r => r.value === selectedRole);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Role Change
          </DialogTitle>
          <DialogDescription>
            Update the role for {selectedUsers.length} selected user{selectedUsers.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Selected Users</label>
            <ScrollArea className="h-32 border rounded-md p-2">
              <div className="space-y-1">
                {selectedUsers.map((user) => {
                  const currentRole = user.user_metadata?.role || 'user';
                  const roleInfo = APP_ROLES.find(r => r.value === currentRole);
                  return (
                    <div key={user.id} className="flex items-center justify-between text-sm py-1">
                      <span className="truncate">{user.email}</span>
                      <Badge variant="outline" className={roleInfo?.color || 'bg-muted'}>
                        {roleInfo?.label || currentRole}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Role for All</label>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
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
              <strong>Warning:</strong> You are about to grant admin access to {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkRoleChangeDialog;
