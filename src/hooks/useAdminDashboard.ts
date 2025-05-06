
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type DashboardStats = {
  totalUsers: number;
  totalLicenses: number;
  totalSeatsLicensed: number;
  activeLicenses: number;
  pendingUsers: number;
  totalDownloads: number;
};

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLicenses: 0,
    totalSeatsLicensed: 0,
    activeLicenses: 0,
    pendingUsers: 0,
    totalDownloads: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user stats
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;

        // Fetch pending users
        const { count: pendingUsers, error: pendingError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approved', false);
          
        if (pendingError) throw pendingError;
        
        // Fetch license stats
        const { data: licenses, error: licensesError } = await supabase
          .from('product_licenses')
          .select('*');
          
        if (licensesError) throw licensesError;
        
        const totalLicenses = licenses?.length || 0;
        const activeLicenses = licenses?.filter(license => license.status === 'active').length || 0;
        const totalSeatsLicensed = licenses?.reduce((sum, license) => sum + (license.seats || 0), 0) || 0;
        
        // Fetch download stats
        const { count: totalDownloads, error: downloadsError } = await supabase
          .from('product_downloads')
          .select('*', { count: 'exact', head: true });
          
        if (downloadsError) throw downloadsError;
        
        setStats({
          totalUsers: totalUsers || 0,
          pendingUsers: pendingUsers || 0,
          totalLicenses,
          activeLicenses,
          totalSeatsLicensed,
          totalDownloads: totalDownloads || 0
        });
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        toast({
          title: 'Error loading dashboard statistics',
          description: 'Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [toast]);
  
  return { stats, loading };
};
