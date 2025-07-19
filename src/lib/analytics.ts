// Analytics utilities for ConvertTemp - PostHog integration ready

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  user?: {
    locale?: string;
    preferredUnit?: string;
    timezone?: string;
  };
}

// Mock analytics for development - replace with actual PostHog in production
class AnalyticsService {
  private isEnabled: boolean = false;
  private userId: string | null = null;

  constructor() {
    // Initialize analytics if PostHog key is available
    this.isEnabled = typeof window !== 'undefined' && Boolean(import.meta.env.VITE_POSTHOG_KEY);
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
  trackConversion(data: {
    fromUnit: string;
    toUnit: string;
    fromValue: number;
    toValue: number;
    method: 'manual' | 'smart_input';
  }) {
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
  trackInteraction(action: string, data?: Record<string, any>) {
    this.track('user_interaction', {
      action,
      ...data,
      timestamp: Date.now()
    });
  }

  // Track page views and sessions
  trackPageView(page: string) {
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

  // Initialize PostHog (call this in your app initialization)
  init(apiKey?: string) {
    if (typeof window === 'undefined' || !apiKey) return;

    try {
      // PostHog would be imported here in production
      // For now, we'll use mock analytics
      console.log('📊 Analytics ready (mock mode)');
      this.isEnabled = false; // Keep as mock for now
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

// Initialize analytics with PostHog key (set in environment)
if (typeof window !== 'undefined') {
  analytics.init(import.meta.env.VITE_POSTHOG_KEY);
}