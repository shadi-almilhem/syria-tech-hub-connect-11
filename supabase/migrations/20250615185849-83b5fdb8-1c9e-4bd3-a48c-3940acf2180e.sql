
-- Enable Row Level Security for public access to directory tables

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated/public) to select/list all profiles
CREATE POLICY "Allow public read profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Allow anyone (including unauthenticated/public) to select/list all jobs
CREATE POLICY "Allow public read jobs"
  ON public.jobs
  FOR SELECT
  USING (true);
