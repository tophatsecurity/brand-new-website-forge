-- Create table to track feature request status history
CREATE TABLE public.feature_request_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_id UUID NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_by_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_request_history ENABLE ROW LEVEL SECURITY;

-- Anyone can view history for requests they can see
CREATE POLICY "Users can view history for their own requests"
  ON public.feature_request_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.feature_requests fr
      WHERE fr.id = feature_request_history.feature_id
      AND fr.submitted_by = auth.uid()
    )
  );

-- Admins and program managers can view all history
CREATE POLICY "Admins can view all history"
  ON public.feature_request_history
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Program managers can view all history"
  ON public.feature_request_history
  FOR SELECT
  USING (has_role(auth.uid(), 'program_manager'::app_role));

-- Only admins and program managers can insert history
CREATE POLICY "Admins can insert history"
  ON public.feature_request_history
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Program managers can insert history"
  ON public.feature_request_history
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'program_manager'::app_role));

-- Create trigger to automatically log status changes
CREATE OR REPLACE FUNCTION public.log_feature_request_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.feature_request_history (feature_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER feature_request_status_change_trigger
  AFTER UPDATE ON public.feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.log_feature_request_status_change();

-- Also log initial creation
CREATE OR REPLACE FUNCTION public.log_feature_request_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.feature_request_history (feature_id, old_status, new_status, changed_by)
  VALUES (NEW.id, NULL, NEW.status, auth.uid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER feature_request_creation_trigger
  AFTER INSERT ON public.feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.log_feature_request_creation();