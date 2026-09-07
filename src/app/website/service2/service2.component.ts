// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
// import { ThreeSceneComponent } from '../components/three-scene/three-scene.component';

// gsap.registerPlugin(ScrollTrigger);

// @Component({
//   selector: 'app-service2',
//   templateUrl: './service2.component.html',
//   styleUrls: ['./service2.component.scss'],
// })
// export class Service2Component implements AfterViewInit {
//   @ViewChild('scrollContainer') scrollContainer!: ElementRef;
//   @ViewChild(ThreeSceneComponent) threeScene!: ThreeSceneComponent;

//   // Inject ChangeDetectorRef in the constructor
//   constructor(private cdr: ChangeDetectorRef) {}

//   currentSection: string = '01'; // Default initial value

//   ngAfterViewInit(): void {
//     this.scrollContainer.nativeElement.addEventListener(
//       'scroll',
//       (event: Event) => {
//         const scrollTop = this.scrollContainer.nativeElement.scrollTop;
//         this.threeScene.updateScrollPosition(scrollTop);
//       }
//     );

//     const scrubValue = 0.5;
//     let container = document.querySelector('.containNscroll') as HTMLElement;
//     let wrapper = document.querySelector('.wrapperScr') as HTMLElement;

//     const totalScrollDistance = wrapper.scrollWidth - window.innerWidth;

//     const scrollBar = gsap.to('.scrollbar', {
//       x: () => {
//         return window.innerWidth - (150 + 20); // Adjust this according to your scrollbar width
//       },
//       ease: 'none',
//     });

//     ScrollTrigger.create({
//       trigger: '.containNscroll',
//       start: 'top top',
//       end: () => totalScrollDistance,
//       pin: true,
//       anticipatePin: 1,
//       scrub: scrubValue,
//       animation: scrollBar,
//       invalidateOnRefresh: true,
//     });

//     let thumbNails = gsap.utils.toArray('.thumbnail') as HTMLElement[];

//     thumbNails.forEach((thumb, index) => {
//       // const updateCurrentSection = (index: number) => {
//       //   this.currentSection = (index + 1).toString().padStart(2, '0');
//       // };

//       // Modify updateCurrentSection to trigger change detection
//       const updateCurrentSection = (index: number) => {
//         this.currentSection = (index + 1).toString().padStart(2, '0');
//         this.cdr.detectChanges(); // Manually trigger change detection
//       };

//       if (thumb.classList.contains('fakePin')) {
//         const prevAll = (element: HTMLElement): HTMLElement[] => {
//           let result = [];
//           while ((element = element.previousElementSibling as HTMLElement)) {
//             result.push(element);
//           }
//           return result;
//         };

//         // const getTotalWidthToMove = (): number => {
//         //   let totalWidthToMove = 0;
//         //   prevAll(thumb).forEach((thumbBefore) => {
//         //     let style = window.getComputedStyle(thumbBefore);
//         //     let marginRight = parseInt(style.marginRight);
//         //     totalWidthToMove += thumbBefore.offsetWidth + marginRight;
//         //   });
//         //   return totalWidthToMove;
//         // };

//         const getTotalWidthToMove = (): number => {
//           let totalWidthToMove = 0;
//           prevAll(thumb).forEach((thumbBefore) => {
//             const style = window.getComputedStyle(thumbBefore);
//             const marginRight = parseFloat(style.marginRight);
//             totalWidthToMove += thumbBefore.offsetWidth + marginRight;
//           });
//           return totalWidthToMove;
//         };

//         // gsap.to(thumb, {
//         //   x: () => {
//         //     return -getTotalWidthToMove();
//         //   },
//         //   ease: 'none',
//         //   scrollTrigger: {
//         //     trigger: '.wrapperScr',
//         //     start: 'top top',
//         //     scrub: scrubValue,
//         //     invalidateOnRefresh: true,
//         //     end: () => '+=' + getTotalWidthToMove(),
//         //     onEnter: () => updateCurrentSection(index),
//         //     onEnterBack: () => updateCurrentSection(index),
//         //   },
//         // });

//         gsap.to(thumb, {
//           x: () => -getTotalWidthToMove(),
//           ease: 'none',
//           scrollTrigger: {
//             trigger: '.wrapperScr',
//             start: 'top top',
//             scrub: scrubValue,
//             invalidateOnRefresh: true,
//             end: () => '+=' + getTotalWidthToMove(),
//             onUpdate: (self) => {
//               let progress = self.progress * thumbNails.length;
//               let currentIndex = Math.floor(progress);
//               updateCurrentSection(currentIndex);
//             },
//           },
//         });

