import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  describe('Meta Pixel page views', () => {
    let previousFbq: typeof window.fbq;
    let fbq: jasmine.Spy;

    beforeEach(() => {
      previousFbq = window.fbq;
      fbq = jasmine.createSpy('fbq');
      window.fbq = fbq;
    });

    afterEach(() => {
      window.fbq = previousFbq;
    });

    it('does not repeat the initial view or fragment-only navigation', () => {
      const service = new AnalyticsService('browser');
      const initialUrl = window.location.pathname + window.location.search;
      service.trackMetaPageView(initialUrl);
      service.trackMetaPageView(initialUrl + '#services');
      expect(fbq).not.toHaveBeenCalled();
    });

    it('tracks new pages, query changes and return visits once each', () => {
      const service = new AnalyticsService('browser');
      service.trackMetaPageView('/digital-marketing');
      service.trackMetaPageView('/digital-marketing');
      service.trackMetaPageView('/digital-marketing#services');
      service.trackMetaPageView('/contact-us');
      service.trackMetaPageView('/contact-us?source=marketing');
      service.trackMetaPageView('/digital-marketing');
      expect(fbq.calls.allArgs()).toEqual(Array(4).fill(['track', 'PageView']));
    });

    it('does not track on the server', () => {
      new AnalyticsService('server').trackMetaPageView('/digital-marketing');
      expect(fbq).not.toHaveBeenCalled();
    });

    it('tolerates an unavailable pixel without losing a later page view', () => {
      const service = new AnalyticsService('browser');
      window.fbq = undefined;
      expect(() => service.trackMetaPageView('/contact-us')).not.toThrow();
      window.fbq = fbq;
      service.trackMetaPageView('/contact-us');
      expect(fbq).toHaveBeenCalledOnceWith('track', 'PageView');
    });
  });

  it('fires the GA4 generate_lead event with the submitted form name in the browser', () => {
    const previousGtag = window.gtag;
    const gtag = jasmine.createSpy('gtag');
    window.gtag = gtag;

    try {
      new AnalyticsService('browser').trackGenerateLead({
        formName: 'Lead Capture Form — Web Development',
        category: 'lead_generation',
      });

      expect(gtag).toHaveBeenCalledOnceWith('event', 'generate_lead', {
        event_category: 'lead_generation',
        event_label: 'Lead Capture Form — Web Development',
        value: 1,
        currency: 'USD',
      });
    } finally {
      window.gtag = previousGtag;
    }
  });
});
