import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentModal } from '@/components/PaymentModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// Check premium status from multiple sources
const checkPremiumStatus = async (userEmail?: string) => {
  // Check localStorage first (for guests)
  const localAdRemoval = localStorage.getItem('converttemp-ads-removed') === 'true';
  if (localAdRemoval) return true;

  // Check Supabase for authenticated users
  if (userEmail) {
    try {
      const { data } = await supabase.functions.invoke('check-subscription', {
        body: { email: userEmail }
      });
      return data?.has_premium || false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  return false;
};

export function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true, 
  style = {},
  className = '' 
}: AdSenseAdProps) {
  const [showAd, setShowAd] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAds = async () => {
      const hasPremium = await checkPremiumStatus(user?.email);
      setShowAd(!hasPremium);
    };
    
    checkAds();
  }, [user?.email]);

  // Don't show ads if user has premium
  if (!showAd) {
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

// Remove ads button component with new payment modal
export function RemoveAdsButton() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      const premium = await checkPremiumStatus(user?.email);
      setHasPremium(premium);
    };
    
    checkStatus();

    // Listen for URL changes (payment success)
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment') === 'success') {
        setTimeout(checkStatus, 1000); // Delay to allow Stripe webhook to process
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange(); // Check on mount

    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [user?.email]);

  // Show success message if user has premium
  if (hasPremium) {
    return (
      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium">✨ You're enjoying an ad-free experience!</p>
        <p className="text-green-600 text-sm">Thank you for supporting ConvertTemp!</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Enjoying ConvertTemp?</h3>
        <p className="text-blue-700 text-sm mb-3">
          Remove ads and support development
        </p>
        <Button
          onClick={() => setShowPaymentModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Remove Ads
        </Button>
      </div>

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  );
}