//       } else {
//         gsap.to(thumb, {
//           x: () => {
//             return -totalScrollDistance;
//           },
//           ease: 'none',
//           scrollTrigger: {
//             trigger: '.wrapperScr',
//             start: 'top top',
//             scrub: scrubValue,
//             invalidateOnRefresh: true,
//             end: () => '+=' + totalScrollDistance,
//             onEnter: () => updateCurrentSection(index),
//             onEnterBack: () => updateCurrentSection(index),
//           },
//         });
//       }
//     });
//   }

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-service2',
  templateUrl: './service2.component.html',
  styleUrls: ['./service2.component.scss'],
})
export class Service2Component implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  currentSection: string = '01';

  ngAfterViewInit(): void {
    const scrubValue = 0.5;
    let container = document.querySelector('.containNscroll') as HTMLElement;
    let wrapper = document.querySelector('.wrapperScr') as HTMLElement;

    const totalScrollDistance = wrapper.scrollWidth - window.innerWidth;

    const scrollBar = gsap.to('.scrollbar', {
      x: () => window.innerWidth - (150 + 20),
      ease: 'none',
    });

    ScrollTrigger.create({
      trigger: '.containNscroll',
      start: 'top top',
      end: () => totalScrollDistance,
      pin: true,
      anticipatePin: 1,
      scrub: scrubValue,
      animation: scrollBar,
      invalidateOnRefresh: true,
    });

    let thumbNails = gsap.utils.toArray('.thumbnail') as HTMLElement[];

    const updateCurrentSection = (scrollLeft: number) => {
      let closestIndex = 0;
      let minDiff = Infinity;

      thumbNails.forEach((thumb, index) => {
        let elementOffset = (thumb as HTMLElement).offsetLeft;
        let diff = Math.abs(scrollLeft - elementOffset);

        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      this.currentSection = (closestIndex + 1).toString().padStart(2, '0');
      this.cdr.detectChanges();
    };

    thumbNails.forEach((thumb, index) => {
      const prevAll = (element: HTMLElement): HTMLElement[] => {
        let result = [];
        while ((element = element.previousElementSibling as HTMLElement)) {
          result.push(element);
        }
        return result;
      };

      const getTotalWidthToMove = (): number => {
        let totalWidthToMove = 0;
        prevAll(thumb).forEach((thumbBefore) => {
          const style = window.getComputedStyle(thumbBefore);
          const marginRight = parseFloat(style.marginRight);
          totalWidthToMove += thumbBefore.offsetWidth + marginRight;
        });
        return totalWidthToMove;
      };

      if (thumb.classList.contains('fakePin')) {
        gsap.to(thumb, {
          x: () => -getTotalWidthToMove(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.wrapperScr',
            start: 'top top',
            scrub: scrubValue,
            invalidateOnRefresh: true,
            end: () => '+=' + getTotalWidthToMove(),
            onUpdate: (self) => {
              let scrollLeft = self.scroll();
              updateCurrentSection(scrollLeft);
            },
          },
        });
      } else {
        gsap.to(thumb, {
          x: () => -totalScrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: '.wrapperScr',
            start: 'top top',
            scrub: scrubValue,
            invalidateOnRefresh: true,
            end: () => '+=' + totalScrollDistance,
            onUpdate: (self) => {
              let scrollLeft = self.scroll();
              updateCurrentSection(scrollLeft);
            },
          },
        });
      }
    });
  }

  caseStudy = [
    {
      imgSrc:
        'https://images.unsplash.com/photo-1724513786070-e1d446f94f03?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D',
      heading: '2D & 3D Gaming Solutions',
      desc: 'Servcie App is a One-Stop Solution for finding any Service Problems. finding a qualified  professional is relatively a tough task - especially when there is an urgent requirement.',
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1723920515274-ace3503adad6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5Mnx8fGVufDB8fHx8fA%3D%3D',
      heading: '5D & 6D Gaming Solutions',
      desc: 'Servcie App is a One-Stop Solution for finding any Service Problems. finding a qualified  professional is relatively a tough task - especially when there is an urgent requirement.',
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1724641379879-9338ca8e0362?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMHx8fGVufDB8fHx8fA%3D%3D',
      heading: '2D & 3D Gaming Solutions',
      desc: 'Servcie App is a One-Stop Solution for finding any Service Problems. finding a qualified  professional is relatively a tough task - especially when there is an urgent requirement.',
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1724251638777-d859425204fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3M3x8fGVufDB8fHx8fA%3D%3D',
      heading: '2D & 3D Gaming Solutions',
      desc: 'Servcie App is a One-Stop Solution for finding any Service Problems. finding a qualified  professional is relatively a tough task - especially when there is an urgent requirement.',
    },
  ];

  processList = [
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      line: 'hidden',
      head: 'Game Development Document',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
  ];

  CountNum = [
    {
      num: '50',
      desc: 'Total clients',
    },
    {
      num: '150',
      desc: 'Total Projects',
    },
    {
      num: '20',
      desc: 'Completed Projects',
    },
  ];

  SrcWords = [
    'puzzle',
    'Shooter',
    'Strategy',
    'Multiplayer',
    'Fighting',
    'Action',
    'Simulation',
  ];
}
