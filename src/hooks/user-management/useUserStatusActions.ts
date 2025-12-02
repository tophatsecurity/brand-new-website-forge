import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ADMIN_ACTIONS_URL = 'https://saveabkhpaemynlfcgcy.supabase.co/functions/v1/admin-user-actions';

export const useUserStatusActions = (fetchUsers: () => Promise<void>) => {
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

  const handleDisableUser = async (userId: string, isDisabled: boolean) => {
    try {
      await callAdminAction('ban', {
        userId,
        banDuration: isDisabled ? 'forever' : 'none'
      });
      
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

  const handleUpdateRole = async (userId: string, role: "admin" | "user" | "moderator") => {
    try {
      await callAdminAction('updateRole', { userId, role });
      
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

  return {
    handleDisableUser,
    handleResetPassword,
    handleUpdateRole
  };
};
