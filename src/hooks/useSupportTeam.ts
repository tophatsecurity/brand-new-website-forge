import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

export const useSupportTeam = () => {
  return useQuery({
    queryKey: ['support-team'],
    queryFn: async () => {
      // Fetch users with support-related roles (customer_rep, customer_service, var, account_rep)
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['customer_rep', 'var', 'account_rep', 'admin']);

      if (roleError) throw roleError;

      if (!roleData || roleData.length === 0) {
        return [];
      }

      // Get unique user IDs
      const userIds = [...new Set(roleData.map(r => r.user_id))];

      // Fetch user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Combine data
      const teamMembers: TeamMember[] = (profiles || []).map(profile => {
        const userRoles = roleData.filter(r => r.user_id === profile.id);
        const primaryRole = userRoles[0]?.role || 'user';
        
        return {
          id: profile.id,
          email: profile.email || '',
          role: primaryRole,
        };
      });

      return teamMembers;
    },
  });
};

export const SUPPORT_ROLES = [
  { value: 'customer_rep', label: 'Customer Rep' },
  { value: 'account_rep', label: 'Account Rep' },
  { value: 'var', label: 'VAR' },
  { value: 'admin', label: 'Admin' },
];

export const getRoleLabel = (role: string): string => {
  const found = SUPPORT_ROLES.find(r => r.value === role);
  return found?.label || role;
};
