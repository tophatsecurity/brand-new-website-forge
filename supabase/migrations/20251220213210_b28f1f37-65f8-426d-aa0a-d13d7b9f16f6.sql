-- Add new roles to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'var';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer_rep';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';