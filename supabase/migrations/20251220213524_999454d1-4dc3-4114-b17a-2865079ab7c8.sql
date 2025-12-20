-- Create onboarding status enum
CREATE TYPE public.onboarding_status AS ENUM ('not_started', 'in_progress', 'completed', 'on_hold');

-- Create customer onboarding table
CREATE TABLE public.customer_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT,
  contact_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status onboarding_status NOT NULL DEFAULT 'not_started',
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL DEFAULT 5,
  assigned_rep UUID,
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create onboarding steps table
CREATE TABLE public.onboarding_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  onboarding_id UUID NOT NULL REFERENCES public.customer_onboarding(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  step_description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create onboarding email logs table
CREATE TABLE public.onboarding_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  onboarding_id UUID NOT NULL REFERENCES public.customer_onboarding(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  message_id TEXT,
  error_message TEXT
);

-- Enable RLS
ALTER TABLE public.customer_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_emails ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_onboarding
CREATE POLICY "Admins can manage all onboarding" 
ON public.customer_onboarding 
FOR ALL 
USING (is_admin());

CREATE POLICY "Customer reps can manage assigned onboarding" 
ON public.customer_onboarding 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('customer_rep', 'var')
  )
);

CREATE POLICY "Users can view their own onboarding" 
ON public.customer_onboarding 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding" 
ON public.customer_onboarding 
FOR UPDATE 
USING (user_id = auth.uid());

-- RLS Policies for onboarding_steps
CREATE POLICY "Admins can manage all steps" 
ON public.onboarding_steps 
FOR ALL 
USING (is_admin());

CREATE POLICY "Customer reps can manage steps" 
ON public.onboarding_steps 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.customer_onboarding co
    JOIN public.user_roles ur ON ur.user_id = auth.uid()
    WHERE co.id = onboarding_steps.onboarding_id
    AND ur.role IN ('customer_rep', 'var')
  )
);

CREATE POLICY "Users can view their own steps" 
ON public.onboarding_steps 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.customer_onboarding co
    WHERE co.id = onboarding_steps.onboarding_id
    AND co.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own steps" 
ON public.onboarding_steps 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.customer_onboarding co
    WHERE co.id = onboarding_steps.onboarding_id
    AND co.user_id = auth.uid()
  )
);

-- RLS Policies for onboarding_emails
CREATE POLICY "Admins can manage all emails" 
ON public.onboarding_emails 
FOR ALL 
USING (is_admin());

CREATE POLICY "Customer reps can view emails" 
ON public.onboarding_emails 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.customer_onboarding co
    JOIN public.user_roles ur ON ur.user_id = auth.uid()
    WHERE co.id = onboarding_emails.onboarding_id
    AND ur.role IN ('customer_rep', 'var')
  )
);

CREATE POLICY "Users can view their own emails" 
ON public.onboarding_emails 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.customer_onboarding co
    WHERE co.id = onboarding_emails.onboarding_id
    AND co.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customer_onboarding_updated_at
BEFORE UPDATE ON public.customer_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.update_onboarding_updated_at();

CREATE TRIGGER update_onboarding_steps_updated_at
BEFORE UPDATE ON public.onboarding_steps
FOR EACH ROW
EXECUTE FUNCTION public.update_onboarding_updated_at();

-- Create function to initialize onboarding steps
CREATE OR REPLACE FUNCTION public.initialize_onboarding_steps()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default onboarding steps
  INSERT INTO public.onboarding_steps (onboarding_id, step_number, step_name, step_description) VALUES
    (NEW.id, 1, 'Account Setup', 'Complete your account profile and verify your email'),
    (NEW.id, 2, 'Company Information', 'Provide your company details and contact information'),
    (NEW.id, 3, 'Product Selection', 'Choose the products and licenses you need'),
    (NEW.id, 4, 'License Activation', 'Activate your product licenses'),
    (NEW.id, 5, 'Training & Support', 'Complete training and access support resources');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create steps when onboarding is created
CREATE TRIGGER create_onboarding_steps
AFTER INSERT ON public.customer_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.initialize_onboarding_steps();