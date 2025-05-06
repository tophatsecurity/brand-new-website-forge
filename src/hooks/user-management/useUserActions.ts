
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserActions = (fetchUsers: () => Promise<void>) => {
  const { toast } = useToast();

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

  return {
    handleAddUser,
    handleApproveUser,
    handleRejectUser,
    handleDeleteUser
  };
};
