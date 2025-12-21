import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface CRMAccount {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  account_type: 'prospect' | 'customer' | 'partner' | 'vendor' | 'other';
  status: 'active' | 'inactive' | 'churned';
  annual_revenue: number | null;
  employee_count: number | null;
  owner_id: string | null;
  parent_account_id: string | null;
  notes: string | null;
  tags: string[];
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Linked data
  licenses?: ProductLicense[];
  onboarding?: CustomerOnboarding[];
}

export interface ProductLicense {
  id: string;
  license_key: string;
  product_name: string;
  status: string;
  seats: number;
  expiry_date: string;
  activation_date: string | null;
  assigned_to: string | null;
  features: string[];
  addons: string[];
  account_id: string | null;
}

export interface CustomerOnboarding {
  id: string;
  user_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  current_step: number;
  total_steps: number;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  started_at: string | null;
  completed_at: string | null;
  account_id: string | null;
}

export interface CRMContact {
  id: string;
  account_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  job_title: string | null;
  department: string | null;
  is_primary: boolean;
  status: 'active' | 'inactive';
  lead_source: string | null;
  owner_id: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  notes: string | null;
  tags: string[];
  custom_fields: Record<string, any>;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
  account?: CRMAccount;
}

export interface CRMDeal {
  id: string;
  account_id: string | null;
  contact_id: string | null;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  stage: 'qualification' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  owner_id: string | null;
  lead_source: string | null;
  next_step: string | null;
  competitors: string[] | null;
  notes: string | null;
  tags: string[];
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
  account?: CRMAccount;
  contact?: CRMContact;
}

export interface CRMActivity {
  id: string;
  account_id: string | null;
  contact_id: string | null;
  deal_id: string | null;
  activity_type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'demo' | 'follow_up';
  subject: string;
  description: string | null;
  status: 'planned' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  completed_at: string | null;
  duration_minutes: number | null;
  outcome: string | null;
  owner_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  account?: CRMAccount;
  contact?: CRMContact;
  deal?: CRMDeal;
}

// Accounts Hook
export const useCRMAccounts = () => {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ['crm-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as CRMAccount[];
    },
  });

  const createAccount = useMutation({
    mutationFn: async (account: Partial<CRMAccount>) => {
      const { data, error } = await supabase
        .from('crm_accounts')
        .insert(account as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-accounts'] });
      toast.success('Account created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create account: ${error.message}`);
    },
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CRMAccount> & { id: string }) => {
      const { data, error } = await supabase
        .from('crm_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-accounts'] });
      toast.success('Account updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update account: ${error.message}`);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('crm_accounts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-accounts'] });
      toast.success('Account deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete account: ${error.message}`);
    },
  });

  return { ...accountsQuery, createAccount, updateAccount, deleteAccount };
};

