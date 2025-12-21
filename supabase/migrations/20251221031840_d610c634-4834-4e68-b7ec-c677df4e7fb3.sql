-- Create storage bucket for product downloads
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-downloads', 'product-downloads', true)
ON CONFLICT (id) DO NOTHING;

-- Add sha256 column to product_downloads table
ALTER TABLE public.product_downloads 
ADD COLUMN IF NOT EXISTS sha256_hash TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- RLS policies for storage bucket
-- Allow admins to upload files
CREATE POLICY "Admins can upload download files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-downloads' 
  AND public.is_admin()
);

-- Allow admins to update files
CREATE POLICY "Admins can update download files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-downloads' 
  AND public.is_admin()
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete download files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-downloads' 
  AND public.is_admin()
);

-- Allow anyone to view/download files (public bucket)
CREATE POLICY "Anyone can view download files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-downloads');