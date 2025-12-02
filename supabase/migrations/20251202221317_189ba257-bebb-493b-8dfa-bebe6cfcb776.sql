-- Add version tracking columns to license_catalog
ALTER TABLE public.license_catalog 
ADD COLUMN IF NOT EXISTS version text DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS version_stage text DEFAULT 'stable',
ADD COLUMN IF NOT EXISTS release_date timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS changelog text,
ADD COLUMN IF NOT EXISTS min_version text,
ADD COLUMN IF NOT EXISTS latest_stable_version text;

-- Add check constraint for version stages
ALTER TABLE public.license_catalog 
ADD CONSTRAINT valid_version_stage CHECK (version_stage IN ('alpha', 'beta', 'rc', 'stable', 'deprecated'));

-- Update existing products with version info
UPDATE public.license_catalog SET 
  version = '1.0.0', 
  version_stage = 'stable',
  release_date = now()
WHERE product_name IN ('SeekCap', 'DDX', 'ParaGuard', 'SecondLook');

UPDATE public.license_catalog SET 
  version = '0.5.0', 
  version_stage = 'beta',
  release_date = now(),
  changelog = 'Initial beta release with core monitoring features'
WHERE product_name = 'ICS Probe';

UPDATE public.license_catalog SET 
  version = '0.2.0', 
  version_stage = 'alpha',
  release_date = now(),
  changelog = 'Early alpha release for testing and feedback'
WHERE product_name = 'ORANGE Scada Simulator';