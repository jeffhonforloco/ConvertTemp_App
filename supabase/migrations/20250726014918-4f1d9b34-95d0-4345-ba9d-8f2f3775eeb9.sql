-- Create comprehensive admin panel tables for ConvertTemp platform

-- Create user_role enum
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create conversion_events table for analytics
CREATE TABLE IF NOT EXISTS public.conversion_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    session_id TEXT NOT NULL,
    from_unit TEXT NOT NULL,
    to_unit TEXT NOT NULL,
    from_value NUMERIC NOT NULL,
    to_value NUMERIC NOT NULL,
    method TEXT DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on conversion_events
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversion_events
CREATE POLICY "Anyone can insert conversion events" 
ON public.conversion_events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all conversion events" 
ON public.conversion_events FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create ad_networks table
CREATE TABLE IF NOT EXISTS public.ad_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network_type TEXT NOT NULL,
    name TEXT NOT NULL,
    publisher_id TEXT,
    api_key TEXT,
    is_active BOOLEAN DEFAULT false,
    revenue_share NUMERIC DEFAULT 0.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on ad_networks
ALTER TABLE public.ad_networks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ad_networks
CREATE POLICY "Admins can manage ad networks" 
ON public.ad_networks FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create ad_slots table
CREATE TABLE IF NOT EXISTS public.ad_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network_id UUID REFERENCES public.ad_networks(id) ON DELETE CASCADE,
    slot_type TEXT NOT NULL,
    slot_id TEXT NOT NULL,
    size TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on ad_slots
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ad_slots
CREATE POLICY "Anyone can view active ad slots" 
ON public.ad_slots FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage ad slots" 
ON public.ad_slots FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create ad_revenue table
CREATE TABLE IF NOT EXISTS public.ad_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network_id UUID REFERENCES public.ad_networks(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    revenue NUMERIC DEFAULT 0,
    cpm NUMERIC DEFAULT 0,
    cpc NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(network_id, date)
);

-- Enable RLS on ad_revenue
ALTER TABLE public.ad_revenue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ad_revenue
CREATE POLICY "Admins can manage ad revenue" 
ON public.ad_revenue FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for app_settings
CREATE POLICY "Admins can manage app settings" 
ON public.app_settings FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_networks_updated_at 
    BEFORE UPDATE ON public.ad_networks 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_slots_updated_at 
    BEFORE UPDATE ON public.ad_slots 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at 
    BEFORE UPDATE ON public.app_settings 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default ad networks
INSERT INTO public.ad_networks (network_type, name, is_active) VALUES 
('google_adsense', 'Google AdSense', false),
('media_net', 'Media.net', false),
('propeller_ads', 'PropellerAds', false),
('ezoic', 'Ezoic', false)
ON CONFLICT DO NOTHING;

-- Insert default app settings
INSERT INTO public.app_settings (key, value, description) VALUES 
('site_name', '"ConvertTemp"', 'Website name'),
('site_description', '"Professional temperature conversion tool"', 'Website description'),
('analytics_enabled', 'true', 'Enable analytics tracking'),
('maintenance_mode', 'false', 'Maintenance mode toggle')
ON CONFLICT (key) DO NOTHING;