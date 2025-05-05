
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  AlertCircle,
  UserCheck,
  UserX,
  LockReset,
  UserCog,
  MoreHorizontal
} from 'lucide-react';

interface UserActionsProps {
  user: any;
  onApproveUser: (userId: string) => Promise<void>;
  onRejectUser: (userId: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onDisableUser: (userId: string, isDisabled: boolean) => Promise<void>;
  onResetPassword: (userId: string, email: string) => Promise<void>;
  onUpdateRole: (userId: string, role: string) => Promise<void>;
}

const UserActions = ({ 
  user, 
  onApproveUser, 
  onRejectUser,
  onDeleteUser, 
  onDisableUser, 
  onResetPassword,
  onUpdateRole
}: UserActionsProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDisableDialog, setOpenDisableDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.user_metadata?.role || 'user');

  const handleRoleChange = async () => {
    await onUpdateRole(user.id, selectedRole);
    setOpenRoleDialog(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {!user.user_metadata?.approved && (
        <>
          <Button
            variant="default"
            size="sm"
            className="flex items-center"
            onClick={() => onApproveUser(user.id)}
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center"
            onClick={() => onRejectUser(user.id)}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setOpenRoleDialog(true)}>
            <UserCog className="h-4 w-4 mr-2" />
            Change Role
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onResetPassword(user.id, user.email)}>
            <LockReset className="h-4 w-4 mr-2" />
            Reset Password
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setOpenDisableDialog(true)}>
            {user.banned_until ? (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Enable User
              </>
            ) : (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Disable User
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setOpenDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user {user.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDeleteUser(user.id);
                setOpenDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable User Dialog */}
      <Dialog open={openDisableDialog} onOpenChange={setOpenDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {user.banned_until ? 'Enable User' : 'Disable User'}
            </DialogTitle>
            <DialogDescription>
              {user.banned_until 
                ? `Are you sure you want to enable ${user.email}?` 
                : `Are you sure you want to disable ${user.email}? This will prevent them from logging in.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDisableDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={user.banned_until ? "default" : "destructive"}
              onClick={() => {
                onDisableUser(user.id, !user.banned_until);
                setOpenDisableDialog(false);
              }}
            >
              {user.banned_until ? 'Enable' : 'Disable'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={openRoleDialog} onOpenChange={setOpenRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change the role for {user.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserActions;
