import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '@core/service/seo.service';
import { ServiceHeroComponent } from '../components/service-hero/service-hero.component';
import { QuoteSectionComponent } from '../components/quote-section/quote-section.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-app-service',
  templateUrl: './app-service.component.html',
  styleUrls: ['./app-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
  ServiceHeroComponent,
  QuoteSectionComponent,
  FooterComponent,
  ],
})
export class AppServiceComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly metricsSection = viewChild<ElementRef<HTMLElement>>('metricsSection');
  private metricsObserver?: IntersectionObserver;
  private readonly counterFrames = new Map<number, number>();
  readonly metricsReady = signal(false);
  readonly metricsVisible = signal([false, false, false]);
  readonly metricValues = signal([125, 155, 20]);
  readonly assets = 'assets/images/app-development/';
  readonly expertise = [
    { number: '01', title: 'Android App', secondLine: 'Development', color: '#B1DF4F', light: false, compact: false,
      description: 'Our Android app development services build high-performance apps rigorously tested for device compatibility, fluid performance, and seamless operation across screen sizes and hardware specs.' },
    { number: '02', title: 'iOS App', secondLine: 'Development', color: '#BC8AFB', light: true, compact: false,
      description: 'Our iOS app development services create pixel-perfect, highly secure apps that strictly adhere to Apple’s Human Interface Guidelines and pass App Store review friction-free.' },
    { number: '03', title: 'Cross-Platform', secondLine: 'App Development', color: '#FB8ACE', light: true, compact: true,
      description: 'Launch simultaneously on iOS and Android with cross-platform app development using Flutter and React Native, cutting time-to-market and development costs without compromising native feel.' },
    { number: '04', title: 'Native App', secondLine: 'Development', color: '#8AE0FB', light: false, compact: false,
      description: 'Native applications built from the ground up using Kotlin and Swift for unmatched processing speed, buttery-smooth animations, and deep access to on-device cameras, GPS, and sensors.' },
    { number: '05', title: 'Mobile App MVP', secondLine: 'Development', color: '#B1DF4F', light: false, compact: true,
      description: 'Validate your business model with mobile app MVP development. We engineer a lean, feature-complete version designed to gather real user feedback and secure investor traction fast.' },
    { number: '06', title: 'AI App', secondLine: 'Integration', color: '#BC8AFB', light: true, compact: false,
      description: 'Transform passive software into intelligent tools via AI app integration, embedding smart chatbots, predictive recommendations, computer vision, and voice search into your workflows.' },
    { number: '07', title: 'App Maintenance', secondLine: 'Services', color: '#FB8ACE', light: true, compact: true,
      description: 'Protect your investment and retain users with dedicated app maintenance services, including OS update compatibility, active bug fixing, speed tuning, and proactive feature rollouts.' },
  ];
  readonly steps = [
    { title: 'Prototype Design', color: '#B1DF4F', description: 'We turn your initial concepts into clickable screens through app prototyping and modern mobile UI/UX design. Test real navigation flows, validate user journeys before writing code, and use the interactive prototype to pitch stakeholders or investors.' },
    { title: 'Feature Specification', color: '#BC8AFB', description: 'We author a comprehensive technical architecture document mapping every feature, including user accounts, push notifications, offline functionality, payment integrations, and third-party APIs.' },
    { title: 'Application Development', color: '#FB8ACE', description: 'Our senior engineering team builds robust frontend code, backend infrastructure, custom APIs, and an intuitive admin dashboard. Every build undergoes rigorous QA for speed, data security, and multi-device compatibility.' },
    { title: 'Launch & Support', color: '#8AE0FB', description: 'We handle the end-to-end store publishing process for Google Play and the Apple App Store, keeping your app fast, secure, and fully optimized post-launch through our proactive app maintenance services.' },
  ];
  readonly industries = [
    { title: 'Fintech Apps', image: 'fintech.png', color: '#B1DF4F', light: false, description: 'Secure wallets, payments, and banking apps with strong data protection' },
    { title: 'Geolocation Apps', image: 'geolocation.png', color: '#BC8AFB', light: true, description: 'Real-time maps, tracking, and location-based services' },
    { title: 'eCommerce Apps', image: 'stores.png', color: '#FB8ACE', light: false, description: 'Shopping apps with smooth checkout and payment integration' },
    { title: 'Delivery Apps', image: 'delivery.png', color: '#8AE0FB', light: false, description: 'Live order tracking, driver apps, and push notifications' },
    { title: 'Event Apps', image: 'events.webp', color: '#8AE0FB', light: false, description: 'Ticketing, schedules, and attendee networking' },
    { title: 'eLearning Apps', image: 'elearning.png', color: '#FB8ACE', light: true, description: 'Courses, quizzes, and video lessons with offline functionality' },
    { title: 'Social Networking Apps', image: 'social.png', color: '#BC8AFB', light: false, description: 'Profiles, chat, feeds, and community features' },
    { title: 'Travel Apps', image: 'travel.webp', color: '#B1DF4F', light: false, description: 'Bookings, itineraries, and travel guides on the go' },
  ];
  // Logo paths are relative to assets/images/ (some logos are shared with other pages).
  readonly technologies: { name: string; logo: string; icon?: boolean }[] = [
    { name: 'Flutter', logo: 'app-development/tech-flutter.svg' },
    { name: 'React Native', logo: 'app-development/tech-react-native.svg', icon: true },
    { name: 'Kotlin', logo: 'app-development/tech-kotlin.svg' },
    { name: 'Swift', logo: 'app-development/tech-swift.svg' },
    { name: 'Android Studio', logo: 'game-design/tech/android-studio.svg', icon: true },
    { name: 'Xcode', logo: 'game-design/tech/xcode.svg', icon: true },
    { name: 'Firebase', logo: 'app-development/tech-firebase.svg' },
    { name: 'Node.js', logo: 'app-development/tech-nodejs.svg' },
    { name: 'AWS', logo: 'app-development/tech-aws.svg' },
    { name: 'Figma', logo: 'app-development/tech-figma.svg' },
    { name: 'Stripe', logo: 'app-development/tech-stripe.svg' },
    { name: 'OpenAI', logo: 'digital-growth/chatgpt.svg', icon: true },
  ];
  readonly metrics = [
    { value: 125, label: 'Mobile Projects Successfully Delivered' },
    { value: 155, label: 'High-Performing Apps Launched Across Stores' },
    { value: 20, label: 'Diverse Global Industries Served' },
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

  viewOurWork(): void {
    void this.router.navigateByUrl('/portfolio');
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

