
import { supabase } from '@/integrations/supabase/client';
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
      // First update auth metadata
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role }
      });
      
      if (authError) throw authError;
      
      // Then update the user_roles table
      if (role === 'admin') {
        // Get the user's email first
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
        
        if (userError) throw userError;
        
        const userEmail = userData.user?.email;
        
        if (!userEmail) {
          throw new Error('User email not found');
        }
        
        // Promote user to admin using our custom function
        const { error: promoteError } = await supabase.rpc('promote_to_admin', { 
          user_email: userEmail 
        });
        
        if (promoteError) throw promoteError;
      } else {
        // For other roles, remove admin role if exists and add the new role
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
          
        if (deleteError) throw deleteError;
        
        // Insert the new role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role
          });
          
        if (insertError) throw insertError;
      }
      
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
