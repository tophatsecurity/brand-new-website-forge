-- Drop the problematic policy that queries auth.users directly
DROP POLICY IF EXISTS "Admins can manage product downloads" ON public.product_downloads;

-- The existing policies using is_admin() should work:
-- "Admins can insert downloads", "Admins can update downloads", "Admins can delete downloads"
-- But let's ensure they exist and are PERMISSIVE (not RESTRICTIVE)

-- Drop and recreate as PERMISSIVE policies
DROP POLICY IF EXISTS "Admins can insert downloads" ON public.product_downloads;
DROP POLICY IF EXISTS "Admins can update downloads" ON public.product_downloads;
DROP POLICY IF EXISTS "Admins can delete downloads" ON public.product_downloads;
DROP POLICY IF EXISTS "Only admins can modify product downloads" ON public.product_downloads;
DROP POLICY IF EXISTS "Only admins can update product downloads" ON public.product_downloads;
DROP POLICY IF EXISTS "Only admins can delete product downloads" ON public.product_downloads;

-- Create permissive admin policies
CREATE POLICY "Admins can insert downloads"
ON public.product_downloads
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update downloads"
ON public.product_downloads
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete downloads"
ON public.product_downloads
FOR DELETE
TO authenticated
USING (is_admin());