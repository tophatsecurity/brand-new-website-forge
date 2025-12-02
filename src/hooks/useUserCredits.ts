import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type CreditPurchase = {
  id: string;
  user_id: string;
  catalog_id: string | null;
  credits_purchased: number;
  credits_used: number;
  credits_remaining: number;
  package_name: string | null;
  price_paid: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  purchased_at: string;
  created_at: string;
};

export type CreditPackageOption = {
  name: string;
  credits: number;
  price: number;
  catalogId: string;
  productName: string;
};

export const useUserCredits = () => {
  const [purchases, setPurchases] = useState<CreditPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCredits, setTotalCredits] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPurchases = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPurchases(data as CreditPurchase[]);
      
      // Calculate total available credits from approved/completed purchases
      const total = (data || [])
        .filter(p => p.status === 'approved' || p.status === 'completed')
        .reduce((sum, p) => sum + (p.credits_remaining || 0), 0);
      setTotalCredits(total);
    } catch (err: any) {
      console.error('Error fetching credits:', err);
      toast({
        title: "Error loading credits",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  const requestPurchase = async (
    catalogId: string,
    packageName: string,
    credits: number,
    price: number
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase credits.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          catalog_id: catalogId,
          package_name: packageName,
          credits_purchased: credits,
          price_paid: price,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      setPurchases(prev => [data as CreditPurchase, ...prev]);
      toast({
        title: "Purchase request submitted",
        description: `Your request for ${credits} credits is pending approval.`
      });
      return data;
    } catch (err: any) {
      console.error('Error requesting purchase:', err);
      toast({
        title: "Error submitting request",
        description: err.message,
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    purchases,
    loading,
    totalCredits,
    requestPurchase,
    refetch: fetchPurchases
  };
};
