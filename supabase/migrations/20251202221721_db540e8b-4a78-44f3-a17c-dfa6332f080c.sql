-- Add credits and pricing fields to license_catalog
ALTER TABLE public.license_catalog 
ADD COLUMN IF NOT EXISTS credits_included integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_tier text DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS base_price decimal(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_per_credit decimal(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS credit_packages jsonb DEFAULT '[]';

-- Add check constraint for price tiers
ALTER TABLE public.license_catalog 
ADD CONSTRAINT valid_price_tier CHECK (price_tier IN ('free', 'starter', 'standard', 'professional', 'enterprise'));

-- Add catalog reference to product_downloads
ALTER TABLE public.product_downloads 
ADD COLUMN IF NOT EXISTS catalog_id uuid REFERENCES public.license_catalog(id);

-- Update OnBoard with credit info
UPDATE public.license_catalog SET 
  credits_included = 100,
  price_tier = 'standard',
  base_price = 99.00,
  price_per_credit = 0.50,
  credit_packages = '[{"name": "Starter", "credits": 100, "price": 49}, {"name": "Standard", "credits": 500, "price": 199}, {"name": "Professional", "credits": 2000, "price": 599}, {"name": "Enterprise", "credits": 10000, "price": 1999}]'::jsonb
WHERE product_name = 'OnBoard';

-- Update other products with basic pricing
UPDATE public.license_catalog SET 
  price_tier = 'standard',
  base_price = 299.00
WHERE product_name IN ('SeekCap', 'DDX', 'ParaGuard', 'SecondLook') AND price_tier IS NULL;

UPDATE public.license_catalog SET 
  price_tier = 'enterprise',
  base_price = 999.00
WHERE product_name = 'Enterprise Bundle';

UPDATE public.license_catalog SET 
  price_tier = 'professional',
  base_price = 499.00
WHERE product_name IN ('ICS Probe', 'ORANGE Scada Simulator');