import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
