-- Insert OnBoard service product
INSERT INTO public.license_catalog (
  product_name, 
  description, 
  demo_duration_days, 
  demo_seats, 
  demo_features, 
  product_type, 
  license_model, 
  maintenance_included, 
  support_level,
  version,
  version_stage,
  release_date,
  changelog
) VALUES (
  'OnBoard',
  'Online service for hardware lookup requests - charged by processing unit credits',
  14,
  1,
  ARRAY['api_access', 'advanced_reporting', 'data_export'],
  'service',
  'subscription',
  false,
  'standard',
  '1.0.0',
  'stable',
  now(),
  'Initial release with hardware lookup API and credit-based billing'
);