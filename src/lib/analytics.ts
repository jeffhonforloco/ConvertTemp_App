// Analytics utilities for ConvertTemp - Supabase integration
import { supabase } from '@/integrations/supabase/client';

// Get current auth user if available
const getCurrentAuthUser = () => {
  return supabase.auth.getUser().then(({ data: { user } }) => user);
};

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  user?: {
    locale?: string;
    preferredUnit?: string;
    timezone?: string;
  };
}

// Analytics service using Supabase for data persistence
class AnalyticsService {
  private isEnabled: boolean = true; // Always enabled with Supabase
  private userId: string | null = null;

  constructor() {
    this.generateUserId();
  }

  private generateUserId() {
    if (typeof window === 'undefined') return;
    
    let userId = localStorage.getItem('converttemp_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('converttemp_user_id', userId);
    }
    this.userId = userId;
  }

  // Track conversion events
  async trackConversion(data: {
    fromUnit: string;
    toUnit: string;
    fromValue: number;
    toValue: number;
    method: 'manual' | 'smart_input';
  }) {
    try {
      const authUser = await getCurrentAuthUser();
      
      // Store in Supabase
      await supabase.from('conversion_events').insert({
        user_id: this.userId || 'anonymous',
        session_id: this.getSessionId(),
        auth_user_id: authUser?.id || null,
        from_unit: data.fromUnit,
        to_unit: data.toUnit,
        from_value: data.fromValue,
        to_value: data.toValue,
        method: data.method,
        user_agent: navigator.userAgent,
        locale: navigator.language,
      });
    } catch (error) {
      console.warn('Failed to track conversion:', error);
    }

    this.track('temperature_conversion', {
      from_unit: data.fromUnit,
      to_unit: data.toUnit,
      from_value: data.fromValue,
      to_value: data.toValue,
      conversion_method: data.method,
      timestamp: Date.now()
    });
  }

  // Track user interactions
  async trackInteraction(action: string, data?: Record<string, any>) {
    try {
      const authUser = await getCurrentAuthUser();
      
      await supabase.from('interaction_events').insert({
        user_id: this.userId || 'anonymous',
        session_id: this.getSessionId(),
        auth_user_id: authUser?.id || null,
        action,
        properties: data || {},
      });
    } catch (error) {
      console.warn('Failed to track interaction:', error);
    }

    this.track('user_interaction', {
      action,
      ...data,
      timestamp: Date.now()
    });
  }

  // Track page views and sessions
  async trackPageView(page: string) {
    try {
      const authUser = await getCurrentAuthUser();
      
      await supabase.from('page_view_events').insert({
        user_id: this.userId || 'anonymous',
        session_id: this.getSessionId(),
        auth_user_id: authUser?.id || null,
        page,
        user_agent: navigator.userAgent,
        locale: navigator.language,
        url: window.location.href,
        referrer: document.referrer,
      });
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }

    this.track('page_view', {
      page,
      user_agent: navigator.userAgent,
      locale: navigator.language,
      timestamp: Date.now()
    });
  }

  // Generic track function
  private track(event: string, properties: Record<string, any> = {}) {
    const enrichedProperties = {
      ...properties,
      user_id: this.userId,
      session_id: this.getSessionId(),
      url: window.location.href,
      referrer: document.referrer,
    };

    if (this.isEnabled) {
      // PostHog integration
      try {
        (window as any).posthog?.capture(event, enrichedProperties);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    } else {
      // Development logging
      console.log('📊 Analytics Event:', event, enrichedProperties);
    }
  }

  private getSessionId(): string {
    const sessionKey = 'converttemp_session_id';
    let sessionId = sessionStorage.getItem(sessionKey);
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(sessionKey, sessionId);
    }
    
    return sessionId;
  }

  // Initialize analytics (call this in your app initialization)
  init() {
    if (typeof window === 'undefined') return;

    try {
      console.log('📊 Analytics ready (Supabase mode)');
      this.isEnabled = true;
    } catch (error) {
      console.warn('Failed to initialize analytics:', error);
    }
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Convenience functions for common events
export const trackConversion = analytics.trackConversion.bind(analytics);
export const trackInteraction = analytics.trackInteraction.bind(analytics);
export const trackPageView = analytics.trackPageView.bind(analytics);

// Initialize analytics with Supabase
if (typeof window !== 'undefined') {
  analytics.init();
}