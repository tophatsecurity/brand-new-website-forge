-- Create table to track user credit balances and purchases
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  catalog_id UUID REFERENCES public.license_catalog(id) ON DELETE SET NULL,
  credits_purchased INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  credits_remaining INTEGER GENERATED ALWAYS AS (credits_purchased - credits_used) STORED,
  package_name TEXT,
  price_paid NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_credit_status CHECK (status IN ('pending', 'approved', 'rejected', 'completed'))
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Users can view their own credit purchases
CREATE POLICY "Users can view own credits"
ON public.user_credits
FOR SELECT
USING (auth.uid() = user_id);

-- Users can request credit purchases (insert pending)
CREATE POLICY "Users can request credit purchases"
ON public.user_credits
FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Admins can manage all credit purchases
CREATE POLICY "Admins can manage all credits"
ON public.user_credits
FOR ALL
USING (is_admin());

-- Create index for faster lookups
CREATE INDEX idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX idx_user_credits_status ON public.user_credits(status);