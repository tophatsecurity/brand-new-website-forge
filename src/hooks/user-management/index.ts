import { useUserFetch } from './useUserFetch';
import { useUserActions } from './useUserActions';
import { useUserStatusActions } from './useUserStatusActions';
import { useUserPermissions } from './useUserPermissions';
import { User, AddUserValues } from './types';

export type { User, AddUserValues };

export const useUserManagement = () => {
  const { users, loading, fetchUsers } = useUserFetch();
  const { handleAddUser, handleBulkAddUsers, handleApproveUser, handleRejectUser, handleDeleteUser } = useUserActions(fetchUsers);
  const { handleDisableUser, handleResetPassword, handleUpdateRole, handleEditUser, handleBulkUpdateRole } = useUserStatusActions(fetchUsers);
  const { handleGrantPermission, handleRevokePermission } = useUserPermissions(fetchUsers);

  return {
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
  };
};
