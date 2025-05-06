
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

  return {
    users,
    loading,
    fetchUsers
  };
};
