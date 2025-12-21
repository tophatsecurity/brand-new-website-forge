-- Create download statistics table
CREATE TABLE public.download_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  download_id UUID NOT NULL REFERENCES public.product_downloads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Create indexes for efficient querying
CREATE INDEX idx_download_statistics_download_id ON public.download_statistics(download_id);
CREATE INDEX idx_download_statistics_downloaded_at ON public.download_statistics(downloaded_at DESC);
CREATE INDEX idx_download_statistics_user_id ON public.download_statistics(user_id);

-- Enable RLS
ALTER TABLE public.download_statistics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all download statistics"
ON public.download_statistics
FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can manage download statistics"
ON public.download_statistics
FOR ALL
USING (is_admin());

-- Allow insert from edge function (service role)
CREATE POLICY "Allow insert for tracking"
ON public.download_statistics
FOR INSERT
WITH CHECK (true);

-- Create a view for download counts
CREATE OR REPLACE VIEW public.download_counts AS
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