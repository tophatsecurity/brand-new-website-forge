import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from './types';

export const useUserFetch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Get current session for auth header
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session');
      }

      // Call edge function to list users
      const response = await fetch(
        `https://saveabkhpaemynlfcgcy.supabase.co/functions/v1/admin-list-users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      
      console.log('Fetched users:', data.users);

      setUsers(
        data.users.map((user: any) => ({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          banned_until: user.banned_until,
          createdAt: user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown',
          permissions: user.permissions || [],
        }))
      );
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    fetchUsers
  };
};
