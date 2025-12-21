-- Add new account types to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'account_rep';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'marketing';