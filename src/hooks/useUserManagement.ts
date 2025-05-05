
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  user_metadata: any;
  banned_until: string | null;
  createdAt: string;
  permissions: any[];
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;

      const { data: perms } = await supabase
        .from("user_permissions")
        .select("*");

      console.log('Fetched users:', users);

      setUsers(
        users.map((user: any) => ({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          banned_until: user.banned_until,
          createdAt: user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown',
          permissions: perms
            ? perms.filter((p) => p.user_id === user.id)
            : [],
        }))
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (values: { email: string, password: string }) => {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
        user_metadata: { role: 'user', approved: false }
      });

      if (error) throw error;

      toast({
        title: 'User created successfully',
        description: 'User has been created with a pending approval status.',
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error creating user',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { approved: true }
      });
      if (error) throw error;
      toast({
        title: 'User approved',
        description: 'The user can now access restricted content.',
      });
      fetchUsers();
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: 'Error approving user',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { approved: false }
      });
      if (error) throw error;
      toast({
        title: 'User rejected',
        description: 'The user access has been denied.',
      });
      fetchUsers();
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: 'Error rejecting user',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      toast({
        title: 'User deleted',
        description: 'The user has been permanently deleted.',
      });
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error deleting user',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDisableUser = async (userId: string, isDisabled: boolean) => {
    try {
      let userAttributes: any = {};
      
      if (isDisabled) {
        // Set a future date to effectively ban the user
        const futureDate = new Date();
        futureDate.setFullYear(2100);
        userAttributes.ban_duration = 'forever';
      } else {
        // To unban, we don't set a ban_duration
      }
      
      const { error } = await supabase.auth.admin.updateUserById(userId, userAttributes);
      
      if (error) throw error;
      
      toast({
        title: isDisabled ? 'User disabled' : 'User enabled',
        description: isDisabled 
          ? 'The user has been disabled and cannot log in.' 
          : 'The user has been enabled and can now log in.',
      });
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error updating user status',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async (userId: string, email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password reset email sent',
        description: `A password reset link has been sent to ${email}.`,
      });
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast({
        title: 'Error sending password reset',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role }
      });
      
      if (error) throw error;
      
      toast({
        title: 'User role updated',
        description: `The user's role has been changed to ${role}.`,
      });
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error updating user role',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleGrantPermission = async (userId: string, permission: string) => {
    try {
      const { error } = await supabase.from("user_permissions").insert([{
        user_id: userId,
        permission,
        granted_by: null,
      }]);
      if (error) throw error;
      toast({ title: `Granted ${permission} permission` });
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error granting permission",
        description: error.message || "An error occurred",
        variant: 'destructive',
      });
    }
  };

  const handleRevokePermission = async (permissionId: string) => {
    try {
      const { error } = await supabase.from("user_permissions").delete().eq("id", permissionId);
      if (error) throw error;
      toast({ title: "Permission revoked" });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error revoking permission",
        description: error.message || "An error occurred",
        variant: 'destructive',
      });
    }
  };

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
