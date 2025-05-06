
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type License = {
  id: string;
  license_key: string;
  product_name: string;
  tier: {
    name: string;
  };
  assigned_to: string | null;
  expiry_date: string;
  status: string;
  seats: number;
  created_at: string;
  last_active: string | null;
  features: string[];
  addons: string[];
};

type LicenseTier = {
  id: string;
  name: string;
  description: string;
  max_seats: number;
};

export const useLicenses = () => {
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [tiers, setTiers] = useState<LicenseTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicensesAndTiers = async () => {
      setLoading(true);
      try {
        // Fetch licenses with tier details
        const { data: licensesData, error: licensesError } = await supabase
          .from('product_licenses')
          .select(`
            id,
            license_key,
            product_name,
            tier_id,
            tier:license_tiers(name),
            assigned_to,
            seats,
            expiry_date,
            status,
            features,
            addons,
            created_at,
            last_active
          `)
          .order('created_at', { ascending: false });
          
        if (licensesError) {
          console.error('Error fetching licenses:', licensesError);
          toast({
            title: "Error loading licenses",
            description: licensesError.message,
            variant: "destructive"
          });
        } else {
          // Ensure features and addons are arrays
          const processedLicenses = licensesData?.map(license => ({
            ...license,
            features: Array.isArray(license.features) ? license.features : [],
            addons: Array.isArray(license.addons) ? license.addons : []
          })) || [];
          
          setLicenses(processedLicenses);
        }
        
        // Fetch license tiers
        const { data: tiersData, error: tiersError } = await supabase
          .from('license_tiers')
          .select('*')
          .order('max_seats', { ascending: true });
          
        if (tiersError) {
          console.error('Error fetching license tiers:', tiersError);
        } else {
          setTiers(tiersData || []);
        }
      } catch (err) {
        console.error('Exception fetching license data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLicensesAndTiers();
  }, [toast]);

  const addLicense = (newLicense: License) => {
    // Ensure features and addons are arrays
    const processedLicense = {
      ...newLicense,
      features: Array.isArray(newLicense.features) ? newLicense.features : [],
      addons: Array.isArray(newLicense.addons) ? newLicense.addons : []
    };
    
    setLicenses([processedLicense, ...licenses]);
  };

  return {
    licenses,
    tiers,
    loading,
    addLicense
  };
};
