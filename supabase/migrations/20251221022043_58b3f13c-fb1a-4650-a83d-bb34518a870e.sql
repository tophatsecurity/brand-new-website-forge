-- Create a guest onboarding table for users without accounts
CREATE TABLE IF NOT EXISTS public.guest_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  company_name TEXT,
  contact_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status public.onboarding_status NOT NULL DEFAULT 'not_started',
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL DEFAULT 5,
  data JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.guest_onboarding ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create guest onboarding (public access)
CREATE POLICY "Anyone can create guest onboarding" 
ON public.guest_onboarding 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view guest onboarding
CREATE POLICY "Anyone can view guest onboarding" 
ON public.guest_onboarding 
FOR SELECT 
USING (true);

-- Allow anyone to update guest onboarding
CREATE POLICY "Anyone can update guest onboarding" 
ON public.guest_onboarding 
FOR UPDATE 
USING (true);

-- Admins can manage all guest onboardings
CREATE POLICY "Admins can manage all guest onboarding" 
ON public.guest_onboarding 
FOR ALL 
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_guest_onboarding_updated_at
BEFORE UPDATE ON public.guest_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.update_onboarding_updated_at();