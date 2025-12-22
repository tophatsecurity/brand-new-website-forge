-- Allow users to delete their own pending feature requests
CREATE POLICY "Users can delete their own pending requests"
ON public.feature_requests
FOR DELETE
USING (
  submitted_by = auth.uid() 
  AND status = 'pending'
);