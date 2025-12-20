-- Rename products
UPDATE public.license_catalog SET product_name = 'SEEKCAP', updated_at = now() WHERE id = '384a18cb-860b-492d-9a7e-ce9a07bd4a87';
UPDATE public.license_catalog SET product_name = 'PARAGUARD', updated_at = now() WHERE id = 'b1a76464-fa7a-4fbe-a30e-315bafb6b924';
UPDATE public.license_catalog SET product_name = 'SECONDLOOK', updated_at = now() WHERE id = '2d5b1af0-3e6f-42fe-a8ba-6a30b70c3b07';

-- Add Commercial and Free license tiers (no time limits)
INSERT INTO public.license_tiers (name, description, max_seats)
VALUES 
  ('Commercial', 'Commercial license with no time limits', 999999),
  ('Free', 'Free license with no time limits', 1)
ON CONFLICT DO NOTHING;