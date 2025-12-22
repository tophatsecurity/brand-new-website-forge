-- Drop constraints first
ALTER TABLE license_catalog DROP CONSTRAINT IF EXISTS valid_license_model;
ALTER TABLE license_catalog DROP CONSTRAINT IF EXISTS valid_product_type;

-- Update existing 'demo' license_model to 'evaluation'
UPDATE license_catalog SET license_model = 'evaluation' WHERE license_model = 'demo';

-- Add the new constraints
ALTER TABLE license_catalog ADD CONSTRAINT valid_license_model 
  CHECK (license_model = ANY (ARRAY['perpetual'::text, 'subscription'::text, 'evaluation'::text, 'beta'::text, 'alpha'::text]));

ALTER TABLE license_catalog ADD CONSTRAINT valid_product_type 
  CHECK (product_type = ANY (ARRAY['software'::text, 'maintenance'::text, 'service'::text, 'bundle'::text, 'free'::text, 'evaluation'::text]));