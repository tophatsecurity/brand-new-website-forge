import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import UserActions from './UserActions';
import UserPermissions from './UserPermissions';
import BulkRoleChangeDialog from './dialogs/BulkRoleChangeDialog';
import { APP_ROLES, AppRole } from './dialogs/ChangeRoleDialog';

interface UserListProps {
  users: any[];
  onApproveUser: (userId: string) => Promise<void>;
  onRejectUser: (userId: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onDisableUser: (userId: string, isDisabled: boolean) => Promise<void>;
  onResetPassword: (userId: string, email: string) => Promise<void>;
  onUpdateRole: (userId: string, role: string) => Promise<void>;
  onEditUser: (userId: string, metadata: any) => Promise<void>;
  onBulkUpdateRole: (userIds: string[], role: string) => Promise<void>;
  onGrantPermission: (userId: string, permission: string) => Promise<void>;
  onRevokePermission: (permissionId: string) => Promise<void>;
}

const UserList = ({ 
  users, 
  onApproveUser, 
  onRejectUser,
  onDeleteUser, 
  onDisableUser, 
  onResetPassword,
  onUpdateRole,
  onEditUser,
  onBulkUpdateRole,
  onGrantPermission, 
  onRevokePermission 
}: UserListProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkRoleDialogOpen, setBulkRoleDialogOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkRoleChange = async (userIds: string[], role: AppRole) => {
    await onBulkUpdateRole(userIds, role);
    setSelectedUsers([]);
  };

  const selectedUserObjects = users.filter(u => selectedUsers.includes(u.id));

  return (
    <div className="space-y-4">
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBulkRoleDialogOpen(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Change Role
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedUsers([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className={selectedUsers.includes(user.id) ? 'bg-muted/50' : ''}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                  />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.user_metadata?.first_name || user.user_metadata?.last_name ? (
                    <span>
                      {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'Unknown'}
                </TableCell>
                <TableCell>
                  {user.user_metadata?.approved ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Pending Approval
                    </Badge>
                  )}
                  {user.banned_until && (
                    <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                      Disabled
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {(() => {
                    const userRole = user.user_metadata?.role || 'user';
                    const roleInfo = APP_ROLES.find(r => r.value === userRole);
                    const RoleIcon = roleInfo?.icon;
                    return (
                      <Badge variant="outline" className={roleInfo?.color || "bg-blue-100 text-blue-800"}>
                        {RoleIcon && <RoleIcon className="h-3 w-3 mr-1" />}
                        {roleInfo?.label || userRole}
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <UserPermissions 
                    user={user}
                    onGrantPermission={onGrantPermission}
                    onRevokePermission={onRevokePermission}
                  />
                </TableCell>
                <TableCell>
                  <UserActions 
                    user={user}
                    onApproveUser={onApproveUser}
                    onRejectUser={onRejectUser}
                    onDeleteUser={onDeleteUser}
                    onDisableUser={onDisableUser}
                    onResetPassword={onResetPassword}
                    onUpdateRole={onUpdateRole}
                    onEditUser={onEditUser}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BulkRoleChangeDialog
        open={bulkRoleDialogOpen}
        onOpenChange={setBulkRoleDialogOpen}
        onConfirm={handleBulkRoleChange}
        selectedUsers={selectedUserObjects}
      />
    </div>
  );
};

export default UserList;
