import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

@Component({
  selector: 'app-app-service',
  standalone: false,
  templateUrl: './app-service.component.html',
  styleUrls: ['./app-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppServiceComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly metricsSection = viewChild<ElementRef<HTMLElement>>('metricsSection');
  private metricsObserver?: IntersectionObserver;
  private readonly counterFrames = new Map<number, number>();
  readonly metricsReady = signal(false);
  readonly metricsVisible = signal([false, false, false]);
  readonly metricValues = signal([50, 150, 20]);
  readonly assets = 'assets/images/app-development/';
  readonly introduction = 'A full- cycle digital service agency. We do from design to end-to end development to maintenance.';
  readonly expertiseDescription = 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive';
  readonly expertise = [
    { number: '01', title: 'Android App', secondLine: 'Development', color: '#B1DF4F', light: false },
    { number: '02', title: 'IOS App', secondLine: 'Development', color: '#BC8AFB', light: true },
    { number: '03', title: 'Web App', secondLine: 'Development', color: '#FB8ACE', light: true },
    { number: '04', title: 'Native App', secondLine: 'Development', color: '#8AE0FB', light: false },
    { number: '05', title: 'Cross-Platform', secondLine: 'App Development', color: '#B1DF4F', light: false },
  ];
  readonly steps = [
    { title: 'Prototype Design', color: '#B1DF4F', description: 'We create a prototype for your app. The cost of designing a prototype for an application is only 10% of the total cost. Clients have the option to request the design alone, which can be used to seek funding.' },
    { title: 'Feature specification', color: '#BC8AFB', description: 'Feature specification: We compile a technical document detailing all the features incorporated into the application.' },
    { title: 'Application development', color: '#FB8ACE', description: 'Once the design and app functionalities are confirmed, our engineers proceed to develop the internal components, external connections, administration panels, and app features.' },
  ];
  readonly industries = [
    { title: 'Fintech Apps', image: 'fintech.png', color: '#B1DF4F', light: false },
    { title: 'Geolocation Apps', image: 'geolocation.png', color: '#BC8AFB', light: true },
    { title: 'Apps Stores', image: 'stores.png', color: '#FB8ACE', light: false },
    { title: 'Delivery Apps', image: 'delivery.png', color: '#8AE0FB', light: false },
    { title: 'Event Apps', image: 'events.webp', color: '#8AE0FB', light: false },
    { title: 'eLearning Apps', image: 'elearning.png', color: '#FB8ACE', light: true },
    { title: 'Social Networking Apps', image: 'social.png', color: '#BC8AFB', light: false },
    { title: 'Travel Apps', image: 'travel.webp', color: '#B1DF4F', light: false },
  ];
  readonly technologies = [
    { name: 'Salesforce', image: 'salesforce.svg', fullTile: true, width: 312, height: 140, label: '' },
    { name: 'Excel', image: 'excel.svg', fullTile: false, width: 64.461, height: 62.974, label: 'Excel' },
    { name: 'Google Analytics', image: 'google-analytics.svg', fullTile: false, width: 56.964, height: 63.058, label: 'Google Analytics' },
    { name: 'Box', image: 'box.svg', fullTile: false, width: 108.75, height: 59.99, label: '' },
    { name: 'MySQL', image: 'mysql.svg', fullTile: true, width: 312, height: 140, label: '' },
    { name: 'QuickBooks', image: 'quickbooks.svg', fullTile: true, width: 312, height: 140, label: '' },
    { name: 'Xero', image: 'xero.svg', fullTile: true, width: 313, height: 140, label: '' },
    { name: 'Google Docs', image: 'google-docs.svg', fullTile: false, width: 53.922, height: 74.143, label: '' },
    { name: 'Facebook', image: 'facebook.svg', fullTile: true, width: 312, height: 140, label: '' },
    { name: 'JSON', image: '', fullTile: false, width: 0, height: 0, label: 'JSON' },
    { name: 'HubSpot', image: 'hubspot.svg', fullTile: true, width: 313, height: 140, label: '' },
  ];
  readonly metrics = [
    { value: 50, label: 'Total project' },
    { value: 150, label: 'Live Apps' },
    { value: 20, label: 'App Rates' },
  ];

  constructor() {
    // Runs only in the browser after hydration; SSR keeps the final figures.
    afterNextRender(() => {
      const section = this.metricsSection()?.nativeElement;
      if (!section || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
      this.metricValues.set(this.metrics.map(() => 0));
      this.metricsReady.set(true);
      this.metricsObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25 && !this.metricsVisible().some(Boolean)) {
            // Keep the completed values when scrolling away and back.
            // A new component instance on the next page load sets up a new observer.
            this.metricsObserver?.disconnect();
            this.metrics.forEach((_, index) => this.animateMetric(index));
          }
        }
      }, { threshold: [0, 0.25] });
      this.metricsObserver.observe(section);
    });
    this.destroyRef.onDestroy(() => {
      this.metricsObserver?.disconnect();
      this.counterFrames.forEach(frame => cancelAnimationFrame(frame));
      this.counterFrames.clear();
    });
  }

  private animateMetric(index: number): void {
    this.metricsVisible.update(values => values.map((visible, i) => i === index ? true : visible));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.metricValues.update(values => values.map((value, i) => i === index ? this.metrics[index].value : value));
      return;
    }
    const startedAt = performance.now();
    const duration = 2000;
    const tick = (now: number): void => {
      const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
      const count = Math.round(this.metrics[index].value * (1 - Math.pow(1 - progress, 3)));
      this.metricValues.update(values => values.map((value, i) => i === index ? count : value));
      if (progress < 1) this.counterFrames.set(index, requestAnimationFrame(tick));
      else this.counterFrames.delete(index);
    };
    this.counterFrames.set(index, requestAnimationFrame(tick));
  }

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'App Development Services | Carina Softlabs',
      description: 'Custom Android, iOS, web, native and cross-platform app development by Carina Softlabs. Explore our process, industry solutions and request a project quote.',
      url: 'https://carinasoftlabs.com/app-development',
      image: 'https://carinasoftlabs.com/assets/images/app-development/hero-phone.webp',
      imageAlt: 'Mobile application development by Carina Softlabs',
    });
  }

  scrollExpertise(event: KeyboardEvent, track: HTMLElement): void {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const card = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = (card?.offsetWidth ?? track.clientWidth) + gap;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: event.key === 'ArrowRight' ? distance : -distance, behavior: reducedMotion ? 'instant' : 'smooth' });
  }

  scrollToQuote(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const form = document.getElementById('lead-form');
    if (!form) return;
    form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    form.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  }
}

