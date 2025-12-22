-- Create ticket priority enum
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create ticket status enum  
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'waiting_customer', 'waiting_internal', 'resolved', 'closed');

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status public.ticket_status NOT NULL DEFAULT 'open',
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  category TEXT DEFAULT 'general',
  
  -- Requester info
  requester_id UUID REFERENCES auth.users(id),
  requester_email TEXT NOT NULL,
  requester_name TEXT,
  
  -- Account/contact links
  account_id UUID REFERENCES public.crm_accounts(id),
  contact_id UUID REFERENCES public.crm_contacts(id),
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  assigned_team TEXT,
  
  -- Product association
  product_name TEXT,
  license_id UUID REFERENCES public.product_licenses(id),
  
  -- Resolution
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  
  -- SLA tracking
  first_response_at TIMESTAMP WITH TIME ZONE,
  sla_due_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket comments/notes table
CREATE TABLE public.ticket_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_email TEXT,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- Internal notes vs public replies
  is_resolution BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket attachments table
CREATE TABLE public.ticket_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.ticket_comments(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket watchers table
CREATE TABLE public.ticket_watchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ticket_id, user_id)
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_watchers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_tickets
CREATE POLICY "Admins can manage all tickets"
  ON public.support_tickets FOR ALL
  USING (public.is_admin());

CREATE POLICY "Support reps can manage tickets"
  ON public.support_tickets FOR ALL
  USING (public.has_role(auth.uid(), 'customer_rep'));

CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets FOR SELECT
  USING (requester_id = auth.uid() OR requester_email = auth.email());

CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (requester_id = auth.uid() OR requester_email = auth.email());

CREATE POLICY "Users can update their own open tickets"
  ON public.support_tickets FOR UPDATE
  USING (requester_id = auth.uid() AND status IN ('open', 'waiting_customer'));

-- RLS Policies for ticket_comments
CREATE POLICY "Admins can manage all comments"
  ON public.ticket_comments FOR ALL
  USING (public.is_admin());

CREATE POLICY "Support reps can manage comments"
  ON public.ticket_comments FOR ALL
  USING (public.has_role(auth.uid(), 'customer_rep'));

CREATE POLICY "Users can view non-internal comments on their tickets"
  ON public.ticket_comments FOR SELECT
  USING (
    is_internal = false AND 
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_comments.ticket_id 
      AND (requester_id = auth.uid() OR requester_email = auth.email())
    )
  );

CREATE POLICY "Users can add comments to their tickets"
  ON public.ticket_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    is_internal = false AND
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_comments.ticket_id 
      AND (requester_id = auth.uid() OR requester_email = auth.email())
    )
  );

-- RLS Policies for ticket_attachments
CREATE POLICY "Admins can manage attachments"
  ON public.ticket_attachments FOR ALL
  USING (public.is_admin());

CREATE POLICY "Support reps can manage attachments"
  ON public.ticket_attachments FOR ALL
  USING (public.has_role(auth.uid(), 'customer_rep'));

CREATE POLICY "Users can view attachments on their tickets"
  ON public.ticket_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_attachments.ticket_id 
      AND (requester_id = auth.uid() OR requester_email = auth.email())
    )
  );

-- RLS Policies for ticket_watchers
CREATE POLICY "Admins can manage watchers"
  ON public.ticket_watchers FOR ALL
  USING (public.is_admin());

CREATE POLICY "Support reps can manage watchers"
  ON public.ticket_watchers FOR ALL
  USING (public.has_role(auth.uid(), 'customer_rep'));

CREATE POLICY "Users can manage their own watch status"
  ON public.ticket_watchers FOR ALL
  USING (user_id = auth.uid());

-- Create function to generate ticket number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD(CAST(FLOOR(RANDOM() * 10000) AS TEXT), 4, '0');
  RETURN NEW;
END;
$$;

-- Create trigger for ticket number generation
CREATE TRIGGER generate_ticket_number_trigger
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_ticket_number();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_ticket_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ticket_updated_at();

CREATE TRIGGER update_ticket_comments_updated_at
  BEFORE UPDATE ON public.ticket_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ticket_updated_at();

-- Create indexes for performance
CREATE INDEX idx_support_tickets_requester ON public.support_tickets(requester_id);
CREATE INDEX idx_support_tickets_assigned ON public.support_tickets(assigned_to);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_account ON public.support_tickets(account_id);
CREATE INDEX idx_ticket_comments_ticket ON public.ticket_comments(ticket_id);
CREATE INDEX idx_ticket_attachments_ticket ON public.ticket_attachments(ticket_id);