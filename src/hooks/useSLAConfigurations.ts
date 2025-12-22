import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SLAConfiguration {
  id: string;
  product_name: string;
  sku: string | null;
  priority: string;
  first_response_hours: number;
  resolution_hours: number;
  business_hours_only: boolean;
  escalation_hours: number | null;
  escalation_contact: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SLAFormData {
  product_name: string;
  sku?: string;
  priority: string;
  first_response_hours: number;
  resolution_hours: number;
  business_hours_only: boolean;
  escalation_hours?: number;
  escalation_contact?: string;
  is_active: boolean;
}

export function useSLAConfigurations() {
  const [configurations, setConfigurations] = useState<SLAConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sla_configurations')
        .select('*')
        .order('product_name', { ascending: true })
        .order('priority', { ascending: true });

      if (error) throw error;
      setConfigurations((data as SLAConfiguration[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error loading SLA configurations',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createConfiguration = async (config: SLAFormData) => {
    try {
      const { data, error } = await supabase
        .from('sla_configurations')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      
      toast({ title: 'SLA configuration created' });
      await fetchConfigurations();
      return data;
    } catch (error: any) {
      toast({
        title: 'Error creating SLA configuration',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateConfiguration = async (id: string, config: Partial<SLAFormData>) => {
    try {
      const { error } = await supabase
        .from('sla_configurations')
        .update({ ...config, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: 'SLA configuration updated' });
      await fetchConfigurations();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error updating SLA configuration',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteConfiguration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sla_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: 'SLA configuration deleted' });
      await fetchConfigurations();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error deleting SLA configuration',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  return {
    configurations,
    loading,
    refetch: fetchConfigurations,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
  };
}
