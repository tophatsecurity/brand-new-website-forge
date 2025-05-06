
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type LicenseDistribution = Array<{
  name: string;
  value: number;
  color: string;
}>;

// Color palette for the chart
const CHART_COLORS = [
  '#8B5CF6', // Purple
  '#0EA5E9', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#EF4444', // Red
  '#8B5CF6', // Purple (repeat if needed)
];

export const useLicenseDistribution = () => {
  const [distribution, setDistribution] = useState<LicenseDistribution>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLicenseDistribution = async () => {
      try {
        setLoading(true);
        
        // Fetch all tiers
        const { data: tiers, error: tiersError } = await supabase
          .from('license_tiers')
          .select('id, name');
          
        if (tiersError) throw tiersError;
        
        if (!tiers || tiers.length === 0) {
          setDistribution([]);
          return;
        }
        
        // Create a map of tier IDs to names
        const tierMap = new Map(tiers.map(tier => [tier.id, tier.name]));
        
        // Fetch license counts by tier
        const { data: licenses, error: licensesError } = await supabase
          .from('product_licenses')
          .select('tier_id');
          
        if (licensesError) throw licensesError;
        
        // Count licenses by tier
        const tierCounts = licenses?.reduce((counts: Record<string, number>, license) => {
          const tierId = license.tier_id;
          counts[tierId] = (counts[tierId] || 0) + 1;
          return counts;
        }, {}) || {};
        
        // Format data for the chart
        const chartData = Object.entries(tierCounts).map(([tierId, count], index) => ({
          name: tierMap.get(tierId) || 'Unknown',
          value: count,
          color: CHART_COLORS[index % CHART_COLORS.length]
        }));
        
        setDistribution(chartData);
      } catch (error) {
        console.error('Error fetching license distribution:', error);
        toast({
          title: 'Error loading license distribution',
          description: 'Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLicenseDistribution();
  }, [toast]);
  
  return { distribution, loading };
};
