
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

interface UserData {
  id: string;
  email: string;
  approved: boolean;
  created_at: string;
}

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if current user is admin
  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;

      try {
        // Fetch users from Supabase - this requires a server function in production
        // Here we're assuming a simpler approach for demo purposes
        const { data, error } = await supabase
          .from('users')
          .select('id, email, user_metadata')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data for display
        const formattedUsers = data.map(user => ({
          id: user.id,
          email: user.email,
          approved: user.user_metadata?.approved || false,
          created_at: user.created_at
        }));

        setUsers(formattedUsers);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, toast]);

  const approveUser = async (userId: string) => {
    try {
      // Update user metadata via Supabase function
      const { error } = await supabase.functions.invoke('approve-user', {
        body: { userId }
      });

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, approved: true } : user
      ));

      toast({
        title: 'User Approved',
        description: 'The user has been approved successfully.',
      });
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve user.',
        variant: 'destructive',
      });
    }
  };

  // Redirect if not admin
  if (!isAdmin && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Created</th>
                        <th className="text-right p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.approved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {user.approved ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                            <td className="p-2">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-2 text-right">
                              {!user.approved && (
                                <Button 
                                  size="sm"
                                  onClick={() => approveUser(user.id)}
                                  className="bg-[#cc0c1a] hover:bg-[#a80916] text-white"
                                >
                                  Approve
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
