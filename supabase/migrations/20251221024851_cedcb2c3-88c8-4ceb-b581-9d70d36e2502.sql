-- Add stripe_customer_id and payment_verified to crm_accounts
ALTER TABLE public.crm_accounts 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_approved_by TEXT;

-- Add index for stripe customer lookup
CREATE INDEX IF NOT EXISTS idx_crm_accounts_stripe_customer 
ON public.crm_accounts(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;

-- Create payment_methods table for tracking customer payment methods
CREATE TABLE IF NOT EXISTS public.customer_payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.crm_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_payment_method_id TEXT NOT NULL,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payment_methods
ALTER TABLE public.customer_payment_methods ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment methods
CREATE POLICY "Users can view their own payment methods"
ON public.customer_payment_methods
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own payment methods
CREATE POLICY "Users can insert their own payment methods"
ON public.customer_payment_methods
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own payment methods
CREATE POLICY "Users can update their own payment methods"
ON public.customer_payment_methods
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own payment methods
CREATE POLICY "Users can delete their own payment methods"
ON public.customer_payment_methods
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all payment methods
CREATE POLICY "Admins can view all payment methods"
ON public.customer_payment_methods
FOR SELECT
USING (public.is_admin());

-- Admins can manage all payment methods
CREATE POLICY "Admins can manage all payment methods"
ON public.customer_payment_methods
FOR ALL
USING (public.is_admin());