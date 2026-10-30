import {
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  OnDestroy,
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  NgZone,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { SwiperContainer } from 'swiper/element';
import type { Swiper } from 'swiper/types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coverflow-slider',
  templateUrl: './coverflow-slider.component.html',
  styleUrls: ['./coverflow-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink],
  // <swiper-container> and <swiper-slide> are Swiper's web components.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CoverflowSliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef<SwiperContainer>;

  swiperReady = false;
  private swiperInstance?: Swiper;
  private destroyed = false;
  private readonly zone = inject(NgZone);
  readonly fallbackImages = [
    '/assets/images/2DGame.png',
    '/assets/images/2DGame-2.png',
    '/assets/images/2DGame-3.png',
  ];
  slides = [
    { img: 'https://backiee.com/static/wallpapers/7680x4320/459973.jpg' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-12-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-4-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-5-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-9-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-8-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-6-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-7-carousel.webp' },
    { img: 'https://backiee.com/static/wallpapers/1000x563/417156.webp' },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetector: ChangeDetectorRef,
  ) {}

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const swiperEl = this.swiperContainer.nativeElement;
      if (!customElements.get('swiper-container')) {
        const { register } = await import('swiper/element/bundle');
        register();
      }
      await customElements.whenDefined('swiper-container');
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (this.destroyed) return;

      // The element has all Angular-rendered slides before Swiper measures them.
      // Outside the Angular zone: autoplay runs a never-ending animation-frame loop that would keep the app
      // from becoming stable (that blocks hydration event replay) and run change detection every frame.
      this.zone.runOutsideAngular(() => swiperEl.initialize());
      if (!swiperEl.swiper?.initialized) return;

      this.swiperInstance = swiperEl.swiper;
      this.swiperReady = true;
      this.changeDetector.detectChanges();
    } catch (error) {
      console.error('Could not initialize coverflow slider:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  goNext() {
    const swiper = this.swiperInstance;
    if (swiper) this.zone.runOutsideAngular(() => swiper.slideNext());
  }

  goPrev() {
    const swiper = this.swiperInstance;
    if (swiper) this.zone.runOutsideAngular(() => swiper.slidePrev());
  }

  onSlideImageError(event: Event, index: number): void {
    const image = event.target as HTMLImageElement;
    if (image.dataset['fallbackApplied']) return;

    image.dataset['fallbackApplied'] = 'true';
    image.src = this.fallbackImages[index % this.fallbackImages.length];
  }
}
