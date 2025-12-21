import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AccountPaymentStatus {
  hasPaymentMethod: boolean;
  isPaymentVerified: boolean;
  isApproved: boolean;
  accountType: string | null;
  accountId: string | null;
  stripeCustomerId: string | null;
}

export const useAccountPayment = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['account-payment-status', user?.id],
    queryFn: async (): Promise<AccountPaymentStatus> => {
      if (!user) {
        return {
          hasPaymentMethod: false,
          isPaymentVerified: false,
          isApproved: false,
          accountType: null,
          accountId: null,
          stripeCustomerId: null
        };
      }

      // First check if user has onboarding with linked account
      const { data: onboarding } = await supabase
        .from('customer_onboarding')
        .select('account_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!onboarding?.account_id) {
        return {
          hasPaymentMethod: false,
          isPaymentVerified: false,
          isApproved: false,
          accountType: 'free',
          accountId: null,
          stripeCustomerId: null
        };
      }

      // Get account details
      const { data: account } = await supabase
        .from('crm_accounts')
        .select('id, account_type, stripe_customer_id, payment_verified, payment_approved_by')
        .eq('id', onboarding.account_id)
        .single();

      if (!account) {
        return {
          hasPaymentMethod: false,
          isPaymentVerified: false,
          isApproved: false,
          accountType: 'free',
          accountId: null,
          stripeCustomerId: null
        };
      }

      // Check for payment methods
      const { count: paymentMethodCount } = await supabase
        .from('customer_payment_methods')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const hasPaymentMethod = (paymentMethodCount || 0) > 0;
      const isApproved = !!account.payment_approved_by || account.account_type !== 'free';

      return {
        hasPaymentMethod,
        isPaymentVerified: account.payment_verified || false,
        isApproved,
        accountType: account.account_type,
        accountId: account.id,
        stripeCustomerId: account.stripe_customer_id
      };
    },
    enabled: !!user
  });

  const canAccessPaidFeatures = 
    query.data?.isPaymentVerified || 
    query.data?.isApproved ||
    (query.data?.accountType && query.data.accountType !== 'free');

  return {
    ...query,
    canAccessPaidFeatures,
    isFreeUser: query.data?.accountType === 'free' && !query.data?.isPaymentVerified && !query.data?.isApproved
  };
};
