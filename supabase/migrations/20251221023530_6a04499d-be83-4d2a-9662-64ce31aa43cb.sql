-- Create feature_requests table
CREATE TABLE public.feature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  product_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text DEFAULT 'medium',
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_by_email text,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create feature_votes table
CREATE TABLE public.feature_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(feature_id, user_id)
);

-- Enable RLS
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

-- Feature requests policies
CREATE POLICY "Anyone can view feature requests"
ON public.feature_requests FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create requests"
ON public.feature_requests FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own requests"
ON public.feature_requests FOR UPDATE
USING (submitted_by = auth.uid());

CREATE POLICY "Admins can manage all requests"
ON public.feature_requests FOR ALL
USING (is_admin());

CREATE POLICY "Program managers can manage requests"
ON public.feature_requests FOR ALL
USING (public.has_role(auth.uid(), 'program_manager'));

-- Feature votes policies
CREATE POLICY "Anyone can view votes"
ON public.feature_votes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can vote"
ON public.feature_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes"
ON public.feature_votes FOR DELETE
USING (auth.uid() = user_id);

-- Function to update vote count with proper search_path
CREATE OR REPLACE FUNCTION public.update_feature_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feature_requests 
    SET vote_count = vote_count + 1, updated_at = now()
    WHERE id = NEW.feature_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feature_requests 
    SET vote_count = vote_count - 1, updated_at = now()
    WHERE id = OLD.feature_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger for vote count
CREATE TRIGGER on_feature_vote_change
  AFTER INSERT OR DELETE ON public.feature_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_feature_vote_count();