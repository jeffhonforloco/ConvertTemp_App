import { useEffect } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// Check if user has purchased ad removal
const hasRemovedAds = () => {
  return localStorage.getItem('converttemp-ads-removed') === 'true';
};

export function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true, 
  style = {},
  className = '' 
}: AdSenseAdProps) {
  // Don't show ads if user has removed them
  if (hasRemovedAds()) {
    return null;
  }

  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
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
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
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
      adSlot="YOUR_BANNER_AD_SLOT"
      adFormat="banner"
      className={`banner-ad ${className}`}
      style={{ minHeight: '90px', ...style }}
    />
  );
}

// Remove ads button component
export function RemoveAdsButton() {
  const handleRemoveAds = async () => {
    // This will redirect to Stripe checkout
    // For now, we'll simulate the purchase for demo purposes
    if (confirm('This will redirect you to payment. Continue?')) {
      // TODO: Implement Stripe checkout here
      alert('Stripe integration coming soon! For demo: ads removed locally.');
      localStorage.setItem('converttemp-ads-removed', 'true');
      window.location.reload();
    }
  };

  // Don't show button if ads are already removed
  if (hasRemovedAds()) {
    return (
      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium">✨ You're enjoying an ad-free experience!</p>
      </div>
    );
  }

  return (
    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-2">Enjoying ConvertTemp?</h3>
      <p className="text-blue-700 text-sm mb-3">
        Remove ads and support the development for just $2.99
      </p>
      <button
        onClick={handleRemoveAds}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Remove Ads Forever
      </button>
    </div>
  );
}