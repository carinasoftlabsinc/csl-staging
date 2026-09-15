import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

if (typeof window !== 'undefined') {
  import('swiper/element/bundle').then(({ register }) => register());
}

@Component({
  selector: 'app-coverflow-slider',
  templateUrl: './coverflow-slider.component.html',
  styleUrls: ['./coverflow-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoverflowSliderComponent implements AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  swiperReady = false;
  swiperInstance: any;
  slides = [
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-11-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-12-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-1-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-2-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-3-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-1-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-2-carousel.webp' },
    { img: 'https://studio-801.com/wp-content/uploads/2024/12/slider-3-carousel.webp' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const timer = setInterval(() => {
      const swiperEl: any = this.swiperContainer?.nativeElement;
      if (!swiperEl) {
        clearInterval(timer);
        return;
      }
      this.swiperInstance = swiperEl.swiper || swiperEl.swiperRef;
      if (this.swiperInstance) {
        this.swiperInstance.update();
        this.swiperInstance.slideTo(2);
        this.swiperReady = true;
        clearInterval(timer);
      }
    }, 200);
  }

  goNext() {
    if (this.swiperInstance) {
      this.swiperInstance.slideNext();
    }
  }

  goPrev() {
    if (this.swiperInstance) {
      this.swiperInstance.slidePrev();
    }
  }
}
