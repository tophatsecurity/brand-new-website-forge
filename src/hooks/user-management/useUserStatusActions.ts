
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useUserStatusActions = (fetchUsers: () => Promise<void>) => {
  const { toast } = useToast();

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

  return {
    handleDisableUser,
    handleResetPassword,
    handleUpdateRole
  };
};
