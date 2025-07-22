-- Create ad networks and revenue tracking tables
CREATE TYPE public.ad_network_type AS ENUM ('google_adsense', 'media_net', 'propeller_ads', 'ezoic');
CREATE TYPE public.ad_slot_type AS ENUM ('banner_top', 'banner_bottom', 'sidebar', 'in_content');

-- Ad Networks configuration table
CREATE TABLE public.ad_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_type ad_network_type NOT NULL,
  name TEXT NOT NULL,
  publisher_id TEXT,
  api_key TEXT,
  is_active BOOLEAN DEFAULT false,
  revenue_share DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(network_type)
);

-- Ad Slots table
CREATE TABLE public.ad_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES public.ad_networks(id) ON DELETE CASCADE,
  slot_type ad_slot_type NOT NULL,
  slot_id TEXT NOT NULL,
  size TEXT, -- e.g., "728x90", "300x250"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Revenue tracking table
CREATE TABLE public.ad_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES public.ad_networks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0.00,
  cpm DECIMAL(10,4) DEFAULT 0.00,
  cpc DECIMAL(10,4) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(network_id, date)
);

-- Rate limiting table for security
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  endpoint TEXT NOT NULL,
  requests_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SEO optimization table
CREATE TABLE public.seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[],
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  schema_markup JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ad networks (admin only)
CREATE POLICY "Admins can manage ad networks" ON public.ad_networks
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage ad slots" ON public.ad_slots
FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view revenue" ON public.ad_revenue
FOR SELECT USING (public.is_admin());

CREATE POLICY "Public can view SEO pages" ON public.seo_pages
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage SEO pages" ON public.seo_pages
FOR ALL USING (public.is_admin());

-- Rate limiting policies (allow inserts, admins can view)
CREATE POLICY "Allow rate limit tracking" ON public.rate_limits
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view rate limits" ON public.rate_limits
FOR SELECT USING (public.is_admin());

-- Insert default ad networks
INSERT INTO public.ad_networks (network_type, name, is_active) VALUES
('google_adsense', 'Google AdSense', false),
('media_net', 'Media.net', false),
('propeller_ads', 'PropellerAds', false),
('ezoic', 'Ezoic', false);

-- Insert default SEO pages
INSERT INTO public.seo_pages (path, title, description, keywords, og_title, og_description) VALUES
('/', 'ConvertTemp - Free Temperature Converter Tool', 'Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly. Free, fast, and accurate temperature conversion tool.', ARRAY['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'temperature conversion', 'free converter'], 'ConvertTemp - Free Temperature Converter', 'Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly with our free tool.'),
('/auth', 'Sign In - ConvertTemp', 'Sign in to ConvertTemp to access premium features and track your conversion history.', ARRAY['sign in', 'login', 'temperature converter account'], 'Sign In - ConvertTemp', 'Access your ConvertTemp account for premium features.'),
('/admin', 'Admin Dashboard - ConvertTemp', 'Admin dashboard for managing ConvertTemp analytics and user accounts.', ARRAY['admin', 'dashboard', 'analytics'], 'Admin Dashboard - ConvertTemp', 'Manage ConvertTemp analytics and user accounts.');

-- Triggers for updated_at
CREATE TRIGGER update_ad_networks_updated_at
  BEFORE UPDATE ON public.ad_networks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();

CREATE TRIGGER update_seo_pages_updated_at
  BEFORE UPDATE ON public.seo_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();