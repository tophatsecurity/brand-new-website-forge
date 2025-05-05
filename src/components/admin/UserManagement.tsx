
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import UserList from './UserList';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const addUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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

  const handleAddUser = async (values: z.infer<typeof addUserSchema>) => {
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

      form.reset();
      setAddUserOpen(false);
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
      // If disabling, ban until far future date, otherwise set to null to enable
      const banUntil = isDisabled ? '2100-01-01' : null;
      
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        banned_until: banUntil
      });
      
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

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. User will be created with pending approval status.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Min. 8 characters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
