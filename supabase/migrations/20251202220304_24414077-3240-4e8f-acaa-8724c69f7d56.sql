-- Add delete policy for admins on license_catalog
CREATE POLICY "Admins can delete catalog items"
ON public.license_catalog
FOR DELETE
TO authenticated
USING (is_admin());