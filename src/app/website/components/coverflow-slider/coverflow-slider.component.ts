import { AfterViewInit, Component, ElementRef, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

// import { SwiperModule } from '../swiper-angular.module';
// import SwiperCore, { EffectCoverflow, Pagination, Navigation } from 'swiper';
// import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-coverflow-slider',
    // schemas: [NO_ERRORS_SCHEMA],
    templateUrl: './coverflow-slider.component.html',
    styleUrls: ['./coverflow-slider.component.scss'],
    standalone: false
})
export class CoverflowSliderComponent implements AfterViewInit  {

  //  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  
  // Flag to indicate if swiper instance is ready.
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
 
  // ngAfterViewInit() {
  //   const swiperElement: any = this.swiperContainer.nativeElement;
  //   // Increase delay to ensure initialization (try 1000ms)
  //   setTimeout(() => {
  //     // Check for either property name
  //     const swiperInstance = swiperElement.swiper || swiperElement.swiperRef;
  //     if (swiperInstance) {
  //       swiperInstance.update();
  //       swiperInstance.slideTo(2);
  //       if (swiperInstance.autoplay && swiperInstance.autoplay.start) {
  //         swiperInstance.autoplay.start();
  //       }
  //     } else {
  //       console.warn('Swiper instance not found on custom element.');
  //     }
  //   }, 1000);
  // }

  // goNext() {
  //   const swiperElement: any = this.swiperContainer.nativeElement;
  //   const swiperInstance = swiperElement.swiper || swiperElement.swiperRef;
  //   if (swiperInstance) {
  //     swiperInstance.slideNext();
  //   }
  // }

  // goPrev() {
  //   const swiperElement: any = this.swiperContainer.nativeElement;
  //   const swiperInstance = swiperElement.swiper || swiperElement.swiperRef;
  //   if (swiperInstance) {
  //     swiperInstance.slidePrev();
  //   }
  // }

  ngAfterViewInit() {
    // Poll for the swiper instance every 200ms until found.
    const timer = setInterval(() => {
      const swiperEl: any = this.swiperContainer.nativeElement;
      this.swiperInstance = swiperEl.swiper || swiperEl.swiperRef;
      if (this.swiperInstance) {
        this.swiperInstance.update(); // ensure Swiper is updated
        this.swiperInstance.slideTo(2); // start at the 3rd slide (index 2)
        this.swiperReady = true;  // enable buttons
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
