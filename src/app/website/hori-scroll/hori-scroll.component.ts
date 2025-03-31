import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);

@Component({
  selector: 'app-hori-scroll',
  templateUrl: './hori-scroll.component.html',
  styleUrls: ['./hori-scroll.component.scss'],
})
export class HoriScrollComponent implements OnInit {
  constructor() {}

  currentSection = '01';

  ngAfterViewInit(): void {
    const sections = document.querySelectorAll('.sec-text');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target.id;
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));
  }

  ngOnInit(): void {
    let sections = gsap.utils.toArray<HTMLElement>('.conto section');
    let dragRatio = 1;
    let scrollTo: (value: number) => void;

    let scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
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
        end: '+=3000',
      },
    });

    Observer.create({
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
    gsap.to(mask, {
      width: '100%',
      scrollTrigger: {
        trigger: '.wrapper',
        start: 'top left',
        scrub: 1,
      },
    });
  }

  
}
