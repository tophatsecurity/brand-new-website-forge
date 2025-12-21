import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

type AppRole = 'admin' | 'user' | 'moderator' | 'var' | 'customer_rep' | 'customer' | 'account_rep' | 'marketing' | 'free';

type DashboardStats = {
  totalUsers: number;
  totalLicenses: number;
  totalSeatsLicensed: number;
  activeLicenses: number;
  pendingUsers: number;
  totalDownloads: number;
  totalAccounts: number;
  totalContacts: number;
  totalDeals: number;
  myAccounts: number;
  myContacts: number;
  myDeals: number;
  onboardingInProgress: number;
};

type RolePermissions = {
  canViewAllUsers: boolean;
  canViewAllLicenses: boolean;
  canViewAllAccounts: boolean;
  canViewCRM: boolean;
  canViewMarketing: boolean;
  canManageUsers: boolean;
  dashboardTitle: string;
  dashboardDescription: string;
};

const getRolePermissions = (role: AppRole | null): RolePermissions => {
  switch (role) {
    case 'admin':
      return {
        canViewAllUsers: true,
        canViewAllLicenses: true,
        canViewAllAccounts: true,
        canViewCRM: true,
        canViewMarketing: true,
        canManageUsers: true,
        dashboardTitle: 'Admin Dashboard',
        dashboardDescription: 'Complete system overview with full access to all data and settings.'
      };
    case 'account_rep':
      return {
        canViewAllUsers: false,
        canViewAllLicenses: true,
        canViewAllAccounts: true,
        canViewCRM: true,
        canViewMarketing: false,
        canManageUsers: false,
        dashboardTitle: 'Account Rep Dashboard',
        dashboardDescription: 'Manage customer accounts, licenses, and relationships.'
      };
    case 'marketing':
      return {
        canViewAllUsers: false,
        canViewAllLicenses: false,
        canViewAllAccounts: true,
        canViewCRM: true,
        canViewMarketing: true,
        canManageUsers: false,
        dashboardTitle: 'Marketing Dashboard',
        dashboardDescription: 'Access to accounts, contacts, and marketing analytics.'
      };
    case 'customer_rep':
      return {
        canViewAllUsers: false,
        canViewAllLicenses: true,
        canViewAllAccounts: true,
        canViewCRM: true,
        canViewMarketing: false,
        canManageUsers: false,
        dashboardTitle: 'Customer Rep Dashboard',
        dashboardDescription: 'Manage customer support and onboarding.'
      };
    case 'var':
      return {
        canViewAllUsers: false,
        canViewAllLicenses: true,
        canViewAllAccounts: true,
        canViewCRM: true,
        canViewMarketing: false,
        canManageUsers: false,
        dashboardTitle: 'VAR Partner Dashboard',
        dashboardDescription: 'Manage your customer accounts and licenses.'
      };
    default:
      return {
        canViewAllUsers: false,
        canViewAllLicenses: false,
        canViewAllAccounts: false,
        canViewCRM: false,
        canViewMarketing: false,
        canManageUsers: false,
        dashboardTitle: 'Dashboard',
        dashboardDescription: 'Your personal dashboard.'
      };
  }
};

export const useRoleDashboard = () => {
  const { activeRole, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLicenses: 0,
    totalSeatsLicensed: 0,
    activeLicenses: 0,
    pendingUsers: 0,
    totalDownloads: 0,
    totalAccounts: 0,
    totalContacts: 0,
    totalDeals: 0,
    myAccounts: 0,
    myContacts: 0,
    myDeals: 0,
    onboardingInProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const permissions = getRolePermissions(activeRole);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const newStats: DashboardStats = {
          totalUsers: 0,
          totalLicenses: 0,
          totalSeatsLicensed: 0,
          activeLicenses: 0,
          pendingUsers: 0,
          totalDownloads: 0,
          totalAccounts: 0,
          totalContacts: 0,
          totalDeals: 0,
          myAccounts: 0,
          myContacts: 0,
          myDeals: 0,
          onboardingInProgress: 0
        };

        // Fetch user stats (admin only)
        if (permissions.canViewAllUsers) {
          const { count: totalUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
          newStats.totalUsers = totalUsers || 0;

          const { count: pendingUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('approved', false);
          newStats.pendingUsers = pendingUsers || 0;
        }

        // Fetch license stats
        if (permissions.canViewAllLicenses) {
          const { data: licenses } = await supabase
            .from('product_licenses')
            .select('*');
          
          newStats.totalLicenses = licenses?.length || 0;
          newStats.activeLicenses = licenses?.filter(l => l.status === 'active').length || 0;
          newStats.totalSeatsLicensed = licenses?.reduce((sum, l) => sum + (l.seats || 0), 0) || 0;
        }

        // Fetch download stats
        const { count: totalDownloads } = await supabase
          .from('product_downloads')
          .select('*', { count: 'exact', head: true });
        newStats.totalDownloads = totalDownloads || 0;

        // Fetch CRM stats
        if (permissions.canViewCRM) {
          const { count: totalAccounts } = await supabase
            .from('crm_accounts')
            .select('*', { count: 'exact', head: true });
          newStats.totalAccounts = totalAccounts || 0;

          const { count: totalContacts } = await supabase
            .from('crm_contacts')
            .select('*', { count: 'exact', head: true });
          newStats.totalContacts = totalContacts || 0;

          const { count: totalDeals } = await supabase
            .from('crm_deals')
            .select('*', { count: 'exact', head: true });
          newStats.totalDeals = totalDeals || 0;

          // My owned accounts/contacts/deals
          const { count: myAccounts } = await supabase
            .from('crm_accounts')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id);
          newStats.myAccounts = myAccounts || 0;

          const { count: myContacts } = await supabase
            .from('crm_contacts')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id);
          newStats.myContacts = myContacts || 0;

          const { count: myDeals } = await supabase
            .from('crm_deals')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id);
          newStats.myDeals = myDeals || 0;

          // Onboarding in progress
          const { count: onboardingInProgress } = await supabase
            .from('customer_onboarding')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'in_progress');
          newStats.onboardingInProgress = onboardingInProgress || 0;
        }

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: 'Error loading dashboard',
          description: 'Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [activeRole, user, permissions.canViewAllUsers, permissions.canViewAllLicenses, permissions.canViewCRM, toast]);

  return { stats, loading, permissions, activeRole };
};
