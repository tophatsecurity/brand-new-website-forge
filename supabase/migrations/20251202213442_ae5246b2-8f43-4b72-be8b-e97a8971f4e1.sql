-- Drop existing policies on product_downloads
DROP POLICY IF EXISTS "Anyone can view downloads" ON public.product_downloads;
DROP POLICY IF EXISTS "Admins can insert downloads" ON public.product_downloads;
DROP POLICY IF EXISTS "Admins can update downloads" ON public.product_downloads;
DROP POLICY IF EXISTS "Admins can delete downloads" ON public.product_downloads;

-- Enable RLS if not already enabled
ALTER TABLE public.product_downloads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view downloads
CREATE POLICY "Anyone can view downloads" 
ON public.product_downloads 
FOR SELECT 
USING (true);

-- Allow admins to insert downloads (using the is_admin() function)
CREATE POLICY "Admins can insert downloads" 
ON public.product_downloads 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Allow admins to update downloads
CREATE POLICY "Admins can update downloads" 
ON public.product_downloads 
FOR UPDATE 
USING (public.is_admin());

-- Allow admins to delete downloads
CREATE POLICY "Admins can delete downloads" 
ON public.product_downloads 
FOR DELETE 
USING (public.is_admin());