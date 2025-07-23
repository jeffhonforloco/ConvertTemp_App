import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  schema_markup?: any;
}

export function SEOHead({ 
  title: propTitle,
  description: propDescription,
  canonical: propCanonical,
  ogImage: propOgImage
}: SEOHeadProps = {}) {
  const location = useLocation();
  const [seoData, setSeoData] = useState<SEOData | null>(null);

  const defaultSEO = {
    title: propTitle || "ConvertTemp - Free Temperature Converter Online | °C °F K °R",
    description: propDescription || "Convert temperatures instantly between Celsius, Fahrenheit, Kelvin, and Rankine. Smart input detection, copy results, and mobile-optimized. 100% free temperature conversion tool for web and mobile.",
    keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter', 'rankine converter', 'temperature conversion calculator', 'free converter', 'online temperature tool', 'celsius fahrenheit calculator', 'temperature units'],
    canonical_url: propCanonical || "https://converttemp.com",
    og_image: propOgImage || "/og-image.png"
  };

  useEffect(() => {
    fetchSEOData();
  }, [location.pathname]);

  const fetchSEOData = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('path', location.pathname)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSeoData({
          title: data.title,
          description: data.description,
          keywords: data.keywords || [],
          canonical_url: data.canonical_url || undefined,
          og_title: data.og_title || data.title,
          og_description: data.og_description || data.description,
          og_image: data.og_image || defaultSEO.og_image,
          schema_markup: data.schema_markup
        });
      } else {
        setSeoData(defaultSEO);
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      setSeoData(defaultSEO);
    }
  };

  useEffect(() => {
    if (!seoData) return;

    const title = seoData.title;
    const description = seoData.description;
    const canonical = seoData.canonical_url || window.location.href;
    const ogImage = seoData.og_image || "/og-image.png";
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
    
    // Update Open Graph tags
    const updateMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };
    
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', canonical);
    updateMetaTag('og:image', ogImage);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:site_name', 'ConvertTemp');
    
    // Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };
    
    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', title);
    updateTwitterTag('twitter:description', description);
    updateTwitterTag('twitter:image', ogImage);
    
    // JSON-LD Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ConvertTemp",
      "description": description,
      "url": canonical,
      "applicationCategory": "Utility",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization", 
        "name": "ConvertTemp"
      }
    };
    
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
  }, [seoData]);
  
  return null; // This component doesn't render anything
}