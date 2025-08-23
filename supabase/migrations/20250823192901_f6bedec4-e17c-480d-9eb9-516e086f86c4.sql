-- Fix security issue: Restrict analytics tables access to admins only
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow public access to conversion events" ON public.conversion_events;
DROP POLICY IF EXISTS "Allow public access to page view events" ON public.page_view_events;  
DROP POLICY IF EXISTS "Allow public access to interaction events" ON public.interaction_events;

-- Create secure policies for conversion_events
CREATE POLICY "Admins can view conversion events" 
ON public.conversion_events 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Allow conversion tracking" 
ON public.conversion_events 
FOR INSERT 
WITH CHECK (true);

-- Create secure policies for page_view_events  
CREATE POLICY "Admins can view page view events" 
ON public.page_view_events 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Allow page view tracking" 
ON public.page_view_events 
FOR INSERT 
WITH CHECK (true);

-- Create secure policies for interaction_events
CREATE POLICY "Admins can view interaction events" 
ON public.interaction_events 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Allow interaction tracking" 
ON public.interaction_events 
FOR INSERT 
WITH CHECK (true);