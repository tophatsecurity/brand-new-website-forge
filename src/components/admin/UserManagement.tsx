
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import UserList from './UserList';
import { User } from '@supabase/supabase-js';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
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

      setUsers(
        users.map((user: any) => ({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
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
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: 'Error approving user',
        description: 'Please try again later.',
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
    } catch (error) {
      console.error(error);
      toast({
        title: "Error granting permission",
        description: String(error),
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
    } catch (error) {
      toast({
        title: "Error revoking permission",
        description: String(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
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

