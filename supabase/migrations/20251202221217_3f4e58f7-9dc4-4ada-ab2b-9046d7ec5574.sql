-- Drop and recreate the constraint to include beta and alpha
ALTER TABLE public.license_catalog DROP CONSTRAINT IF EXISTS valid_license_model;
ALTER TABLE public.license_catalog 
ADD CONSTRAINT valid_license_model CHECK (license_model IN ('perpetual', 'subscription', 'demo', 'beta', 'alpha'));

-- Insert new products
INSERT INTO public.license_catalog (product_name, description, demo_duration_days, demo_seats, demo_features, product_type, license_model, maintenance_included, support_level) VALUES
('ICS Probe', 'Industrial Control System network probe for monitoring and security assessment', 30, 1, ARRAY['api_access', 'real_time_alerts', 'data_export'], 'software', 'beta', false, 'premium'),
('ORANGE Scada Simulator', 'SCADA system simulator for testing and training on industrial control environments', 30, 2, ARRAY['custom_dashboards', 'advanced_reporting'], 'software', 'alpha', false, 'standard');