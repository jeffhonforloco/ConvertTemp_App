import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdSlotProps {
  slotType: 'banner_top' | 'banner_bottom' | 'sidebar' | 'in_content';
  className?: string;
}

interface AdNetwork {
  id: string;
  network_type: string;
  name: string;
  publisher_id: string | null;
  is_active: boolean;
}

interface AdSlot {
  id: string;
  slot_type: string;
  slot_id: string;
  size: string | null;
  is_active: boolean;
  network: AdNetwork;
}

export function AdSlot({ slotType, className = '' }: AdSlotProps) {
  const [adSlot, setAdSlot] = useState<AdSlot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdSlot();
  }, [slotType]);

  const fetchAdSlot = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_slots')
        .select(`
          *,
          network:ad_networks!inner(*)
        `)
        .eq('slot_type', slotType)
        .eq('is_active', true)
        .eq('ad_networks.is_active', true)
        .maybeSingle();

      if (error) throw error;
      setAdSlot(data);
    } catch (error) {
      console.error('Error fetching ad slot:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-pulse bg-muted rounded h-24 w-full"></div>
      </div>
    );
  }

  if (!adSlot || !adSlot.network.publisher_id) {
    // Show placeholder ad space
    return (
      <div className={`border-2 border-dashed border-muted rounded-lg p-4 text-center text-muted-foreground ${className}`}>
        <div className="text-sm">Ad Space Available</div>
        <div className="text-xs mt-1">Configure ad networks in admin panel</div>
      </div>
    );
  }

  // Render different ad networks
  const renderAdCode = () => {
    switch (adSlot.network.network_type) {
      case 'google_adsense':
        return (
          <div className="ad-container">
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            ></script>
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client={adSlot.network.publisher_id}
              data-ad-slot={adSlot.slot_id}
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </div>
        );

      case 'media_net':
        return (
          <div 
            id={`${adSlot.slot_id}`}
            data-type="_mgwidget" 
            data-widget-id={adSlot.slot_id}
            style={{ minHeight: '250px' }}
          >
            <script 
              type="text/javascript" 
              src={`//contextual.media.net/dmedianet.js?cid=${adSlot.network.publisher_id}`}
            ></script>
          </div>
        );

      case 'propeller_ads':
        return (
          <div className="propeller-ads">
            <script
              type="text/javascript"
              src={`//cdn.PropellerAds.com/utils/show_ads.js?user=${adSlot.network.publisher_id}&zone=${adSlot.slot_id}`}
            ></script>
          </div>
        );

      case 'ezoic':
        return (
          <div 
            id={`ezoic-pub-ad-placeholder-${adSlot.slot_id}`}
            data-inserter-version="2"
          >
            <script 
              type="text/javascript" 
              src={`//cdn.ezoic.net/pub/${adSlot.network.publisher_id}.js`}
            ></script>
          </div>
        );

      default:
        return (
          <div className="border border-muted rounded p-4 text-center">
            <div className="text-sm text-muted-foreground">
              {adSlot.network.name} Ad Slot
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ID: {adSlot.slot_id}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`ad-slot ${className}`} data-slot-type={slotType}>
      {renderAdCode()}
    </div>
  );
}