// Contacts Hook
export const useCRMContacts = (accountId?: string) => {
  const queryClient = useQueryClient();

  const contactsQuery = useQuery({
    queryKey: ['crm-contacts', accountId],
    queryFn: async () => {
      let query = supabase
        .from('crm_contacts')
        .select('*, account:crm_accounts(*)')
        .order('created_at', { ascending: false });
      
      if (accountId) {
        query = query.eq('account_id', accountId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CRMContact[];
    },
  });

  const createContact = useMutation({
    mutationFn: async (contact: Partial<CRMContact>) => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert(contact as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success('Contact created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create contact: ${error.message}`);
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CRMContact> & { id: string }) => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success('Contact updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });

  return { ...contactsQuery, createContact, updateContact, deleteContact };
};

// Deals Hook
export const useCRMDeals = (accountId?: string) => {
  const queryClient = useQueryClient();

  const dealsQuery = useQuery({
    queryKey: ['crm-deals', accountId],
    queryFn: async () => {
      let query = supabase
        .from('crm_deals')
        .select('*, account:crm_accounts(*), contact:crm_contacts(*)')
        .order('created_at', { ascending: false });
      
      if (accountId) {
        query = query.eq('account_id', accountId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CRMDeal[];
    },
  });

  const createDeal = useMutation({
    mutationFn: async (deal: Partial<CRMDeal>) => {
      const { data, error } = await supabase
        .from('crm_deals')
        .insert(deal as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      toast.success('Deal created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create deal: ${error.message}`);
    },
  });

  const updateDeal = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CRMDeal> & { id: string }) => {
      const { data, error } = await supabase
        .from('crm_deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      toast.success('Deal updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update deal: ${error.message}`);
    },
  });

  const deleteDeal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('crm_deals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      toast.success('Deal deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete deal: ${error.message}`);
    },
  });

  return { ...dealsQuery, createDeal, updateDeal, deleteDeal };
};

// Activities Hook
export const useCRMActivities = (filters?: { accountId?: string; contactId?: string; dealId?: string }) => {
  const queryClient = useQueryClient();

  const activitiesQuery = useQuery({
    queryKey: ['crm-activities', filters],
    queryFn: async () => {
      let query = supabase
        .from('crm_activities')
        .select('*, account:crm_accounts(*), contact:crm_contacts(*), deal:crm_deals(*)')
        .order('created_at', { ascending: false });
      
      if (filters?.accountId) query = query.eq('account_id', filters.accountId);
      if (filters?.contactId) query = query.eq('contact_id', filters.contactId);
      if (filters?.dealId) query = query.eq('deal_id', filters.dealId);
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CRMActivity[];
    },
  });

  const createActivity = useMutation({
    mutationFn: async (activity: Partial<CRMActivity>) => {
      const { data, error } = await supabase
        .from('crm_activities')
        .insert(activity as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
      toast.success('Activity created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create activity: ${error.message}`);
    },
  });

  const updateActivity = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CRMActivity> & { id: string }) => {
      const { data, error } = await supabase
        .from('crm_activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
      toast.success('Activity updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update activity: ${error.message}`);
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('crm_activities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
      toast.success('Activity deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete activity: ${error.message}`);
    },
  });

  return { ...activitiesQuery, createActivity, updateActivity, deleteActivity };
};

// CRM Stats Hook
export const useCRMStats = () => {
  return useQuery({
    queryKey: ['crm-stats'],
    queryFn: async () => {
      const [accountsRes, contactsRes, dealsRes, activitiesRes] = await Promise.all([
        supabase.from('crm_accounts').select('id, account_type, status', { count: 'exact' }),
        supabase.from('crm_contacts').select('id, status', { count: 'exact' }),
        supabase.from('crm_deals').select('id, stage, amount', { count: 'exact' }),
        supabase.from('crm_activities').select('id, status, activity_type', { count: 'exact' }),
      ]);

      const deals = dealsRes.data || [];
      const pipelineValue = deals
        .filter((d: any) => !['closed_won', 'closed_lost'].includes(d.stage))
        .reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
      const closedWonValue = deals
        .filter((d: any) => d.stage === 'closed_won')
        .reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

      return {
        totalAccounts: accountsRes.count || 0,
        activeAccounts: (accountsRes.data || []).filter((a: any) => a.status === 'active').length,
        totalContacts: contactsRes.count || 0,
        totalDeals: dealsRes.count || 0,
        pipelineValue,
        closedWonValue,
        totalActivities: activitiesRes.count || 0,
        pendingActivities: (activitiesRes.data || []).filter((a: any) => a.status === 'planned').length,
      };
    },
  });
};

// Account Details Hook - fetches account with linked licenses and onboarding
export const useCRMAccountDetails = (accountId: string | null) => {
  const queryClient = useQueryClient();

  const accountQuery = useQuery({
    queryKey: ['crm-account-details', accountId],
    queryFn: async () => {
      if (!accountId) return null;

      // Fetch account details
      const { data: account, error: accountError } = await supabase
        .from('crm_accounts')
        .select('*')
        .eq('id', accountId)
        .maybeSingle();
      
      if (accountError) throw accountError;
      if (!account) return null;

      // Fetch linked licenses
      const { data: licenses, error: licensesError } = await supabase
        .from('product_licenses')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });
      
      if (licensesError) console.error('Error fetching licenses:', licensesError);

      // Fetch linked onboarding records
      const { data: onboarding, error: onboardingError } = await supabase
        .from('customer_onboarding')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });
      
      if (onboardingError) console.error('Error fetching onboarding:', onboardingError);

      return {
        ...account,
        licenses: licenses || [],
        onboarding: onboarding || [],
      } as CRMAccount;
    },
    enabled: !!accountId,
  });

  // Link license to account
  const linkLicense = useMutation({
    mutationFn: async ({ licenseId, accountId }: { licenseId: string; accountId: string }) => {
      const { error } = await supabase
        .from('product_licenses')
        .update({ account_id: accountId })
        .eq('id', licenseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-account-details', accountId] });
      queryClient.invalidateQueries({ queryKey: ['crm-stats'] });
      toast.success('License linked to account');
    },
    onError: (error: any) => {
      toast.error(`Failed to link license: ${error.message}`);
    },
  });

  // Unlink license from account
  const unlinkLicense = useMutation({
    mutationFn: async (licenseId: string) => {
      const { error } = await supabase
        .from('product_licenses')
        .update({ account_id: null })
        .eq('id', licenseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-account-details', accountId] });
      toast.success('License unlinked from account');
    },
    onError: (error: any) => {
      toast.error(`Failed to unlink license: ${error.message}`);
    },
  });

  // Link onboarding to account
  const linkOnboarding = useMutation({
    mutationFn: async ({ onboardingId, accountId }: { onboardingId: string; accountId: string }) => {
      const { error } = await supabase
        .from('customer_onboarding')
        .update({ account_id: accountId })
        .eq('id', onboardingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-account-details', accountId] });
      toast.success('Onboarding linked to account');
    },
    onError: (error: any) => {
      toast.error(`Failed to link onboarding: ${error.message}`);
    },
  });

  // Unlink onboarding from account
  const unlinkOnboarding = useMutation({
    mutationFn: async (onboardingId: string) => {
      const { error } = await supabase
        .from('customer_onboarding')
        .update({ account_id: null })
        .eq('id', onboardingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-account-details', accountId] });
      toast.success('Onboarding unlinked from account');
    },
    onError: (error: any) => {
      toast.error(`Failed to unlink onboarding: ${error.message}`);
    },
  });

  return { 
    ...accountQuery, 
    linkLicense, 
    unlinkLicense, 
    linkOnboarding, 
    unlinkOnboarding 
  };
};

// Hook to get unlinked licenses (for linking dialog)
export const useUnlinkedLicenses = () => {
  return useQuery({
    queryKey: ['unlinked-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_licenses')
        .select('*')
        .is('account_id', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ProductLicense[];
    },
  });
};

// Hook to get unlinked onboarding records (for linking dialog)
export const useUnlinkedOnboarding = () => {
  return useQuery({
    queryKey: ['unlinked-onboarding'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_onboarding')
        .select('*')
        .is('account_id', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as CustomerOnboarding[];
    },
  });
};
