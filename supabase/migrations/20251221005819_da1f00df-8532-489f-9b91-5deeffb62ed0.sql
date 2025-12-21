-- Add admin role for admin@tophatsecurity.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('6fc2ead9-d033-44d1-b3cf-59c691f72018', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;