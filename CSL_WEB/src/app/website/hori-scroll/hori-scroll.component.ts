import { ApplicationRef, Component, OnDestroy, AfterViewInit, ElementRef, Inject, PLATFORM_ID, ChangeDetectionStrategy, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { whenNearViewport } from '@core/utils/when-near-viewport.util';

@Component({
    selector: 'app-hori-scroll',
    templateUrl: './hori-scroll.component.html',
    styleUrls: ['./hori-scroll.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class HoriScrollComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly loadAbort = new AbortController();
  private triggers: { kill: () => void }[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  currentSection = '01';
  readonly sectionIds = ['01', '02', '03', '04', '05', '06'];

  get activeIndex(): number {
    return Math.max(0, this.sectionIds.indexOf(this.currentSection));
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // The section's nodes are replaced while the page hydrates, so an observer made earlier watches a
    // detached node and never fires.
    void this.appRef.whenStable().then(() => {
      if (this.loadAbort.signal.aborted) return;

      // GSAP is only needed once this section is close to the screen, so it is not part of the page start.
      const target = this.host.nativeElement.querySelector('.conto') ?? this.host.nativeElement;
      void whenNearViewport(target, '1200px', this.loadAbort.signal).then(() => this.initScroll());
    });
  }

  // Follows the horizontal scroll itself, so the counter changes exactly when a panel takes over.
  private updateSection(progress: number): void {
    const index = Math.round(progress * (this.sectionIds.length - 1));
    const id = this.sectionIds[index];
    if (id !== this.currentSection) {
      this.showPoint?.(this.activeIndex, index);
      this.zone.run(() => (this.currentSection = id));
    }
  }

  private showPoint?: (from: number, to: number) => void;

  ngOnDestroy(): void {
    this.loadAbort.abort();
    this.triggers.forEach((trigger) => trigger.kill());
    this.triggers = [];
  }

  private async initScroll(): Promise<void> {
    const [{ gsap }, { ScrollTrigger }, { Observer }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/Observer'),
    ]);
    if (this.loadAbort.signal.aborted) return;

    // GSAP runs its own animation loop; inside the Angular zone it would keep the app from ever becoming stable.
    this.zone.runOutsideAngular(() => this.setupScroll(gsap, ScrollTrigger, Observer));
  }

  private setupScroll(
    gsap: typeof import('gsap').gsap,
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
    Observer: typeof import('gsap/Observer').Observer
  ): void {
    gsap.registerPlugin(ScrollTrigger, Observer);

    let sections = gsap.utils.toArray<HTMLElement>('.conto section');
    let dragRatio = 1;
    let scrollTo: (value: number) => void;

    const slides = sections
      .map((section) => section.querySelector<HTMLElement>('.slide'))
      .filter((slide): slide is HTMLElement => !!slide);
    gsap.set(slides, { autoAlpha: 0 });
    gsap.set(slides[this.activeIndex], { autoAlpha: 1 });
    this.showPoint = (from, to) => this.fastForward(gsap, slides, from, to);

    // The points sit stacked in the centre; the pinned scroll only decides which one is showing.
    let scrollTween = gsap.to({ progress: 0 }, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.conto',
        pin: true,
        scrub: 0.1,
        onRefresh: (self) => {
          dragRatio =
            (self.end - self.start) /
            ((sections.length - 1) * sections[0].offsetWidth);
        },
        onUpdate: (self) => this.updateSection(self.progress),
        end: '+=3000',
      },
    });

    this.triggers.push(scrollTween.scrollTrigger!);

    const observer = Observer.create({
      target: '.conto',
      type: 'wheel,touch,pointer',
      onPress: (self) => {
        if (scrollTween.scrollTrigger) {
          (self as any).startScroll = scrollTween.scrollTrigger.scroll();
          scrollTo = gsap.quickTo(scrollTween.scrollTrigger, 'scroll', {
            duration: 0.5,
            ease: 'power3',
          });
        }
      },
      onDrag: (self) => {
        if (self.x !== undefined && typeof scrollTo === 'function') {
          scrollTo(
            (self as any).startScroll +
              ((self as any).startX - self.x) * dragRatio
          );
        }
      },
    });

    // Progress bar animation
    const mask = document.querySelector('.maski');
    const progress = gsap.to(mask, {
      width: '100%',
      scrollTrigger: {
        trigger: '.wrapper',
        start: 'top left',
        scrub: 1,
      },
    });
    this.triggers.push(observer, progress.scrollTrigger!);
  }

  // Fast-forward: the old point rushes off stretched and streaked, and the new one rushes in the same
  // way and snaps into the centre (number first, text a beat after). Scrolling back plays it in reverse.
  private fastForward(gsap: typeof import('gsap').gsap, slides: HTMLElement[], from: number, to: number): void {
    const outgoing = slides[from];
    const incoming = slides[to];
    const direction = to > from ? 1 : -1;

    const number = incoming.querySelector('.text-strok');
    const text = incoming.querySelector('p');

    gsap.killTweensOf(slides.flatMap((slide) => [slide, ...Array.from(slide.querySelectorAll('.text-strok, p'))]));
    slides.forEach((slide, i) => {
      if (i !== from && i !== to) gsap.set(slide, { autoAlpha: 0 });
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(outgoing, { autoAlpha: 0 });
      gsap.set(incoming, { autoAlpha: 1, clearProps: 'transform,filter' });
      return;
    }

    gsap.to(outgoing, {
      x: -direction * window.innerWidth * 0.6,
      skewX: direction * 30,
      scaleX: 1.8,
      filter: 'blur(8px)',
      autoAlpha: 0,
      duration: 0.35,
      ease: 'expo.in',
    });

    gsap.fromTo(
      incoming,
      { x: direction * window.innerWidth * 0.6, skewX: -direction * 30, scaleX: 1.8, filter: 'blur(8px)', autoAlpha: 0 },
      { x: 0, skewX: 0, scaleX: 1, filter: 'blur(0px)', autoAlpha: 1, duration: 0.6, delay: 0.15, ease: 'expo.out' }
    );

    if (number && text) {
      gsap.fromTo(number, { x: direction * 160 }, { x: 0, duration: 0.5, delay: 0.15, ease: 'expo.out' });
      gsap.fromTo(text, { x: direction * 320 }, { x: 0, duration: 0.75, delay: 0.2, ease: 'expo.out' });
    }
  }
}
