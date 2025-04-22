
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

const permissionTypes = [
  { key: "downloads", label: "Downloads" },
  { key: "support", label: "Support" },
  { key: "admin", label: "Admin" }
];

const Admin = () => {
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

      const adminUser = users.find((user: User) => user.email === 'admin@tophatsecurity.com');
      
      if (adminUser) {
        console.log('Admin user found:', {
          id: adminUser.id,
          email: adminUser.email,
          metadata: adminUser.user_metadata
        });
      } else {
        console.log('Admin user not found in Supabase');
      }

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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <>
                {users.length === 0 ? (
                  <div className="text-center py-8">No users found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Registration Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Permissions</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.createdAt}</TableCell>
                            <TableCell>
                              {user.user_metadata?.approved ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  Approved
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                  Pending Approval
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {user.permissions.map(p => (
                                  <Badge key={p.id} className="bg-blue-50 text-blue-800 border-blue-200">
                                    {permissionTypes.find(pt => pt.key === p.permission)?.label || p.permission}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 px-1 ml-1"
                                      onClick={() => handleRevokePermission(p.id)}
                                    >
                                      ✕
                                    </Button>
                                  </Badge>
                                ))}
                                {permissionTypes
                                  .filter(pt =>
                                    !user.permissions.some(p => p.permission === pt.key)
                                  )
                                  .map(pt => (
                                    <Button
                                      key={pt.key}
                                      size="sm"
                                      variant="secondary"
                                      className="ml-1"
                                      onClick={() => handleGrantPermission(user.id, pt.key)}
                                    >
                                      Grant {pt.label}
                                    </Button>
                                  ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {!user.user_metadata?.approved && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleApproveUser(user.id)}
                                >
                                  Approve
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
