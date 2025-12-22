
import { useForm } from "react-hook-form";
import { useState } from "react";
import { addMonths } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type LicenseTier = {
  id: string;
  name: string;
  description: string;
  max_seats: number;
};

export type FormValues = {
  product: string;
  tier: string;
  seats: number;
  expiryDate: Date;
  email: string;
  features: string[];
  addons: string[];
  maxHosts: number | null;
  allowedNetworks: string;
  usageHoursLimit: number | null;
  concurrentSessions: number;
  catalogSku: string;
};

export type AvailableProduct = {
  value: string;
  label: string;
};

export type AvailableFeature = {
  value: string;
  label: string;
};

export type AvailableAddon = {
  value: string;
  label: string;
};

type UseLicenseFormProps = {
  tiers: LicenseTier[];
  products?: AvailableProduct[];
  features?: AvailableFeature[];
  addons?: AvailableAddon[];
  onLicenseCreated: (newLicense: any) => void;
  onClose: () => void;
};

export const useLicenseForm = ({ 
  tiers, 
  products = [], 
  features = [], 
  addons = [],
  onLicenseCreated, 
  onClose 
}: UseLicenseFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      product: products[0]?.value || "",
      tier: "",
      seats: 1,
      expiryDate: addMonths(new Date(), 12),
      email: "",
      features: [],
      addons: [],
      maxHosts: null,
      allowedNetworks: "",
      usageHoursLimit: null,
      concurrentSessions: 1,
      catalogSku: "",
    },
  });

  const generateRandomString = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const productCode = data.product.slice(0, 4).toUpperCase();
      const randomKey = `THS-${productCode}-${new Date().getFullYear()}-${generateRandomString(4)}-${generateRandomString(4)}`;
      const tierId = tiers.find(t => t.name === data.tier)?.id;
      
      if (!tierId) {
        toast({
          title: "Error creating license",
          description: "Selected tier not found",
          variant: "destructive"
        });
        return;
      }
      
      // Ensure features and addons are properly handled as arrays
      const featureArray = Array.isArray(data.features) ? data.features : [];
      const addonArray = Array.isArray(data.addons) ? data.addons : [];
      
      // Parse allowed networks from comma-separated string to array
      const networksArray = data.allowedNetworks
        ? data.allowedNetworks.split(',').map(n => n.trim()).filter(n => n)
        : [];
      
      const { data: newLicense, error } = await supabase
        .from('product_licenses')
        .insert({
          license_key: randomKey,
          product_name: data.product,
          tier_id: tierId,
          assigned_to: data.email || null,
          expiry_date: data.expiryDate.toISOString(),
          status: data.email ? "active" : "unassigned",
          seats: data.seats,
          features: featureArray,
          addons: addonArray,
          max_hosts: data.maxHosts || null,
          allowed_networks: networksArray,
          usage_hours_limit: data.usageHoursLimit || null,
          concurrent_sessions: data.concurrentSessions || 1,
        })
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
          last_active,
          max_hosts,
          allowed_networks,
          concurrent_sessions,
          usage_hours_limit
        `)
        .single();
          
      if (error) {
        console.error('Error creating license:', error);
        toast({
          title: "Error creating license",
          description: error.message,
          variant: "destructive"
        });
      } else if (newLicense) {
        onLicenseCreated(newLicense);
        onClose();
        form.reset();
          
        toast({
          title: "License created",
          description: `Created new ${data.product} license with key: ${randomKey}`,
        });
      }
    } catch (err) {
      console.error('Exception creating license:', err);
      toast({
        title: "Error creating license",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    products,
    features,
    addons
  };
};
