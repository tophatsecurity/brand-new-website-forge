-- Create SLA configuration table for per-product/SKU SLA limits
CREATE TABLE public.sla_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  sku TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  first_response_hours INTEGER NOT NULL DEFAULT 24,
  resolution_hours INTEGER NOT NULL DEFAULT 72,
  business_hours_only BOOLEAN NOT NULL DEFAULT true,
  escalation_hours INTEGER,
  escalation_contact TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (product_name, sku, priority)
);

-- Enable RLS
ALTER TABLE public.sla_configurations ENABLE ROW LEVEL SECURITY;

-- Admins can manage SLA configurations
CREATE POLICY "Admins can manage SLA configurations"
ON public.sla_configurations
FOR ALL
USING (is_admin());

-- Anyone authenticated can view active SLA configurations
CREATE POLICY "Authenticated users can view active SLAs"
ON public.sla_configurations
FOR SELECT
USING (is_active = true);

-- Add SLA tracking columns to support_tickets
ALTER TABLE public.support_tickets
ADD COLUMN IF NOT EXISTS sla_config_id UUID REFERENCES public.sla_configurations(id),
ADD COLUMN IF NOT EXISTS sla_first_response_due TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sla_resolution_due TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sla_first_response_breached BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sla_resolution_breached BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sla_paused_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sla_paused_duration_minutes INTEGER DEFAULT 0;

-- Insert default SLA configurations for each priority level
INSERT INTO public.sla_configurations (product_name, priority, first_response_hours, resolution_hours, business_hours_only) VALUES
  ('DEFAULT', 'low', 48, 168, true),
  ('DEFAULT', 'medium', 24, 72, true),
  ('DEFAULT', 'high', 8, 24, true),
  ('DEFAULT', 'urgent', 2, 8, false);

-- Create function to calculate SLA due dates
CREATE OR REPLACE FUNCTION public.calculate_sla_due_dates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sla_config RECORD;
BEGIN
  -- Find matching SLA config (product+sku+priority first, then product+priority, then default)
  SELECT * INTO sla_config FROM public.sla_configurations
  WHERE is_active = true
    AND priority = NEW.priority::text
    AND (
      (product_name = NEW.product_name AND sku IS NOT NULL)
      OR (product_name = NEW.product_name AND sku IS NULL)
      OR product_name = 'DEFAULT'
    )
  ORDER BY 
    CASE WHEN product_name = NEW.product_name AND sku IS NOT NULL THEN 1
         WHEN product_name = NEW.product_name THEN 2
         ELSE 3 END
  LIMIT 1;

  IF sla_config IS NOT NULL THEN
    NEW.sla_config_id := sla_config.id;
    NEW.sla_first_response_due := NEW.created_at + (sla_config.first_response_hours || ' hours')::interval;
    NEW.sla_resolution_due := NEW.created_at + (sla_config.resolution_hours || ' hours')::interval;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to auto-calculate SLA on ticket creation
DROP TRIGGER IF EXISTS calculate_ticket_sla ON public.support_tickets;
CREATE TRIGGER calculate_ticket_sla
BEFORE INSERT ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.calculate_sla_due_dates();

-- Create function to check SLA breaches
CREATE OR REPLACE FUNCTION public.check_sla_breach()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check first response breach
  IF NEW.first_response_at IS NULL 
     AND NEW.sla_first_response_due IS NOT NULL 
     AND now() > NEW.sla_first_response_due THEN
    NEW.sla_first_response_breached := true;
  END IF;

  -- Check resolution breach
  IF NEW.status NOT IN ('resolved', 'closed')
     AND NEW.sla_resolution_due IS NOT NULL
     AND now() > NEW.sla_resolution_due THEN
    NEW.sla_resolution_breached := true;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to check SLA breach on update
DROP TRIGGER IF EXISTS check_ticket_sla_breach ON public.support_tickets;
CREATE TRIGGER check_ticket_sla_breach
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.check_sla_breach();