
import React, { useState } from 'react';
import UserDropdownActions from './actions/UserDropdownActions';
import ApprovalActions from './actions/ApprovalActions';
import DeleteUserDialog from './dialogs/DeleteUserDialog';
import DisableUserDialog from './dialogs/DisableUserDialog';
import ChangeRoleDialog from './dialogs/ChangeRoleDialog';

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

  const handleDisableUser = () => {
    onDisableUser(user.id, !user.banned_until);
  };

  const handleResetPassword = () => {
    onResetPassword(user.id, user.email);
  };

  const handleDeleteUser = () => {
    onDeleteUser(user.id);
  };

  return (
    <div className="flex items-center space-x-2">
      {!user.user_metadata?.approved && (
        <ApprovalActions 
          userId={user.id}
          onApproveUser={onApproveUser}
          onRejectUser={onRejectUser}
        />
      )}

      <UserDropdownActions 
        user={user}
        onResetPassword={handleResetPassword}
        onOpenRoleDialog={() => setOpenRoleDialog(true)}
        onOpenDisableDialog={() => setOpenDisableDialog(true)}
        onOpenDeleteDialog={() => setOpenDeleteDialog(true)}
      />

      <DeleteUserDialog 
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleDeleteUser}
        userEmail={user.email}
      />

      <DisableUserDialog 
        open={openDisableDialog}
        onOpenChange={setOpenDisableDialog}
        onConfirm={handleDisableUser}
        userEmail={user.email}
        isDisabled={!!user.banned_until}
      />

      <ChangeRoleDialog 
        open={openRoleDialog}
        onOpenChange={setOpenRoleDialog}
        onConfirm={handleRoleChange}
        userEmail={user.email}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />
    </div>
  );
};

export default UserActions;
