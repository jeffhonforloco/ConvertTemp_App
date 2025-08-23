-- Fix security issue: Restrict orders table access to authenticated users only
-- Drop existing potentially vulnerable policies
DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
DROP POLICY IF EXISTS "update_order" ON public.orders;

-- Create secure policies for orders table
-- Users can only select their own orders (authenticated users only)
CREATE POLICY "authenticated_users_select_own_orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR email = auth.email())
);

-- Only allow updates for authenticated users on their own orders
CREATE POLICY "authenticated_users_update_own_orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR email = auth.email())
);

-- Keep the insert policy but ensure it's restricted to authenticated users
DROP POLICY IF EXISTS "insert_order" ON public.orders;
CREATE POLICY "authenticated_users_insert_orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR email = auth.email())
);