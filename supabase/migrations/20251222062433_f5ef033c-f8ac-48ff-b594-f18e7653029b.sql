-- Add upcoming releases support for product_downloads
ALTER TABLE public.product_downloads
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'released',
ADD COLUMN IF NOT EXISTS expected_release_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS announcement_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS pre_order_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public';

-- Add roadmap fields to license_catalog for product management
ALTER TABLE public.license_catalog
ADD COLUMN IF NOT EXISTS roadmap_status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS next_release_version text,
ADD COLUMN IF NOT EXISTS next_release_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS end_of_life_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS end_of_support_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS product_owner text,
ADD COLUMN IF NOT EXISTS development_status text DEFAULT 'stable',
ADD COLUMN IF NOT EXISTS feature_highlights text[],
ADD COLUMN IF NOT EXISTS target_market text,
ADD COLUMN IF NOT EXISTS documentation_url text,
ADD COLUMN IF NOT EXISTS repository_url text;

-- Add comment for status values
COMMENT ON COLUMN public.product_downloads.status IS 'Status: released, upcoming, beta, deprecated, archived';
COMMENT ON COLUMN public.product_downloads.visibility IS 'Visibility: public, internal, preview';
COMMENT ON COLUMN public.license_catalog.roadmap_status IS 'Roadmap: active, maintenance, sunset, archived';
COMMENT ON COLUMN public.license_catalog.development_status IS 'Development: planning, active, stable, maintenance, deprecated';