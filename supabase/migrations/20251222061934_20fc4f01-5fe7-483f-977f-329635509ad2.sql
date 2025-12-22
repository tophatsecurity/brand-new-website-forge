-- Add RLS policies for support role
CREATE POLICY "Support role can manage tickets" 
ON public.support_tickets 
FOR ALL 
USING (has_role(auth.uid(), 'support'::app_role));

CREATE POLICY "Support role can manage comments" 
ON public.ticket_comments 
FOR ALL 
USING (has_role(auth.uid(), 'support'::app_role));

CREATE POLICY "Support role can manage all attachments" 
ON public.ticket_attachments 
FOR ALL 
USING (has_role(auth.uid(), 'support'::app_role));