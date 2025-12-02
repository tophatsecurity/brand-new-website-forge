-- Create a license_catalog table for available products users can request demos for
CREATE TABLE public.license_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  description text NOT NULL,
  demo_duration_days integer NOT NULL DEFAULT 14,
  demo_seats integer NOT NULL DEFAULT 1,
  demo_features text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.license_catalog ENABLE ROW LEVEL SECURITY;

-- Everyone can view active catalog items
CREATE POLICY "Anyone can view active catalog"
ON public.license_catalog
FOR SELECT
TO authenticated
USING (is_active = true);

-- Admins can manage catalog
CREATE POLICY "Admins can manage catalog"
ON public.license_catalog
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Insert default catalog items
INSERT INTO public.license_catalog (product_name, description, demo_duration_days, demo_seats, demo_features) VALUES
('SeekCap', 'Network packet capture and analysis tool for security professionals', 14, 1, ARRAY['api_access', 'data_export']),
('DDX', 'Deep packet inspection and protocol analysis platform', 14, 1, ARRAY['api_access', 'advanced_reporting']),
('ParaGuard', 'Real-time threat detection and response system', 14, 1, ARRAY['real_time_alerts', 'custom_dashboards']),
('SecondLook', 'Forensic analysis and incident investigation tool', 14, 1, ARRAY['api_access', 'data_export', 'advanced_reporting']);