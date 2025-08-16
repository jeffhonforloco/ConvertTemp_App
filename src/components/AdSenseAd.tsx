
import { useEffect } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true, 
  style = {},
  className = '' 
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1429920113100814';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ad after a short delay to ensure script is loaded
      setTimeout(() => {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        } catch (e) {
          console.log('AdSense error:', e);
        }
      }, 100);
    } catch (e) {
      console.log('AdSense script loading error:', e);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-1429920113100814"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}

// Banner ad component for top/bottom placement
export function BannerAd({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <AdSenseAd
      adSlot="8234567890"
      adFormat="auto"
      className={`banner-ad ${className}`}
      style={{ minHeight: '90px', ...style }}
    />
  );
}
