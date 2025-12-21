-- Create CRM accounts (companies) table
CREATE TABLE public.crm_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'USA',
  account_type TEXT DEFAULT 'prospect' CHECK (account_type IN ('prospect', 'customer', 'partner', 'vendor', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'churned')),
  annual_revenue NUMERIC,
  employee_count INTEGER,
  owner_id UUID REFERENCES auth.users(id),
  parent_account_id UUID REFERENCES public.crm_accounts(id),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CRM contacts table
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.crm_accounts(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  job_title TEXT,
  department TEXT,
  is_primary BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  lead_source TEXT,
  owner_id UUID REFERENCES auth.users(id),
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CRM deals/opportunities table
CREATE TABLE public.crm_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.crm_accounts(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  stage TEXT DEFAULT 'qualification' CHECK (stage IN ('qualification', 'discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability INTEGER DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  owner_id UUID REFERENCES auth.users(id),
  lead_source TEXT,
  next_step TEXT,
  competitors TEXT[],
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CRM activities table
CREATE TABLE public.crm_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.crm_accounts(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'task', 'note', 'demo', 'follow_up')),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  outcome TEXT,
  owner_id UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_crm_accounts_owner ON public.crm_accounts(owner_id);
CREATE INDEX idx_crm_accounts_status ON public.crm_accounts(status);
CREATE INDEX idx_crm_accounts_type ON public.crm_accounts(account_type);
CREATE INDEX idx_crm_contacts_account ON public.crm_contacts(account_id);
CREATE INDEX idx_crm_contacts_owner ON public.crm_contacts(owner_id);
CREATE INDEX idx_crm_deals_account ON public.crm_deals(account_id);
CREATE INDEX idx_crm_deals_stage ON public.crm_deals(stage);
CREATE INDEX idx_crm_deals_owner ON public.crm_deals(owner_id);
CREATE INDEX idx_crm_activities_account ON public.crm_activities(account_id);
CREATE INDEX idx_crm_activities_contact ON public.crm_activities(contact_id);
CREATE INDEX idx_crm_activities_deal ON public.crm_activities(deal_id);
CREATE INDEX idx_crm_activities_type ON public.crm_activities(activity_type);
CREATE INDEX idx_crm_activities_status ON public.crm_activities(status);

-- Enable RLS
ALTER TABLE public.crm_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_accounts
CREATE POLICY "Admins can manage all accounts" ON public.crm_accounts FOR ALL USING (is_admin());
CREATE POLICY "VARs and reps can view all accounts" ON public.crm_accounts FOR SELECT 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('var', 'customer_rep')));
CREATE POLICY "VARs and reps can manage accounts" ON public.crm_accounts FOR ALL 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('var', 'customer_rep')));
CREATE POLICY "Users can view their owned accounts" ON public.crm_accounts FOR SELECT 
  USING (owner_id = auth.uid());

-- RLS Policies for crm_contacts
CREATE POLICY "Admins can manage all contacts" ON public.crm_contacts FOR ALL USING (is_admin());
CREATE POLICY "VARs and reps can view all contacts" ON public.crm_contacts FOR SELECT 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('var', 'customer_rep')));
CREATE POLICY "VARs and reps can manage contacts" ON public.crm_contacts FOR ALL 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('var', 'customer_rep')));
CREATE POLICY "Users can view their owned contacts" ON public.crm_contacts FOR SELECT 
  USING (owner_id = auth.uid());

-- RLS Policies for crm_deals
CREATE POLICY "Admins can manage all deals" ON public.crm_deals FOR ALL USING (is_admin());
CREATE POLICY "VARs and reps can view all deals" ON public.crm_deals FOR SELECT 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('var', 'customer_rep')));
CREATE POLICY "VARs and reps can manage deals" ON public.crm_deals FOR ALL 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('var', 'customer_rep')));
CREATE POLICY "Users can view their owned deals" ON public.crm_deals FOR SELECT 
  USING (owner_id = auth.uid());

-- RLS Policies for crm_activities
CREATE POLICY "Admins can manage all activities" ON public.crm_activities FOR ALL USING (is_admin());
CREATE POLICY "VARs and reps can view all activities" ON public.crm_activities FOR SELECT 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('var', 'customer_rep')));
CREATE POLICY "VARs and reps can manage activities" ON public.crm_activities FOR ALL 
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('var', 'customer_rep')));
CREATE POLICY "Users can view their owned activities" ON public.crm_activities FOR SELECT 
  USING (owner_id = auth.uid() OR created_by = auth.uid());

-- Create update trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_crm_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_crm_accounts_updated_at BEFORE UPDATE ON public.crm_accounts 
  FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at();
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON public.crm_contacts 
  FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at();
CREATE TRIGGER update_crm_deals_updated_at BEFORE UPDATE ON public.crm_deals 
  FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at();
CREATE TRIGGER update_crm_activities_updated_at BEFORE UPDATE ON public.crm_activities 
  FOR EACH ROW EXECUTE FUNCTION public.update_crm_updated_at();