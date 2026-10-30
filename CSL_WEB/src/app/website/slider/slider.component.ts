import { Component, OnInit, OnDestroy, ElementRef, Inject, PLATFORM_ID, ChangeDetectionStrategy, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { KeenSliderInstance } from 'keen-slider';
import { whenNearViewport } from '@core/utils/when-near-viewport.util';
import { GradientButtonComponent } from '../components/gradient-button/gradient-button.component';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [GradientButtonComponent]
})
export class SliderComponent implements OnInit, OnDestroy {
  private slider: KeenSliderInstance | null = null;
  private isBrowser: boolean;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly loadAbort = new AbortController();
  currentSlideIndex: number = 0;
  slideTexts: string[] = [
    // 'Explore the world of Arizona Derby, a high-octane racing game that brings you into the heart of the action.',
    'Designed for high-level engagement and team-based action, MOBA game creates an intense multiplayer experience!',
    'Experience the Arunachal Film Festival, celebrating the rich culture and creativity of the region.',
    'Embark on a journey with Space M, a thrilling adventure set in the vastness of space.',
    'Join the hunt with Bounty Hunter, a game that tests your skills and strategy.',
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Keen Slider is only needed once the slider is close to the screen, so it is not part of the page start.
    const target = this.host.nativeElement.querySelector('#keen-slider-f') ?? this.host.nativeElement;
    void whenNearViewport(target, '1200px', this.loadAbort.signal).then(async () => {
      const { default: KeenSlider } = await import('keen-slider');
      if (this.loadAbort.signal.aborted) return;
      this.createSlider(KeenSlider);
    });
  }

  private createSlider(KeenSlider: typeof import('keen-slider').default): void {
    this.slider = new KeenSlider('#keen-slider-f', {
      loop: true,
      slides: {
        origin: 'center',
        perView: 1.5,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: {
            origin: 'auto',
            perView: 3,
            spacing: 32,
          },
        },
      },
      created: (slider) => {
        this.currentSlideIndex = slider.track.details.rel;
      },
      slideChanged: (slider) => {
        this.currentSlideIndex = slider.track.details.rel;
      },
    });

    const keenSliderPrevious = document.getElementById('keen-slider-previous');
    const keenSliderNext = document.getElementById('keen-slider-next');
    const keenSliderPreviousDesktop = document.getElementById(
      'keen-slider-previous-desktop'
    );
    const keenSliderNextDesktop = document.getElementById(
      'keen-slider-next-desktop'
    );

    keenSliderPrevious?.addEventListener('click', () => this.slider?.prev());
    keenSliderNext?.addEventListener('click', () => this.slider?.next());
    keenSliderPreviousDesktop?.addEventListener('click', () =>
      this.slider?.prev()
    );
    keenSliderNextDesktop?.addEventListener('click', () => this.slider?.next());
  }

  ngOnDestroy(): void {
    this.loadAbort.abort();
    if (this.slider && typeof this.slider.destroy === 'function') {
      this.slider.destroy();
    }
  }

  prevSlide(): void {
    if (this.isBrowser) {
      this.slider?.prev();
    }
  }

  nextSlide(): void {
    if (this.isBrowser) {
      this.slider?.next();
    }
  }
}