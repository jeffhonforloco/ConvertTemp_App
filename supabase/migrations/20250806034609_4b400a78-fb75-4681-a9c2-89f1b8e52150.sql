-- Fix the RLS policies to avoid infinite recursion
-- Drop the existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can update user roles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies that don't cause recursion
-- Simple policy for users to access their own profile
CREATE POLICY "Users can view and update their own profile" 
ON public.profiles 
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for admins using the security definer function
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());