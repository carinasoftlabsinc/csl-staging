import { Component, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectionStrategy, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
    selector: 'app-races',
    templateUrl: './races.component.html',
    styleUrls: ['./races.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class RacesComponent implements AfterViewInit {
  private readonly zone = inject(NgZone);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    // GSAP runs its own animation loop; inside the Angular zone it would keep the app from ever becoming stable.
    this.zone.runOutsideAngular(() => this.initScroll());
  }

  private initScroll(): void {
    gsap.registerPlugin(ScrollTrigger);

    const container = document.querySelector('.container');
    const sections = gsap.utils.toArray('.container section') as Element[];
    const texts = gsap.utils.toArray('.anim') as Element[];
    const mask = document.querySelector('.mask');

    let scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.container',
        pin: true,
        scrub: 1,
        end: '+=3000',
        markers: true,
      },
    });

    // Progress bar animation
    gsap.to(mask, {
      width: '100%',
      scrollTrigger: {
        trigger: '.wrapper',
        start: 'top left',
        scrub: 1,
      },
    });

    // Whizz around the sections
    sections.forEach((section: Element) => {
      // grab the scoped text
      let text = section.querySelectorAll('.anim');

      // bump out if there's no items to animate
      if (text.length === 0) return;

      // do a little stagger
      gsap.from(text, {
        y: -130,
        opacity: 0,
        duration: 2,
        ease: 'elastic',
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          containerAnimation: scrollTween,
          start: 'left center',
          markers: true,
        },
      });
    });
  }
}
