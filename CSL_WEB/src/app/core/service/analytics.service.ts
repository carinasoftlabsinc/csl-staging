import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (action: 'track', eventName: 'PageView') => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private lastMetaPageUrl: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId) && typeof window !== 'undefined') {
      // The base pixel in index.html already sends this document's first PageView.
      this.lastMetaPageUrl = window.location.pathname + window.location.search;
    }
  }

  /** Tracks successful SPA navigations without repeating the initial or fragment-only view. */
  trackMetaPageView(url: string): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;

    const pageUrl = url.split('#')[0];
    if (pageUrl === this.lastMetaPageUrl || typeof window.fbq !== 'function') return;

    window.fbq('track', 'PageView');
    this.lastMetaPageUrl = pageUrl;
  }

  /**
   * Tracks standard Google Analytics 4 (GA4) generate_lead conversion event.
   */
  trackGenerateLead(params?: {
    formName?: string;
    category?: string;
    value?: number;
    currency?: string;
  }): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: params?.category || 'engagement',
        event_label: params?.formName || 'Quote Form',
        value: params?.value ?? 1,
        currency: params?.currency || 'USD',
      });
      console.log('📊 [GA4 Event Fired]: generate_lead', params);
    }
  }

  /**
   * Generic GA4 custom event tracker.
   */
  trackEvent(eventName: string, eventParams?: Record<string, any>): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
      console.log(`📊 [GA4 Event Fired]: ${eventName}`, eventParams);
    }
  }
}
