
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

      if (users) {
        setUsers(
          users.map((user: any) => ({
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
            createdAt: user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown', // access created_at from the original user object
          }))
        );
      }
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

      // Update local state
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, user_metadata: { ...user.user_metadata, approved: true } }
          : user
      ));
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: 'Error approving user',
        description: 'Please try again later.',
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
