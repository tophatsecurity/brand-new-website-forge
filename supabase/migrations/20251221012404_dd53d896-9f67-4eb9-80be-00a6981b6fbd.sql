-- Allow admins to view all profiles for team member dropdowns
CREATE POLICY "Admins can view all profiles for team selection"
ON public.profiles
FOR SELECT
USING (is_admin());