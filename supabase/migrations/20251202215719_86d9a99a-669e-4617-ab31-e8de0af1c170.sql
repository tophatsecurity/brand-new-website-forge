-- Insert a Demo tier if it doesn't exist
INSERT INTO public.license_tiers (name, description, max_seats)
VALUES ('Demo', 'Demo license tier for trial purposes', 1)
ON CONFLICT DO NOTHING;

-- Add policy to allow users to create demo licenses for themselves
CREATE POLICY "Users can create their own demo licenses"
ON public.product_licenses
FOR INSERT
TO authenticated
WITH CHECK (assigned_to = auth.email());