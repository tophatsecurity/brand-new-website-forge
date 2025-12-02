import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ADMIN_ACTIONS_URL = 'https://saveabkhpaemynlfcgcy.supabase.co/functions/v1/admin-user-actions';

export const useUserActions = (fetchUsers: () => Promise<void>) => {
  const { toast } = useToast();

  const callAdminAction = async (action: string, payload: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session');

    const response = await fetch(ADMIN_ACTIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action, ...payload }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Action failed');
    }

    return response.json();
  };

  const handleAddUser = async (values: { email: string, password: string }) => {
    try {
      await callAdminAction('create', {
        email: values.email,
        password: values.password,
        metadata: { role: 'user', approved: false }
      });

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
      await callAdminAction('update', {
        userId,
        metadata: { approved: true }
      });

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
      await callAdminAction('update', {
        userId,
        metadata: { approved: false }
      });

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
      await callAdminAction('delete', { userId });

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
