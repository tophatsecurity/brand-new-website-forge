-- Add anonymous_handle column to user_settings for persistent anonymous usernames
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS anonymous_handle text DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.user_settings.anonymous_handle IS 'Persistent anonymous username for feature requests and other anonymous submissions';