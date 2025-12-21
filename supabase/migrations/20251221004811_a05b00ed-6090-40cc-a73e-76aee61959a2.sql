-- Add account_id to product_licenses to link licenses to CRM accounts
ALTER TABLE public.product_licenses 
ADD COLUMN account_id uuid REFERENCES public.crm_accounts(id) ON DELETE SET NULL;

-- Add account_id to customer_onboarding to link onboarding to CRM accounts
ALTER TABLE public.customer_onboarding 
ADD COLUMN account_id uuid REFERENCES public.crm_accounts(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX idx_product_licenses_account_id ON public.product_licenses(account_id);
CREATE INDEX idx_customer_onboarding_account_id ON public.customer_onboarding(account_id);

-- Update RLS policies to allow viewing linked data
CREATE POLICY "VARs and reps can view account licenses" 
ON public.product_licenses 
FOR SELECT 
USING (
  account_id IN (
    SELECT id FROM public.crm_accounts 
    WHERE EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('var', 'customer_rep')
    )
  )
);

CREATE POLICY "VARs and reps can view account onboarding" 
ON public.customer_onboarding 
FOR SELECT 
USING (
  account_id IN (
    SELECT id FROM public.crm_accounts 
    WHERE EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('var', 'customer_rep')
    )
  )
);