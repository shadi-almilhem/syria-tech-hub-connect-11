
-- Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Policy: Only admins can delete any row in profiles
CREATE POLICY "Admins can delete any profile"
  ON public.profiles
  FOR DELETE
  USING (public.get_current_user_role() = 'admin');
