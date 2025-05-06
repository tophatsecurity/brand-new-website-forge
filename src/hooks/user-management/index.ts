
import { useUserFetch } from './useUserFetch';
import { useUserActions } from './useUserActions';
import { useUserStatusActions } from './useUserStatusActions';
import { useUserPermissions } from './useUserPermissions';
import { User, AddUserValues } from './types';

export type { User, AddUserValues };

export const useUserManagement = () => {
  const { users, loading, fetchUsers } = useUserFetch();
  const { handleAddUser, handleApproveUser, handleRejectUser, handleDeleteUser } = useUserActions(fetchUsers);
  const { handleDisableUser, handleResetPassword, handleUpdateRole } = useUserStatusActions(fetchUsers);
  const { handleGrantPermission, handleRevokePermission } = useUserPermissions(fetchUsers);

  return {
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
  };
};
