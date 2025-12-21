-- Add package_format column to product_downloads table
ALTER TABLE public.product_downloads 
ADD COLUMN IF NOT EXISTS package_format TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.product_downloads.package_format IS 'Package format type: exe, msi, deb, rpm, dmg, pkg, appimage, tar.gz, zip, ova, iso, docker, other';