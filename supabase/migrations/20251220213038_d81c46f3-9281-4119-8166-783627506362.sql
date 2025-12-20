-- Create table to track host activations per license
CREATE TABLE public.license_activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id uuid NOT NULL REFERENCES public.product_licenses(id) ON DELETE CASCADE,
  host_identifier text NOT NULL,
  host_name text,
  host_ip text,
  activated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}',
  UNIQUE(license_id, host_identifier)
);

-- Enable RLS
ALTER TABLE public.license_activations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage all activations"
ON public.license_activations
FOR ALL
USING (public.is_admin());

CREATE POLICY "Users can view activations for their licenses"
ON public.license_activations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.product_licenses pl
    WHERE pl.id = license_id
    AND pl.assigned_to = auth.email()
  )
);

-- Create index for faster lookups
CREATE INDEX idx_license_activations_license_id ON public.license_activations(license_id);
CREATE INDEX idx_license_activations_host ON public.license_activations(host_identifier);

-- Add comment
COMMENT ON TABLE public.license_activations IS 'Tracks host activations for licenses to enforce max_hosts limits';