-- Drop and recreate the check constraint to include 'hardware' and 'appliance' types
ALTER TABLE public.license_catalog DROP CONSTRAINT IF EXISTS valid_product_type;

ALTER TABLE public.license_catalog ADD CONSTRAINT valid_product_type 
  CHECK (product_type IN ('software', 'free', 'evaluation', 'hardware', 'appliance', 'bundle', 'service'));

-- Add DDX Appliances
INSERT INTO public.license_catalog (
  product_name, sku, product_type, description, base_price, is_active, license_model
) VALUES 
  ('DDX', 'DDX-MINI-HW', 'hardware', 'DDX Mini Appliance - Compact hardware appliance for deep packet inspection', 26000.00, true, 'perpetual'),
  ('DDX', 'DDX-STD-HW', 'hardware', 'DDX Standard Appliance - Full-size hardware appliance for enterprise DPI', 45000.00, true, 'perpetual'),
  ('DDX', 'DDX-ELITE-HW', 'hardware', 'DDX Elite Appliance - High-performance hardware for large-scale deployments', 85000.00, true, 'perpetual');

-- Add SEEKCAP Appliances
INSERT INTO public.license_catalog (
  product_name, sku, product_type, description, base_price, is_active, license_model
) VALUES 
  ('SEEKCAP', 'SC-MINI-HW', 'hardware', 'SeekCap Mini Appliance - Compact capture appliance', 18000.00, true, 'perpetual'),
  ('SEEKCAP', 'SC-STD-HW', 'hardware', 'SeekCap Standard Appliance - Full-size capture appliance', 35000.00, true, 'perpetual'),
  ('SEEKCAP', 'SC-ELITE-HW', 'hardware', 'SeekCap Elite Appliance - High-performance capture for enterprise', 65000.00, true, 'perpetual');

-- Add PARAGUARD Appliances
INSERT INTO public.license_catalog (
  product_name, sku, product_type, description, base_price, is_active, license_model
) VALUES 
  ('PARAGUARD', 'PG-MINI-HW', 'hardware', 'ParaGuard Mini Appliance - Compact protection appliance', 15000.00, true, 'perpetual'),
  ('PARAGUARD', 'PG-STD-HW', 'hardware', 'ParaGuard Standard Appliance - Full-size protection appliance', 28000.00, true, 'perpetual'),
  ('PARAGUARD', 'PG-ELITE-HW', 'hardware', 'ParaGuard Elite Appliance - Enterprise protection appliance', 52000.00, true, 'perpetual');

-- Add SECONDLOOK Appliances
INSERT INTO public.license_catalog (
  product_name, sku, product_type, description, base_price, is_active, license_model
) VALUES 
  ('SECONDLOOK', 'SL-MINI-HW', 'hardware', 'SecondLook Mini Appliance - Compact traffic analysis appliance', 14000.00, true, 'perpetual'),
  ('SECONDLOOK', 'SL-STD-HW', 'hardware', 'SecondLook Standard Appliance - Full-size analysis appliance', 26000.00, true, 'perpetual'),
  ('SECONDLOOK', 'SL-ELITE-HW', 'hardware', 'SecondLook Elite Appliance - Enterprise analysis appliance', 48000.00, true, 'perpetual');

-- Add LIGHTFOOT Appliances
INSERT INTO public.license_catalog (
  product_name, sku, product_type, description, base_price, is_active, license_model
) VALUES 
  ('LIGHTFOOT', 'LF-MINI-HW', 'hardware', 'Lightfoot Mini Appliance - Compact forensics appliance', 12000.00, true, 'perpetual'),
  ('LIGHTFOOT', 'LF-STD-HW', 'hardware', 'Lightfoot Standard Appliance - Full-size forensics appliance', 22000.00, true, 'perpetual'),
  ('LIGHTFOOT', 'LF-ELITE-HW', 'hardware', 'Lightfoot Elite Appliance - Enterprise forensics appliance', 42000.00, true, 'perpetual');

-- Add O-RANGE Appliances
INSERT INTO public.license_catalog (
  product_name, sku, product_type, description, base_price, is_active, license_model
) VALUES 
  ('O-RANGE', 'OR-MINI-HW', 'hardware', 'O-Range Mini Appliance - Compact OT monitoring appliance', 16000.00, true, 'perpetual'),
  ('O-RANGE', 'OR-STD-HW', 'hardware', 'O-Range Standard Appliance - Full-size OT monitoring appliance', 30000.00, true, 'perpetual'),
  ('O-RANGE', 'OR-ELITE-HW', 'hardware', 'O-Range Elite Appliance - Enterprise OT monitoring appliance', 55000.00, true, 'perpetual');

-- Add AURORA SENSE Appliances
INSERT INTO public.license_catalog (
  product_name, sku, product_type, description, base_price, is_active, license_model
) VALUES 
  ('AURORA SENSE', 'AS-MINI-HW', 'hardware', 'Aurora Sense Mini Appliance - Compact sensing appliance', 14000.00, true, 'perpetual'),
  ('AURORA SENSE', 'AS-STD-HW', 'hardware', 'Aurora Sense Standard Appliance - Full-size sensing appliance', 25000.00, true, 'perpetual'),
  ('AURORA SENSE', 'AS-ELITE-HW', 'hardware', 'Aurora Sense Elite Appliance - Enterprise sensing appliance', 45000.00, true, 'perpetual');