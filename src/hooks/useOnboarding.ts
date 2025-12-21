import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';

export interface OnboardingStep {
  id: string;
  onboarding_id: string;
  step_number: number;
  step_name: string;
  step_description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CustomerOnboarding {
  id: string;
  user_id: string;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  status: OnboardingStatus;
  current_step: number;
  total_steps: number;
  assigned_rep: string | null;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  steps?: OnboardingStep[];
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [onboarding, setOnboarding] = useState<CustomerOnboarding | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOnboarding = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user's onboarding record
      const { data: onboardingData, error: onboardingError } = await supabase
        .from('customer_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (onboardingError) throw onboardingError;

      if (onboardingData) {
        setOnboarding(onboardingData as CustomerOnboarding);

        // Fetch steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('onboarding_steps')
          .select('*')
          .eq('onboarding_id', onboardingData.id)
          .order('step_number', { ascending: true });

        if (stepsError) throw stepsError;
        setSteps((stepsData || []) as OnboardingStep[]);
      }
    } catch (error: any) {
      console.error('Error fetching onboarding:', error);
      toast({
        title: 'Error loading onboarding',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createOnboarding = async (data: {
    company_name?: string;
    contact_name?: string;
    contact_phone?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data: newOnboarding, error } = await supabase
        .from('customer_onboarding')
        .insert({
          user_id: user.id,
          contact_email: user.email!,
          company_name: data.company_name,
          contact_name: data.contact_name,
          contact_phone: data.contact_phone,
          status: 'in_progress' as OnboardingStatus,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await fetchOnboarding();
      return { data: newOnboarding, error: null };
    } catch (error: any) {
      console.error('Error creating onboarding:', error);
      return { data: null, error };
    }
  };

  const updateStep = async (stepId: string, data: Partial<OnboardingStep>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const updateData: Record<string, any> = { ...data };
      
      if (data.is_completed && !data.completed_at) {
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = user.id;
      }

      const { error } = await supabase
        .from('onboarding_steps')
        .update(updateData)
        .eq('id', stepId);

      if (error) throw error;

      await fetchOnboarding();
      return { error: null };
    } catch (error: any) {
      console.error('Error updating step:', error);
      return { error };
    }
  };

  const completeStep = async (stepNumber: number, stepData?: Record<string, any>) => {
    if (!onboarding) return { error: new Error('No onboarding found') };

    const step = steps.find(s => s.step_number === stepNumber);
    if (!step) return { error: new Error('Step not found') };

    const result = await updateStep(step.id, {
      is_completed: true,
      data: stepData || step.data
    });

    if (!result.error && onboarding) {
      // Update current step
      const nextStep = Math.min(stepNumber + 1, onboarding.total_steps);
      const allCompleted = stepNumber === onboarding.total_steps;

      await supabase
        .from('customer_onboarding')
        .update({
          current_step: nextStep,
          status: allCompleted ? 'completed' : 'in_progress',
          completed_at: allCompleted ? new Date().toISOString() : null
        })
        .eq('id', onboarding.id);

      // If all steps completed, create CRM Account and Contact
      if (allCompleted) {
        try {
          const { data, error: crmError } = await supabase.functions.invoke('create-crm-from-onboarding', {
            body: {
              onboarding_id: onboarding.id,
              user_id: user?.id
            }
          });
          
          if (crmError) {
            console.error('Error creating CRM records:', crmError);
          } else {
            console.log('CRM records created:', data);
          }
        } catch (error) {
          console.error('Failed to create CRM records:', error);
        }
      }

      await fetchOnboarding();
    }

    return result;
  };

  const updateOnboarding = async (data: Partial<CustomerOnboarding>) => {
    if (!onboarding) return { error: new Error('No onboarding found') };

    try {
      const { error } = await supabase
        .from('customer_onboarding')
        .update(data)
        .eq('id', onboarding.id);

      if (error) throw error;

      await fetchOnboarding();
      return { error: null };
    } catch (error: any) {
      console.error('Error updating onboarding:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchOnboarding();
  }, [fetchOnboarding]);

  return {
    onboarding,
    steps,
    loading,
    createOnboarding,
    updateStep,
    completeStep,
    updateOnboarding,
    refetch: fetchOnboarding
  };
};

// Admin hook for managing all onboardings
export const useOnboardingAdmin = () => {
  const { toast } = useToast();
  const [onboardings, setOnboardings] = useState<CustomerOnboarding[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOnboardings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('customer_onboarding')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOnboardings((data || []) as CustomerOnboarding[]);
    } catch (error: any) {
      console.error('Error fetching onboardings:', error);
      toast({
        title: 'Error loading onboardings',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getOnboardingDetails = async (onboardingId: string) => {
    try {
      const { data: onboarding, error: onboardingError } = await supabase
        .from('customer_onboarding')
        .select('*')
        .eq('id', onboardingId)
        .single();

      if (onboardingError) throw onboardingError;

      const { data: steps, error: stepsError } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('onboarding_id', onboardingId)
        .order('step_number', { ascending: true });

      if (stepsError) throw stepsError;

      const { data: emails, error: emailsError } = await supabase
        .from('onboarding_emails')
        .select('*')
        .eq('onboarding_id', onboardingId)
        .order('sent_at', { ascending: false });

      if (emailsError) throw emailsError;

      return {
        data: {
          ...onboarding,
          steps: steps || [],
          emails: emails || []
        },
        error: null
      };
    } catch (error: any) {
      console.error('Error fetching onboarding details:', error);
      return { data: null, error };
    }
  };

  const updateOnboardingStatus = async (onboardingId: string, status: OnboardingStatus, notes?: string) => {
    try {
      const updateData: Record<string, any> = { status };
      if (notes) updateData.notes = notes;
      if (status === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('customer_onboarding')
        .update(updateData)
        .eq('id', onboardingId);

      if (error) throw error;

      await fetchAllOnboardings();
      return { error: null };
    } catch (error: any) {
      console.error('Error updating onboarding status:', error);
      return { error };
    }
  };

  const assignRep = async (onboardingId: string, repId: string) => {
    try {
      const { error } = await supabase
        .from('customer_onboarding')
        .update({ assigned_rep: repId })
        .eq('id', onboardingId);

      if (error) throw error;

      await fetchAllOnboardings();
      return { error: null };
    } catch (error: any) {
      console.error('Error assigning rep:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchAllOnboardings();
  }, [fetchAllOnboardings]);

  return {
    onboardings,
    loading,
    fetchAllOnboardings,
    getOnboardingDetails,
    updateOnboardingStatus,
    assignRep,
    refetch: fetchAllOnboardings
  };
};
