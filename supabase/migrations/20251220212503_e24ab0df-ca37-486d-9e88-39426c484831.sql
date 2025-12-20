-- Add host limits and network constraints to product_licenses
ALTER TABLE public.product_licenses
ADD COLUMN IF NOT EXISTS max_hosts integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS allowed_networks text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS activation_date timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS usage_hours_limit integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS concurrent_sessions integer DEFAULT 1;

-- Add comments for clarity
COMMENT ON COLUMN public.product_licenses.max_hosts IS 'Maximum number of hosts allowed for this license';
COMMENT ON COLUMN public.product_licenses.allowed_networks IS 'Array of allowed network CIDRs (e.g., 192.168.1.0/24)';
COMMENT ON COLUMN public.product_licenses.activation_date IS 'Date when the license was first activated';
COMMENT ON COLUMN public.product_licenses.usage_hours_limit IS 'Maximum usage hours allowed (null = unlimited)';
COMMENT ON COLUMN public.product_licenses.concurrent_sessions IS 'Maximum concurrent sessions allowed';