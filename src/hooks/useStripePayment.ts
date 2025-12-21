import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
}

export const useStripePayment = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<StripeCustomer | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const createCustomer = useCallback(async (name: string, metadata?: Record<string, string>) => {
    if (!user?.email) {
      toast.error('User email is required');
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          action: 'create-customer',
          email: user.email,
          name,
          metadata: {
            user_id: user.id,
            ...metadata
          }
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const stripeCustomer = {
        id: data.customer.id,
        email: data.customer.email,
        name: data.customer.name
      };
      setCustomer(stripeCustomer);
      return stripeCustomer;
    } catch (error: any) {
      console.error('Error creating Stripe customer:', error);
      toast.error(`Failed to create customer: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createSetupIntent = useCallback(async (customerId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          action: 'create-setup-intent',
          customer_id: customerId
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return {
        clientSecret: data.clientSecret,
        setupIntentId: data.setupIntentId
      };
    } catch (error: any) {
      console.error('Error creating setup intent:', error);
      toast.error(`Failed to setup payment: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPaymentMethod = useCallback(async (
    customerId: string, 
    paymentMethodId: string, 
    setDefault = true
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          action: 'confirm-payment-method',
          customer_id: customerId,
          payment_method_id: paymentMethodId,
          set_default: setDefault
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const pm = data.paymentMethod as PaymentMethod;
      setPaymentMethods(prev => [...prev.filter(p => p.id !== pm.id), pm]);
      
      return pm;
    } catch (error: any) {
      console.error('Error confirming payment method:', error);
      toast.error(`Failed to confirm payment: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentMethods = useCallback(async (customerId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          action: 'get-customer-payment-methods',
          customer_id: customerId
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setPaymentMethods(data.paymentMethods || []);
      return data.paymentMethods as PaymentMethod[];
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const savePaymentMethodToDb = useCallback(async (
    paymentMethod: PaymentMethod,
    stripeCustomerId: string,
    accountId?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('customer_payment_methods')
        .insert({
          user_id: user.id,
          account_id: accountId,
          stripe_customer_id: stripeCustomerId,
          stripe_payment_method_id: paymentMethod.id,
          card_brand: paymentMethod.brand,
          card_last4: paymentMethod.last4,
          card_exp_month: paymentMethod.expMonth,
          card_exp_year: paymentMethod.expYear,
          is_default: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error saving payment method:', error);
      return null;
    }
  }, [user]);

  const updateAccountPaymentStatus = useCallback(async (
    accountId: string,
    stripeCustomerId: string
  ) => {
    try {
      const { error } = await supabase
        .from('crm_accounts')
        .update({
          stripe_customer_id: stripeCustomerId,
          payment_verified: true,
          payment_verified_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error updating account payment status:', error);
      return false;
    }
  }, []);

  return {
    loading,
    customer,
    paymentMethods,
    createCustomer,
    createSetupIntent,
    confirmPaymentMethod,
    getPaymentMethods,
    savePaymentMethodToDb,
    updateAccountPaymentStatus
  };
};
