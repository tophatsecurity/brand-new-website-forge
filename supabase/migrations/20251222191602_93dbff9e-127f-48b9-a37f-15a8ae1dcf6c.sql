-- Add explicit DELETE policy for program managers (the ALL policy should cover it, but let's be explicit)
DROP POLICY IF EXISTS "Program managers can delete requests" ON public.feature_requests;

CREATE POLICY "Program managers can delete requests"
ON public.feature_requests
FOR DELETE
USING (has_role(auth.uid(), 'program_manager'::app_role));

-- Also ensure program managers can update
DROP POLICY IF EXISTS "Program managers can update requests" ON public.feature_requests;

CREATE POLICY "Program managers can update requests"
ON public.feature_requests
FOR UPDATE
USING (has_role(auth.uid(), 'program_manager'::app_role));