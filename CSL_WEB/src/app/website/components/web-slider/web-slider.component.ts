import { Component, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { GradientButtonComponent } from '../gradient-button/gradient-button.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-web-slider',
    templateUrl: './web-slider.component.html',
    styleUrls: ['./web-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [GradientButtonComponent, RouterLink]
})
export class WebSliderComponent implements OnDestroy {
  private slider: KeenSliderInstance | null = null;
  currentSlideIndex: number = 0;
  get totalSlides(): number {
    return this.caseStudies.length;
  }

  readonly caseStudies = [
    { title: 'Website Name', image: 'assets/images/web-case-study.webp' },
    { title: 'Arunachal Film Festival', image: 'assets/images/web-case-study.webp' },
    { title: 'Space M', image: 'assets/images/web-case-study.webp' },
  ].map((item) => ({
    ...item,
    imageAlt: 'LIVR virtual reality theatre website, web development case study',
    description:
      'We use server-side technologies like Python, Ruby on Rails, and Node.js for prototyping and development, producing fast and scalable web apps.',
  }));
  // Rendered twice so the looping slider always has a card off-screen to slide in.
  readonly loopedCaseStudies = [...this.caseStudies, ...this.caseStudies];
  slideTexts: string[] = [
    // 'Explore the world of Arizona Derby, a high-octane racing game that brings you into the heart of the action.',
    'Designed for high-level engagement and team-based action, MOBA game creates an intense multiplayer experience!',
    'Experience the Arunachal Film Festival, celebrating the rich culture and creativity of the region.',
    'Embark on a journey with Space M, a thrilling adventure set in the vastness of space.',
    'Join the hunt with Bounty Hunter, a game that tests your skills and strategy.',
  ];

  @ViewChild('sliderEl') private sliderEl?: ElementRef<HTMLElement>;

  constructor() {
    // afterNextRender only runs in the browser and only after hydration has finished, so the
    // slider always attaches to the final card elements (never to server or stale nodes).
    afterNextRender(() => this.initSlider());
  }

  private initSlider(): void {
    const container = this.sliderEl?.nativeElement;
    if (!container || this.slider) return;

    this.slider = new KeenSlider(container, {
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
        this.currentSlideIndex = slider.track.details.rel % this.caseStudies.length;
      },
      slideChanged: (slider) => {
        this.currentSlideIndex = slider.track.details.rel % this.caseStudies.length;
      },
    });
  }

  ngOnDestroy(): void {
    this.slider?.destroy();
    this.slider = null;
  }

  prevSlide(): void {
    this.slider?.prev();
  }

  nextSlide(): void {
    this.slider?.next();
  }
}
