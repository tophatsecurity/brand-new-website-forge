import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';

export interface GuestOnboarding {
  id: string;
  session_id: string;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  status: OnboardingStatus;
  current_step: number;
  total_steps: number;
  data: Record<string, any>;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

const GUEST_SESSION_KEY = 'guest_onboarding_session';

const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const useGuestOnboarding = () => {
  const { toast } = useToast();
  const [onboarding, setOnboarding] = useState<GuestOnboarding | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = getOrCreateSessionId();

  const fetchOnboarding = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('guest_onboarding')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;
      setOnboarding(data as GuestOnboarding | null);
    } catch (error: any) {
      console.error('Error fetching guest onboarding:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const createOnboarding = async (data: {
    company_name?: string;
    contact_name?: string;
    contact_email: string;
    contact_phone?: string;
  }) => {
    try {
      const { data: newOnboarding, error } = await supabase
        .from('guest_onboarding')
        .insert({
          session_id: sessionId,
          contact_email: data.contact_email,
          company_name: data.company_name,
          contact_name: data.contact_name,
          contact_phone: data.contact_phone,
          status: 'in_progress' as OnboardingStatus,
          started_at: new Date().toISOString(),
          data: {}
        })
        .select()
        .single();

      if (error) throw error;

      setOnboarding(newOnboarding as GuestOnboarding);
      return { data: newOnboarding, error: null };
    } catch (error: any) {
      console.error('Error creating guest onboarding:', error);
      return { data: null, error };
    }
  };

  const updateOnboarding = async (stepData: Record<string, any>) => {
    if (!onboarding) return { error: new Error('No onboarding found') };

    try {
      const newData = { ...onboarding.data, ...stepData };
      const { error } = await supabase
        .from('guest_onboarding')
        .update({ data: newData })
        .eq('id', onboarding.id);

      if (error) throw error;

      await fetchOnboarding();
      return { error: null };
    } catch (error: any) {
      console.error('Error updating guest onboarding:', error);
      return { error };
    }
  };

  const completeStep = async (stepNumber: number, stepData?: Record<string, any>) => {
    if (!onboarding) return { error: new Error('No onboarding found') };

    try {
      const newData = {
        ...onboarding.data,
        [`step_${stepNumber}`]: stepData || {},
        [`step_${stepNumber}_completed`]: true
      };

      const nextStep = Math.min(stepNumber + 1, onboarding.total_steps);
      const allCompleted = stepNumber === onboarding.total_steps;

      const { error } = await supabase
        .from('guest_onboarding')
        .update({
          data: newData,
          current_step: nextStep,
          status: allCompleted ? 'completed' : 'in_progress',
          completed_at: allCompleted ? new Date().toISOString() : null
        })
        .eq('id', onboarding.id);

      if (error) throw error;

      await fetchOnboarding();
      return { error: null };
    } catch (error: any) {
      console.error('Error completing step:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchOnboarding();
  }, [fetchOnboarding]);

  return {
    onboarding,
    loading,
    sessionId,
    createOnboarding,
    updateOnboarding,
    completeStep,
    refetch: fetchOnboarding
  };
};
