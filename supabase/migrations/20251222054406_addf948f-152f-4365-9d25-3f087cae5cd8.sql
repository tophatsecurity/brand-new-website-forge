-- Delete catalog items that are not referenced by product_downloads
DELETE FROM license_catalog WHERE id != 'e0a7cdfc-494a-44da-bf9c-b74e84d7226c';

-- Update the referenced item to be part of the new structure (LIGHTFOOT Premium)
UPDATE license_catalog 
SET product_name = 'LIGHTFOOT', 
    description = 'Lightfoot Premium - Advanced forensics with reporting',
    product_type = 'software',
    price_tier = 'professional',
    sku = 'LF-PRO',
    license_model = 'subscription',
    base_price = 4000,
    is_active = true
WHERE id = 'e0a7cdfc-494a-44da-bf9c-b74e84d7226c';

-- Insert the proper tier structure for each product
-- AURORA SENSE (5 tiers)
INSERT INTO license_catalog (product_name, description, product_type, price_tier, sku, license_model, base_price, is_active) VALUES
('AURORA SENSE', 'Aurora Sense Free Edition - Basic network sensing capabilities', 'free', 'free', 'AS-FREE', 'perpetual', 0, true),
('AURORA SENSE', 'Aurora Sense Evaluation - Full features for 30 days', 'evaluation', 'starter', 'AS-EVAL', 'evaluation', 0, true),
('AURORA SENSE', 'Aurora Sense Standard - Core network sensing for small teams', 'software', 'standard', 'AS-STD', 'subscription', 2500, true),
('AURORA SENSE', 'Aurora Sense Premium - Advanced sensing with priority support', 'software', 'professional', 'AS-PRO', 'subscription', 5000, true),
('AURORA SENSE', 'Aurora Sense Elite - Enterprise-grade sensing with all features', 'software', 'enterprise', 'AS-ELITE', 'perpetual', 15000, true);

-- DDX (5 tiers)
INSERT INTO license_catalog (product_name, description, product_type, price_tier, sku, license_model, base_price, is_active) VALUES
('DDX', 'DDX Free Edition - Basic deep packet inspection', 'free', 'free', 'DDX-FREE', 'perpetual', 0, true),
('DDX', 'DDX Evaluation - Full features for 30 days', 'evaluation', 'starter', 'DDX-EVAL', 'evaluation', 0, true),
('DDX', 'DDX Standard - Core deep packet inspection capabilities', 'software', 'standard', 'DDX-STD', 'subscription', 3000, true),
('DDX', 'DDX Premium - Advanced inspection with extended protocols', 'software', 'professional', 'DDX-PRO', 'subscription', 6000, true),
('DDX', 'DDX Elite - Enterprise deep packet inspection suite', 'software', 'enterprise', 'DDX-ELITE', 'perpetual', 18000, true);

-- LIGHTFOOT (4 tiers - Premium already exists from the updated referenced item)
INSERT INTO license_catalog (product_name, description, product_type, price_tier, sku, license_model, base_price, is_active) VALUES
('LIGHTFOOT', 'Lightfoot Free Edition - Basic network forensics', 'free', 'free', 'LF-FREE', 'perpetual', 0, true),
('LIGHTFOOT', 'Lightfoot Evaluation - Full features for 30 days', 'evaluation', 'starter', 'LF-EVAL', 'evaluation', 0, true),
('LIGHTFOOT', 'Lightfoot Standard - Core forensics capabilities', 'software', 'standard', 'LF-STD', 'subscription', 2000, true),
('LIGHTFOOT', 'Lightfoot Elite - Enterprise forensics with full features', 'software', 'enterprise', 'LF-ELITE', 'perpetual', 12000, true);

-- O-RANGE (5 tiers)
INSERT INTO license_catalog (product_name, description, product_type, price_tier, sku, license_model, base_price, is_active) VALUES
('O-RANGE', 'O-Range Free Edition - Basic OT network monitoring', 'free', 'free', 'OR-FREE', 'perpetual', 0, true),
('O-RANGE', 'O-Range Evaluation - Full features for 30 days', 'evaluation', 'starter', 'OR-EVAL', 'evaluation', 0, true),
('O-RANGE', 'O-Range Standard - Core OT monitoring capabilities', 'software', 'standard', 'OR-STD', 'subscription', 3500, true),
('O-RANGE', 'O-Range Premium - Advanced OT monitoring with alerts', 'software', 'professional', 'OR-PRO', 'subscription', 7000, true),
('O-RANGE', 'O-Range Elite - Enterprise OT monitoring suite', 'software', 'enterprise', 'OR-ELITE', 'perpetual', 20000, true);

-- PARAGUARD (5 tiers)
INSERT INTO license_catalog (product_name, description, product_type, price_tier, sku, license_model, base_price, is_active) VALUES
('PARAGUARD', 'ParaGuard Free Edition - Basic network protection', 'free', 'free', 'PG-FREE', 'perpetual', 0, true),
('PARAGUARD', 'ParaGuard Evaluation - Full features for 30 days', 'evaluation', 'starter', 'PG-EVAL', 'evaluation', 0, true),
('PARAGUARD', 'ParaGuard Standard - Core protection capabilities', 'software', 'standard', 'PG-STD', 'subscription', 2500, true),
('PARAGUARD', 'ParaGuard Premium - Advanced protection with threat intel', 'software', 'professional', 'PG-PRO', 'subscription', 5500, true),
('PARAGUARD', 'ParaGuard Elite - Enterprise protection suite', 'software', 'enterprise', 'PG-ELITE', 'perpetual', 16000, true);

-- SECONDLOOK (5 tiers)
INSERT INTO license_catalog (product_name, description, product_type, price_tier, sku, license_model, base_price, is_active) VALUES
('SECONDLOOK', 'SecondLook Free Edition - Basic traffic analysis', 'free', 'free', 'SL-FREE', 'perpetual', 0, true),
('SECONDLOOK', 'SecondLook Evaluation - Full features for 30 days', 'evaluation', 'starter', 'SL-EVAL', 'evaluation', 0, true),
('SECONDLOOK', 'SecondLook Standard - Core traffic analysis', 'software', 'standard', 'SL-STD', 'subscription', 2000, true),
('SECONDLOOK', 'SecondLook Premium - Advanced analysis with reporting', 'software', 'professional', 'SL-PRO', 'subscription', 4500, true),
('SECONDLOOK', 'SecondLook Elite - Enterprise traffic analysis', 'software', 'enterprise', 'SL-ELITE', 'perpetual', 14000, true);

-- SEEKCAP (5 tiers)
INSERT INTO license_catalog (product_name, description, product_type, price_tier, sku, license_model, base_price, is_active) VALUES
('SEEKCAP', 'SeekCap Free Edition - Basic packet capture', 'free', 'free', 'SC-FREE', 'perpetual', 0, true),
('SEEKCAP', 'SeekCap Evaluation - Full features for 30 days', 'evaluation', 'starter', 'SC-EVAL', 'evaluation', 0, true),
('SEEKCAP', 'SeekCap Standard - Core packet capture capabilities', 'software', 'standard', 'SC-STD', 'subscription', 1500, true),
('SEEKCAP', 'SeekCap Premium - Advanced capture with filtering', 'software', 'professional', 'SC-PRO', 'subscription', 3500, true),
('SEEKCAP', 'SeekCap Elite - Enterprise packet capture suite', 'software', 'enterprise', 'SC-ELITE', 'perpetual', 10000, true);