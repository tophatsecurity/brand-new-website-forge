-- Fix the security definer view issue by dropping and recreating with security_invoker
DROP VIEW IF EXISTS public.download_counts;

CREATE OR REPLACE VIEW public.download_counts 
WITH (security_invoker = true) AS
SELECT 
  d.id as download_id,
  d.product_name,
  d.version,
  d.product_type,
  COUNT(ds.id) as total_downloads,
  COUNT(DISTINCT ds.user_id) as unique_users,
  MAX(ds.downloaded_at) as last_downloaded_at
FROM public.product_downloads d
LEFT JOIN public.download_statistics ds ON d.id = ds.download_id
GROUP BY d.id, d.product_name, d.version, d.product_type;