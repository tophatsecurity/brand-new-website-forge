-- Create product_documents table for documentation per product
CREATE TABLE public.product_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog_id UUID REFERENCES public.license_catalog(id) ON DELETE CASCADE,
  download_id UUID REFERENCES public.product_downloads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  document_type TEXT NOT NULL DEFAULT 'documentation', -- documentation, release_notes, readme, changelog, api_docs
  version TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create product_comments table for comments on products/downloads
CREATE TABLE public.product_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog_id UUID REFERENCES public.license_catalog(id) ON DELETE CASCADE,
  download_id UUID REFERENCES public.product_downloads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- Internal admin notes vs public comments
  parent_id UUID REFERENCES public.product_comments(id) ON DELETE CASCADE, -- For replies
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_documents
CREATE POLICY "Anyone can view documents" 
ON public.product_documents 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage documents" 
ON public.product_documents 
FOR ALL 
USING (is_admin());

CREATE POLICY "Program managers can manage documents" 
ON public.product_documents 
FOR ALL 
USING (has_role(auth.uid(), 'program_manager'));

-- RLS Policies for product_comments
CREATE POLICY "Anyone can view non-internal comments" 
ON public.product_comments 
FOR SELECT 
USING (is_internal = false OR is_admin() OR has_role(auth.uid(), 'program_manager'));

CREATE POLICY "Authenticated users can create comments" 
ON public.product_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" 
ON public.product_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
ON public.product_comments 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" 
ON public.product_comments 
FOR ALL 
USING (is_admin());

-- Add release_notes column to product_downloads for quick release notes
ALTER TABLE public.product_downloads ADD COLUMN IF NOT EXISTS release_notes TEXT;

-- Create updated_at trigger for both tables
CREATE TRIGGER update_product_documents_updated_at
BEFORE UPDATE ON public.product_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_crm_updated_at();

CREATE TRIGGER update_product_comments_updated_at
BEFORE UPDATE ON public.product_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_crm_updated_at();