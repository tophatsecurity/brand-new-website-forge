
-- Add SKU column to license_catalog
ALTER TABLE public.license_catalog ADD COLUMN IF NOT EXISTS sku text;

-- Create unique constraint and index for SKU
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'license_catalog_sku_key') THEN
    ALTER TABLE public.license_catalog ADD CONSTRAINT license_catalog_sku_key UNIQUE (sku);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_license_catalog_sku ON public.license_catalog(sku);

-- Insert SKUs for all products and services
INSERT INTO public.license_catalog (product_name, sku, description, product_type, license_model, support_level, base_price, is_active)
VALUES 
  -- SeekCap
  ('SeekCap', 'SC-SW-STD', 'SeekCap Software License - Standard', 'software', 'perpetual', 'standard', 5000, true),
  ('SeekCap', 'SC-SW-PRO', 'SeekCap Software License - Professional', 'software', 'perpetual', 'premium', 10000, true),
  ('SeekCap', 'SC-SW-ENT', 'SeekCap Software License - Enterprise', 'software', 'perpetual', 'enterprise', 25000, true),
  ('SeekCap', 'SC-MNT-1Y', 'SeekCap Maintenance Agreement - 1 Year', 'maintenance', 'subscription', 'standard', 1000, true),
  ('SeekCap', 'SC-SVC-STD', 'SeekCap Support Service - Standard', 'service', 'subscription', 'standard', 500, true),
  ('SeekCap', 'SC-SVC-PRM', 'SeekCap Support Service - Premium 24/7', 'service', 'subscription', 'premium', 2000, true),
  -- DDX
  ('DDX', 'DDX-SW-STD', 'DDX Software License - Standard', 'software', 'perpetual', 'standard', 8000, true),
  ('DDX', 'DDX-SW-PRO', 'DDX Software License - Professional', 'software', 'perpetual', 'premium', 15000, true),
  ('DDX', 'DDX-SW-ENT', 'DDX Software License - Enterprise', 'software', 'perpetual', 'enterprise', 35000, true),
  ('DDX', 'DDX-MNT-1Y', 'DDX Maintenance Agreement - 1 Year', 'maintenance', 'subscription', 'standard', 1600, true),
  ('DDX', 'DDX-SVC-STD', 'DDX Support Service - Standard', 'service', 'subscription', 'standard', 800, true),
  ('DDX', 'DDX-SVC-PRM', 'DDX Support Service - Premium 24/7', 'service', 'subscription', 'premium', 3000, true),
  -- ParaGuard
  ('ParaGuard', 'PG-SW-STD', 'ParaGuard Software License - Standard', 'software', 'perpetual', 'standard', 12000, true),
  ('ParaGuard', 'PG-SW-PRO', 'ParaGuard Software License - Professional', 'software', 'perpetual', 'premium', 22000, true),
  ('ParaGuard', 'PG-SW-ENT', 'ParaGuard Software License - Enterprise', 'software', 'perpetual', 'enterprise', 45000, true),
  ('ParaGuard', 'PG-MNT-1Y', 'ParaGuard Maintenance Agreement - 1 Year', 'maintenance', 'subscription', 'standard', 2400, true),
  ('ParaGuard', 'PG-SVC-STD', 'ParaGuard Support Service - Standard', 'service', 'subscription', 'standard', 1200, true),
  ('ParaGuard', 'PG-SVC-PRM', 'ParaGuard Support Service - Premium 24/7', 'service', 'subscription', 'premium', 4500, true),
  -- SecondLook
  ('SecondLook', 'SL-SW-STD', 'SecondLook Software License - Standard', 'software', 'perpetual', 'standard', 6000, true),
  ('SecondLook', 'SL-SW-PRO', 'SecondLook Software License - Professional', 'software', 'perpetual', 'premium', 12000, true),
  ('SecondLook', 'SL-SW-ENT', 'SecondLook Software License - Enterprise', 'software', 'perpetual', 'enterprise', 28000, true),
  ('SecondLook', 'SL-MNT-1Y', 'SecondLook Maintenance Agreement - 1 Year', 'maintenance', 'subscription', 'standard', 1200, true),
  ('SecondLook', 'SL-SVC-STD', 'SecondLook Support Service - Standard', 'service', 'subscription', 'standard', 600, true),
  ('SecondLook', 'SL-SVC-PRM', 'SecondLook Support Service - Premium 24/7', 'service', 'subscription', 'premium', 2400, true),
  -- Lightfoot
  ('Lightfoot', 'LF-SW-STD', 'Lightfoot Software License - Standard', 'software', 'perpetual', 'standard', 4000, true),
  ('Lightfoot', 'LF-SW-PRO', 'Lightfoot Software License - Professional', 'software', 'perpetual', 'premium', 8000, true),
  ('Lightfoot', 'LF-SW-ENT', 'Lightfoot Software License - Enterprise', 'software', 'perpetual', 'enterprise', 18000, true),
  ('Lightfoot', 'LF-MNT-1Y', 'Lightfoot Maintenance Agreement - 1 Year', 'maintenance', 'subscription', 'standard', 800, true),
  ('Lightfoot', 'LF-SVC-STD', 'Lightfoot Support Service - Standard', 'service', 'subscription', 'standard', 400, true),
  ('Lightfoot', 'LF-SVC-PRM', 'Lightfoot Support Service - Premium 24/7', 'service', 'subscription', 'premium', 1600, true),
  -- O-Range
  ('O-Range', 'OR-SW-STD', 'O-Range Software License - Standard', 'software', 'perpetual', 'standard', 7000, true),
  ('O-Range', 'OR-SW-PRO', 'O-Range Software License - Professional', 'software', 'perpetual', 'premium', 14000, true),
  ('O-Range', 'OR-SW-ENT', 'O-Range Software License - Enterprise', 'software', 'perpetual', 'enterprise', 32000, true),
  ('O-Range', 'OR-MNT-1Y', 'O-Range Maintenance Agreement - 1 Year', 'maintenance', 'subscription', 'standard', 1400, true),
  ('O-Range', 'OR-SVC-STD', 'O-Range Support Service - Standard', 'service', 'subscription', 'standard', 700, true),
  ('O-Range', 'OR-SVC-PRM', 'O-Range Support Service - Premium 24/7', 'service', 'subscription', 'premium', 2800, true),
  -- Aurora Sense
  ('Aurora Sense', 'AS-SW-STD', 'Aurora Sense Software License - Standard', 'software', 'perpetual', 'standard', 9000, true),
  ('Aurora Sense', 'AS-SW-PRO', 'Aurora Sense Software License - Professional', 'software', 'perpetual', 'premium', 18000, true),
  ('Aurora Sense', 'AS-SW-ENT', 'Aurora Sense Software License - Enterprise', 'software', 'perpetual', 'enterprise', 40000, true),
  ('Aurora Sense', 'AS-MNT-1Y', 'Aurora Sense Maintenance Agreement - 1 Year', 'maintenance', 'subscription', 'standard', 1800, true),
  ('Aurora Sense', 'AS-SVC-STD', 'Aurora Sense Support Service - Standard', 'service', 'subscription', 'standard', 900, true),
  ('Aurora Sense', 'AS-SVC-PRM', 'Aurora Sense Support Service - Premium 24/7', 'service', 'subscription', 'premium', 3600, true),
  -- Product Bundles
  ('SeekCap', 'SC-BDL-COMP', 'SeekCap Complete Bundle (Software + Maintenance + Support)', 'bundle', 'perpetual', 'premium', 12000, true),
  ('DDX', 'DDX-BDL-COMP', 'DDX Complete Bundle (Software + Maintenance + Support)', 'bundle', 'perpetual', 'premium', 20000, true),
  ('ParaGuard', 'PG-BDL-COMP', 'ParaGuard Complete Bundle (Software + Maintenance + Support)', 'bundle', 'perpetual', 'premium', 28000, true),
  ('SecondLook', 'SL-BDL-COMP', 'SecondLook Complete Bundle (Software + Maintenance + Support)', 'bundle', 'perpetual', 'premium', 15000, true),
  ('Lightfoot', 'LF-BDL-COMP', 'Lightfoot Complete Bundle (Software + Maintenance + Support)', 'bundle', 'perpetual', 'premium', 10000, true),
  ('O-Range', 'OR-BDL-COMP', 'O-Range Complete Bundle (Software + Maintenance + Support)', 'bundle', 'perpetual', 'premium', 18000, true),
  ('Aurora Sense', 'AS-BDL-COMP', 'Aurora Sense Complete Bundle (Software + Maintenance + Support)', 'bundle', 'perpetual', 'premium', 24000, true),
  -- Professional Services (using perpetual as license model for one-time services)
  ('Professional Services', 'PS-INSTALL', 'Installation & Configuration Service', 'service', 'perpetual', 'standard', 2500, true),
  ('Professional Services', 'PS-TRAIN-1D', 'On-Site Training - 1 Day', 'service', 'perpetual', 'standard', 1500, true),
  ('Professional Services', 'PS-TRAIN-3D', 'On-Site Training - 3 Days', 'service', 'perpetual', 'premium', 4000, true),
  ('Professional Services', 'PS-CONSULT', 'Security Consultation - Per Day', 'service', 'perpetual', 'premium', 2000, true),
  ('Professional Services', 'PS-ASSESS', 'Security Assessment & Report', 'service', 'perpetual', 'enterprise', 5000, true),
  ('Professional Services', 'PS-INTEG', 'Custom Integration Development', 'service', 'perpetual', 'enterprise', 10000, true),
  ('Professional Services', 'PS-MIGR', 'Data Migration Service', 'service', 'perpetual', 'standard', 3000, true)
ON CONFLICT (sku) DO NOTHING;
