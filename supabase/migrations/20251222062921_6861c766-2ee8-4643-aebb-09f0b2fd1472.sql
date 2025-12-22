-- Add moderation fields to support_tickets
ALTER TABLE public.support_tickets
ADD COLUMN IF NOT EXISTS moderation_status text DEFAULT 'none',
ADD COLUMN IF NOT EXISTS moderation_notes text,
ADD COLUMN IF NOT EXISTS moderated_by uuid,
ADD COLUMN IF NOT EXISTS moderated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS flagged_for_review boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS flag_reason text,
ADD COLUMN IF NOT EXISTS escalated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS escalated_to uuid,
ADD COLUMN IF NOT EXISTS escalated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS escalation_reason text;

-- Add moderation flags to ticket_comments
ALTER TABLE public.ticket_comments
ADD COLUMN IF NOT EXISTS moderation_status text DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS flagged boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS flag_reason text,
ADD COLUMN IF NOT EXISTS moderated_by uuid,
ADD COLUMN IF NOT EXISTS moderated_at timestamp with time zone;

-- Comments for moderation status values
COMMENT ON COLUMN public.support_tickets.moderation_status IS 'none, under_review, approved, rejected, spam';
COMMENT ON COLUMN public.ticket_comments.moderation_status IS 'pending, approved, rejected, spam';

-- RLS policy for support role to moderate
CREATE POLICY "Support role can moderate tickets" 
ON public.ticket_comments 
FOR ALL
USING (has_role(auth.uid(), 'support'::app_role));

-- RLS policy for moderator role
CREATE POLICY "Moderators can manage tickets" 
ON public.support_tickets 
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Moderators can manage comments" 
ON public.ticket_comments 
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role));