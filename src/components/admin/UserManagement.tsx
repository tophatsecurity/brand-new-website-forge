import React, { useState, useMemo } from 'react';
import UserList from './UserList';
import AddUserDialog from './dialogs/AddUserDialog';
import BulkAddUsersDialog from './dialogs/BulkAddUsersDialog';
import { useUserManagement } from '@/hooks/useUserManagement';

interface UserManagementProps {
  roleFilter?: string;
}

const UserManagement = ({ roleFilter }: UserManagementProps) => {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [bulkAddOpen, setBulkAddOpen] = useState(false);
  const {
    users,
    loading,
    handleAddUser,
    handleBulkAddUsers,
    handleApproveUser,
    handleRejectUser,
    handleDeleteUser,
    handleDisableUser,
    handleResetPassword,
    handleUpdateRole,
    handleEditUser,
    handleBulkUpdateRole,
    handleGrantPermission,
    handleRevokePermission,
  } = useUserManagement();

  // Filter users by role if roleFilter is provided
  const filteredUsers = useMemo(() => {
    if (!roleFilter) return users;
    return users.filter(user => {
      const userRole = user.user_metadata?.role || 'user';
      return userRole === roleFilter;
    });
  }, [users, roleFilter]);

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} 
          {roleFilter && ` with role "${roleFilter}"`}
        </div>
        <div className="flex gap-2">
          <BulkAddUsersDialog
            open={bulkAddOpen}
            onOpenChange={setBulkAddOpen}
            onBulkAddUsers={handleBulkAddUsers}
          />
          <AddUserDialog 
            open={addUserOpen} 
            onOpenChange={setAddUserOpen} 
            onAddUser={handleAddUser} 
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {roleFilter ? `No users with role "${roleFilter}" found.` : 'No users found.'}
            </div>
          ) : (
            <UserList 
              users={filteredUsers}
              onApproveUser={handleApproveUser}
              onRejectUser={handleRejectUser}
              onDeleteUser={handleDeleteUser}
              onDisableUser={handleDisableUser}
              onResetPassword={handleResetPassword}
              onUpdateRole={handleUpdateRole}
              onEditUser={handleEditUser}
              onBulkUpdateRole={handleBulkUpdateRole}
              onGrantPermission={handleGrantPermission}
              onRevokePermission={handleRevokePermission}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;
