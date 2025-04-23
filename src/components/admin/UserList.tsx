
import React from 'react';
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
import { User } from '@supabase/supabase-js';

interface UserListProps {
  users: any[];
  onApproveUser: (userId: string) => Promise<void>;
  onGrantPermission: (userId: string, permission: string) => Promise<void>;
  onRevokePermission: (permissionId: string) => Promise<void>;
}

const UserList = ({ users, onApproveUser, onGrantPermission, onRevokePermission }: UserListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
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

