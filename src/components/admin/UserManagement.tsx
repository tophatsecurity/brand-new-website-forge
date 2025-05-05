
import React, { useState } from 'react';
import UserList from './UserList';
import AddUserDialog from './dialogs/AddUserDialog';
import { useUserManagement } from '@/hooks/useUserManagement';

const UserManagement = () => {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const {
    users,
    loading,
    handleAddUser,
    handleApproveUser,
    handleRejectUser,
    handleDeleteUser,
    handleDisableUser,
    handleResetPassword,
    handleUpdateRole,
    handleGrantPermission,
    handleRevokePermission,
  } = useUserManagement();

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <AddUserDialog 
          open={addUserOpen} 
          onOpenChange={setAddUserOpen} 
          onAddUser={handleAddUser} 
        />
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <>
          {users.length === 0 ? (
            <div className="text-center py-8">No users found.</div>
          ) : (
            <UserList 
              users={users}
              onApproveUser={handleApproveUser}
              onRejectUser={handleRejectUser}
              onDeleteUser={handleDeleteUser}
              onDisableUser={handleDisableUser}
              onResetPassword={handleResetPassword}
              onUpdateRole={handleUpdateRole}
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
