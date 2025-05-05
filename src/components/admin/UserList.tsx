
import React from 'react';
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
import UserActions from './UserActions';
import UserPermissions from './UserPermissions';

interface UserListProps {
  users: any[];
  onApproveUser: (userId: string) => Promise<void>;
  onRejectUser: (userId: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onDisableUser: (userId: string, isDisabled: boolean) => Promise<void>;
  onResetPassword: (userId: string, email: string) => Promise<void>;
  onUpdateRole: (userId: string, role: string) => Promise<void>;
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
  onGrantPermission, 
  onRevokePermission 
}: UserListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
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
                <Badge variant="outline" className={user.user_metadata?.role === 'admin' 
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"}>
                  {user.user_metadata?.role || 'User'}
                </Badge>
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
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
