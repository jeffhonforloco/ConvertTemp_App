-- Create analytics tables for ConvertTemp

-- Table for storing temperature conversion events
CREATE TABLE public.conversion_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Anonymous user ID from localStorage
    session_id TEXT NOT NULL,
    from_unit TEXT NOT NULL,
    to_unit TEXT NOT NULL,
    from_value NUMERIC NOT NULL,
    to_value NUMERIC NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('manual', 'smart_input')),
    user_agent TEXT,
    locale TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for storing user interaction events
CREATE TABLE public.interaction_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    action TEXT NOT NULL,
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for storing page view events
CREATE TABLE public.page_view_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    page TEXT NOT NULL,
    user_agent TEXT,
    locale TEXT,
    url TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (making data public for now since no auth)
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_view_events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is a public analytics app)
CREATE POLICY "Allow public access to conversion events" 
ON public.conversion_events 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to interaction events" 
ON public.interaction_events 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to page view events" 
ON public.page_view_events 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_conversion_events_created_at ON public.conversion_events(created_at);
CREATE INDEX idx_conversion_events_user_id ON public.conversion_events(user_id);
CREATE INDEX idx_conversion_events_units ON public.conversion_events(from_unit, to_unit);

CREATE INDEX idx_interaction_events_created_at ON public.interaction_events(created_at);
CREATE INDEX idx_interaction_events_action ON public.interaction_events(action);

CREATE INDEX idx_page_view_events_created_at ON public.page_view_events(created_at);
CREATE INDEX idx_page_view_events_page ON public.page_view_events(page);