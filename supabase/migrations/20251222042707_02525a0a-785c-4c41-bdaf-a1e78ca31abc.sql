-- Create audit_log table for tracking user activity
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_name TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_entity_type ON public.audit_log(entity_type);
CREATE INDEX idx_audit_log_action ON public.audit_log(action);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_log_entity_id ON public.audit_log(entity_id);

-- Enable Row Level Security
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.audit_log
FOR SELECT
USING (is_admin());

-- Allow inserts for logging (service role or authenticated users for their own actions)
CREATE POLICY "Allow insert for audit logging"
ON public.audit_log
FOR INSERT
WITH CHECK (true);

-- Only admins can delete audit logs (for cleanup purposes)
CREATE POLICY "Only admins can delete audit logs"
ON public.audit_log
FOR DELETE
USING (is_admin());

-- Add support license type to product options
-- First add 'support' to product_type if not exists (checking enum or text)
-- Since product_type is TEXT, we can use any value