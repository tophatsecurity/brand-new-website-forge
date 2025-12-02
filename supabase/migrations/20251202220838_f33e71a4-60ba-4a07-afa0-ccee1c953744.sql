-- Add new columns to license_catalog for product types and settings
ALTER TABLE public.license_catalog 
ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'software',
ADD COLUMN IF NOT EXISTS license_model text NOT NULL DEFAULT 'subscription',
ADD COLUMN IF NOT EXISTS subscription_period_months integer DEFAULT 12,
ADD COLUMN IF NOT EXISTS maintenance_included boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS support_level text DEFAULT 'standard';

-- Add check constraint for valid values
ALTER TABLE public.license_catalog 
ADD CONSTRAINT valid_product_type CHECK (product_type IN ('software', 'maintenance', 'service', 'bundle')),
ADD CONSTRAINT valid_license_model CHECK (license_model IN ('perpetual', 'subscription', 'demo'));

-- Insert additional demo products
INSERT INTO public.license_catalog (product_name, description, demo_duration_days, demo_seats, demo_features, product_type, license_model, maintenance_included, support_level) VALUES
('Network Maintenance', 'Annual network maintenance and monitoring service', 30, 1, ARRAY['real_time_alerts'], 'maintenance', 'subscription', true, 'premium'),
('Security Consulting', 'Professional security consulting and assessment services', 14, 1, ARRAY['advanced_reporting'], 'service', 'perpetual', false, 'premium'),
('Enterprise Bundle', 'Complete security suite with all products included', 14, 5, ARRAY['api_access', 'advanced_reporting', 'real_time_alerts', 'custom_dashboards', 'data_export'], 'bundle', 'subscription', true, 'enterprise');

-- Update existing products with license model
UPDATE public.license_catalog SET license_model = 'demo', product_type = 'software' WHERE product_name IN ('SeekCap', 'DDX', 'ParaGuard', 'SecondLook');