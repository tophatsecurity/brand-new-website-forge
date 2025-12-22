-- Add Aurora Sense Hardware, Appliance, Hosted, and Field Devices
INSERT INTO public.license_catalog (
  product_name, sku, product_type, description, base_price, is_active, license_model
) VALUES 
  ('AURORA SENSE', 'AS-HW', 'hardware', 'Aurora Sense Hardware - Dedicated hardware unit for network sensing', 1500.00, true, 'perpetual'),
  ('AURORA SENSE', 'AS-APPL', 'appliance', 'Aurora Sense Appliance - Pre-configured sensing appliance', 1500.00, true, 'perpetual'),
  ('AURORA SENSE', 'AS-HOSTED', 'software', 'Aurora Sense Hosted - Cloud-hosted sensing solution', 1500.00, true, 'subscription'),
  ('AURORA SENSE', 'AS-FIELD', 'hardware', 'Aurora Sense Field Device - Portable field sensing unit', 1500.00, true, 'perpetual');