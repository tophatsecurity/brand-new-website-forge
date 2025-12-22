-- Add monthly pricing columns to license_catalog
ALTER TABLE public.license_catalog 
ADD COLUMN IF NOT EXISTS monthly_price numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS billing_period text DEFAULT 'one-time' CHECK (billing_period IN ('one-time', 'monthly', 'annual', 'multi-year'));