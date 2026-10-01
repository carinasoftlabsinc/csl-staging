import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
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
