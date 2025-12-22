import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ProductType = 'software' | 'maintenance' | 'service' | 'bundle' | 'demo';
export type LicenseModel = 'perpetual' | 'subscription' | 'evaluation' | 'beta' | 'alpha';
export type SupportLevel = 'standard' | 'premium' | 'enterprise';
export type VersionStage = 'alpha' | 'beta' | 'rc' | 'stable' | 'deprecated';
export type PriceTier = 'free' | 'starter' | 'standard' | 'professional' | 'enterprise';

export type CreditPackage = {
  name: string;
  credits: number;
  price: number;
};

export type CatalogItem = {
  id: string;
  product_name: string;
  description: string;
  demo_duration_days: number;
  demo_seats: number;
  demo_features: string[];
  is_active: boolean;
  product_type: ProductType;
  license_model: LicenseModel;
  subscription_period_months: number | null;
  maintenance_included: boolean;
  support_level: SupportLevel;
  version: string;
  version_stage: VersionStage;
  release_date: string | null;
  changelog: string | null;
  min_version: string | null;
  latest_stable_version: string | null;
  credits_included: number;
  price_tier: PriceTier;
  base_price: number;
  price_per_credit: number;
  credit_packages: CreditPackage[];
  sku: string | null;
  created_at: string;
  updated_at: string;
};

export type CatalogFormData = {
  product_name: string;
  description: string;
  demo_duration_days: number;
  demo_seats: number;
  demo_features: string[];
  is_active: boolean;
  product_type: ProductType;
  license_model: LicenseModel;
  subscription_period_months: number | null;
  maintenance_included: boolean;
  support_level: SupportLevel;
  version: string;
  version_stage: VersionStage;
  release_date: string | null;
  changelog: string | null;
  credits_included: number;
  price_tier: PriceTier;
  base_price: number;
  price_per_credit: number;
  credit_packages: CreditPackage[];
};

export const useCatalog = () => {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('license_catalog')
        .select('*')
        .order('product_type')
        .order('product_name');

      if (error) throw error;
      
      // Parse credit_packages from JSON
      const processedData = (data || []).map(item => ({
        ...item,
        credit_packages: Array.isArray(item.credit_packages) ? item.credit_packages : []
      }));
      
      setCatalog(processedData as unknown as CatalogItem[]);
    } catch (err: any) {
      console.error('Error fetching catalog:', err);
      toast({
        title: "Error loading catalog",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const addCatalogItem = async (item: CatalogFormData) => {
    try {
      const { data, error } = await supabase
        .from('license_catalog')
        .insert({
          ...item,
          credit_packages: item.credit_packages
        })
        .select()
        .single();

      if (error) throw error;
      
      const processedItem = { ...data, credit_packages: Array.isArray(data.credit_packages) ? data.credit_packages : [] };
      setCatalog(prev => [...prev, processedItem as unknown as CatalogItem]);
      toast({
        title: "Product added",
        description: `${item.product_name} has been added to the catalog.`
      });
      return data;
    } catch (err: any) {
      console.error('Error adding catalog item:', err);
      toast({
        title: "Error adding product",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateCatalogItem = async (id: string, item: Partial<CatalogFormData>) => {
    try {
      const { data, error } = await supabase
        .from('license_catalog')
        .update({ ...item, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const processedItem = { ...data, credit_packages: Array.isArray(data.credit_packages) ? data.credit_packages : [] };
      setCatalog(prev => prev.map(c => c.id === id ? processedItem as unknown as CatalogItem : c));
      toast({
        title: "Product updated",
        description: "Catalog item has been updated."
      });
      return data;
    } catch (err: any) {
      console.error('Error updating catalog item:', err);
      toast({
        title: "Error updating product",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteCatalogItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('license_catalog')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCatalog(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Product deleted",
        description: "Catalog item has been removed."
      });
    } catch (err: any) {
      console.error('Error deleting catalog item:', err);
      toast({
        title: "Error deleting product",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateCatalogItem(id, { is_active: isActive });
  };

  return {
    catalog,
    loading,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    toggleActive,
    refetch: fetchCatalog
  };
};
