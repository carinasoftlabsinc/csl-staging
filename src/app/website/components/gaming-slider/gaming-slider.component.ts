import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
    selector: 'app-gaming-slider',
    templateUrl: './gaming-slider.component.html',
    styleUrls: ['./gaming-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GamingSliderComponent implements OnInit, OnDestroy {
  private slider: KeenSliderInstance | null = null;
  private isBrowser: boolean;
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

    this.slider = new KeenSlider('#keen-slider-gmg', {
      loop: true,
      slides: {
        origin: 'center',
        perView: 1.2,
        spacing: 0,
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: {
            origin: 'auto',
            perView: 3,
            spacing: 0,
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

  slides = [
    {
      title : "MOBA",
      description : "Designed for high-level engagement and team-based action, MOBA game creates an intense multiplayer experience!",
      image : "../../../assets/images/2DGame.png"
    },
    {
      title : "MOBA",
      description : "Designed for high-level engagement and team-based action, MOBA game creates an intense multiplayer experience!",
      image : "../../../assets/images/2DGame-2.png"
    },
    {
      title : "MOBA",
      description : "Designed for high-level engagement and team-based action, MOBA game creates an intense multiplayer experience!",
      image : "../../../assets/images/2DGame-3.png"
    },
    {
      title : "MOBA",
      description : "Designed for high-level engagement and team-based action, MOBA game creates an intense multiplayer experience!",
      image : "../../../assets/images/2DGame-3.png"
    },
    {
      title : "MOBA",
      description : "Designed for high-level engagement and team-based action, MOBA game creates an intense multiplayer experience!",
      image : "../../../assets/images/2DGame-3.png"
    }
  ]
}
