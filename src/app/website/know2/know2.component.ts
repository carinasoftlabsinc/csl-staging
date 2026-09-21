import { Component, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
    selector: 'app-know2',
    templateUrl: './know2.component.html',
    styleUrls: ['./know2.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Know2Component implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  currentSection: string = '01'; // Default initial value

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrubValue = 0.5;
    let container = document.querySelector('.containNscroll') as HTMLElement;
    let wrapper = document.querySelector('.wrapperScr') as HTMLElement;

    const totalScrollDistance = wrapper.scrollWidth - window.innerWidth;

    const scrollBar = gsap.to('.scrollbar', {
      x: () => {
        return window.innerWidth - (150 + 20); // Adjust this according to your scrollbar width
      },
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

    thumbNails.forEach((thumb, index) => {
      const updateCurrentSection = (index: number) => {
        this.currentSection = (index + 1).toString().padStart(2, '0');
      };

      if (thumb.classList.contains('fakePin')) {
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
            let style = window.getComputedStyle(thumbBefore);
            let marginRight = parseInt(style.marginRight);
            totalWidthToMove += thumbBefore.offsetWidth + marginRight;
          });
          return totalWidthToMove;
        };

        gsap.to(thumb, {
          x: () => {
            return -getTotalWidthToMove();
          },
          ease: 'none',
          scrollTrigger: {
            trigger: '.wrapperScr',
            start: 'top top',
            scrub: scrubValue,
            invalidateOnRefresh: true,
            end: () => '+=' + getTotalWidthToMove(),
            onEnter: () => updateCurrentSection(index),
            onEnterBack: () => updateCurrentSection(index),
          },
        });
      } else {
        gsap.to(thumb, {
          x: () => {
            return -totalScrollDistance;
          },
          ease: 'none',
          scrollTrigger: {
            trigger: '.wrapperScr',
            start: 'top top',
            scrub: scrubValue,
            invalidateOnRefresh: true,
            end: () => '+=' + totalScrollDistance,
            onEnter: () => updateCurrentSection(index),
            onEnterBack: () => updateCurrentSection(index),
          },
        });
      }
    });
  }

  // currentSection: string = '01';

  // ngAfterViewInit(): void {
  //   const scrubValue = 0.5;
  //   let container = document.querySelector('.containNscroll') as HTMLElement;
  //   let wrapper = document.querySelector('.wrapperScr') as HTMLElement;

  //   // Get the total scrollable width by checking the full width of the wrapper container
  //   const totalScrollDistance = wrapper.scrollWidth - window.innerWidth;

  //   const scrollBar = gsap.to('.scrollbar', {
  //     x: () => {
  //       return window.innerWidth - (150 + 20); // Adjust this according to your scrollbar width
  //     },
  //     ease: 'none',
  //   });

  //   ScrollTrigger.create({
  //     trigger: '.containNscroll',
  //     start: 'top top',
  //     end: () => totalScrollDistance, // Now it's based on the wrapper's scrollWidth
  //     pin: true,
  //     anticipatePin: 1,
  //     scrub: scrubValue,
  //     animation: scrollBar,
  //     invalidateOnRefresh: true,
  //   });

  //   let thumbNails = gsap.utils.toArray('.thumbnail') as HTMLElement[];

  //   thumbNails.forEach((thumb) => {
  //     if (thumb.classList.contains('fakePin')) {
  //       const prevAll = (element: HTMLElement): HTMLElement[] => {
  //         let result = [];
  //         while ((element = element.previousElementSibling as HTMLElement)) {
  //           result.push(element);
  //         }
  //         return result;
  //       };

  //       const getTotalWidthToMove = (): number => {
  //         let totalWidthToMove = 0;
  //         prevAll(thumb).forEach((thumbBefore) => {
  //           let style = window.getComputedStyle(thumbBefore);
  //           let marginRight = parseInt(style.marginRight);
  //           totalWidthToMove += thumbBefore.offsetWidth + marginRight;
  //         });
  //         return totalWidthToMove;
  //       };

  //       gsap.to(thumb, {
  //         x: () => {
  //           return -getTotalWidthToMove();
  //         },
  //         ease: 'none',
  //         scrollTrigger: {
  //           trigger: '.wrapperScr',
  //           start: 'top top',
  //           scrub: scrubValue,
  //           invalidateOnRefresh: true,
  //           end: () => '+=' + getTotalWidthToMove(),
  //         },
  //       });
  //     } else {
  //       gsap.to(thumb, {
  //         x: () => {
  //           return -totalScrollDistance;
  //         },
  //         ease: 'none',
  //         scrollTrigger: {
  //           trigger: '.wrapperScr',
  //           start: 'top top',
  //           scrub: scrubValue,
  //           invalidateOnRefresh: true,
  //           end: () => '+=' + totalScrollDistance,
  //         },
  //       });
  //     }
  //   });
  // }

  // ngAfterViewInit(): void {
  //   const scrubValue = 0.5;
  //   let container = document.querySelector('.containNscroll') as HTMLElement;
  //   let wrapper = document.querySelector('.wrapperScr') as HTMLElement;

  //   // Get the total scrollable width by checking the full width of the wrapper container
  //   const totalScrollDistance = wrapper.scrollWidth - window.innerWidth;

  //   const scrollBar = gsap.to('.scrollbar', {
  //     x: () => window.innerWidth - (150 + 20), // Adjust this according to your scrollbar width
  //     ease: 'none',
  //   });

  //   // Main ScrollTrigger for pinning and scrolling logic
  //   ScrollTrigger.create({
  //     trigger: container,
  //     start: 'top top',
  //     end: () => totalScrollDistance,
  //     pin: true,
  //     scrub: scrubValue,
  //     animation: scrollBar,
  //     invalidateOnRefresh: true,
  //   });

  //   let thumbNails = gsap.utils.toArray('.thumbnail') as HTMLElement[];

  //   thumbNails.forEach((thumb, index) => {
  //     const sectionNumber = (index + 1).toString().padStart(2, '0'); // Format to two digits

  //     // Debugging log
  //     console.log(`Initializing ScrollTrigger for section: ${sectionNumber}`);

  //     // Create individual ScrollTriggers for each thumbnail
  //     ScrollTrigger.create({
  //       trigger: thumb,
  //       start: 'left center',
  //       onEnter: () => {
  //         console.log(`Section ${sectionNumber} entered view`); // Debugging log
  //         this.currentSection = sectionNumber; // Update the current section number
  //       },
  //       onEnterBack: () => {
  //         console.log(`Section ${sectionNumber} entered view (backwards)`); // Debugging log for reverse scroll
  //         this.currentSection = sectionNumber; // Update the current section number when scrolling back
  //       },
  //       scrub: scrubValue,
  //     });

  //     // Move thumbnails based on their position
  //     if (thumb.classList.contains('fakePin')) {
  //       const prevAll = (element: HTMLElement): HTMLElement[] => {
  //         let result = [];
  //         while ((element = element.previousElementSibling as HTMLElement)) {
  //           result.push(element);
  //         }
  //         return result;
  //       };

  //       const getTotalWidthToMove = (): number => {
  //         let totalWidthToMove = 0;
  //         prevAll(thumb).forEach((thumbBefore) => {
  //           let style = window.getComputedStyle(thumbBefore);
  //           let marginRight = parseInt(style.marginRight);
  //           totalWidthToMove += thumbBefore.offsetWidth + marginRight;
  //         });
  //         return totalWidthToMove;
  //       };

  //       gsap.to(thumb, {
  //         x: () => -getTotalWidthToMove(),
  //         ease: 'none',
  //         scrollTrigger: {
  //           trigger: '.wrapperScr',
  //           start: 'top top',
  //           scrub: scrubValue,
  //           invalidateOnRefresh: true,
  //           end: () => '+=' + getTotalWidthToMove(),
  //         },
  //       });
  //     } else {
  //       gsap.to(thumb, {
  //         x: () => -totalScrollDistance,
  //         ease: 'none',
  //         scrollTrigger: {
  //           trigger: '.wrapperScr',
  //           start: 'top top',
  //           scrub: scrubValue,
  //           invalidateOnRefresh: true,
  //           end: () => '+=' + totalScrollDistance,
  //         },
  //       });
  //     }
  //   });
  // }

  selectedContent: number = 0;
  // contentVisible = true;  for transition

  // Array of objects for dynamic content
  contentArray = [
    {
      btnHeading: 'Tailored Solutions',
      heading:
        'Expertise & Experience section heading. With years of experience in the industry',
      text: 'We understand that every business is unique, and so are its challenges. When you partner with us, you can expect solutions that are specifically crafted to meet your business needs. Our team takes the time to understand your goals and develops strategies that align with your vision.',
      image:
        'https://i.pinimg.com/474x/25/3f/f6/253ff6a01f53bf1a388b12a981ac02e0.jpg',
      bgColor: 'bg-[#B1DF4F]',
    },
    {
      btnHeading: 'Transparent Communication',
      heading:
        'Creativity & Innovation section heading. With years of experience in the industry',
      text: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive array of services is designed to propel your brand toward success and foster growth. At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive array of services is designed to propel your brand toward success and foster growth.',
      image:
        'https://i.pinimg.com/474x/1a/60/77/1a60777393de68d963279367f6943bd7.jpg',
      bgColor: 'bg-[#BC8AFB]',
    },
    {
      btnHeading: 'Timely Delivery',
      heading:
        'Result oriented approach section heading. With years of experience in the industry',
      text: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive array of services is designed to propel your brand toward success and foster growth. At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive array of services is designed to propel your brand toward success and foster growth.',
      image:
        'https://i.pinimg.com/474x/14/8c/47/148c479982aa757c6737264f6267d443.jpg',
      bgColor: 'bg-[#FB8ACE]',
    },
    {
      btnHeading: 'High-Quality Results',
      heading:
        'Exceptional client service section heading. With years of experience in the industry',
      text: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive array of services is designed to propel your brand toward success and foster growth. At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive array of services is designed to propel your brand toward success and foster growth.',
      image:
        'https://i.pinimg.com/474x/fd/c4/30/fdc430374a9fc00d9651c8f800c2f134.jpg',
      bgColor: 'bg-[#8AE0FB]',
    },
  ];

  showContent(index: number): void {
    this.selectedContent = index;
  }

  numCards = [
    {
      bgColor: 'bg-[#B1DF4F]',
      num: '01',
      heading: 'Service Web',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/f0/ae/58/f0ae58f4e6832b494a7c379c93c824ea.jpg',
    },
    {
      bgColor: 'bg-[#BC8AFB]',
      num: '02',
      heading: 'Gaming Web',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/53/e8/1a/53e81ad378d5ebd78e3bdc7326f9a63f.jpg',
    },
    {
      bgColor: 'bg-[#FB8ACE]',
      num: '03',
      heading: 'Functional Web',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/59/17/b7/5917b7e17018b540969dc28b5dc5373d.jpg',
    },
  ];

  caseStudy = [
    {
      imgSrc:
        'https://images.unsplash.com/photo-1724513786070-e1d446f94f03?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D',
      heading: 'Tru Cater',
      desc: 'Servcie App is a One-Stop Solution for finding any Service Problems. finding a qualified  professional is relatively a tough task - especially when there is an urgent requirement.',
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1723920515274-ace3503adad6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5Mnx8fGVufDB8fHx8fA%3D%3D',
      heading: 'Uru Cater',
      desc: 'Servcie App is a One-Stop Solution for finding any Service Problems. finding a qualified  professional is relatively a tough task - especially when there is an urgent requirement.',
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1724641379879-9338ca8e0362?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMHx8fGVufDB8fHx8fA%3D%3D',
      heading: 'Fru Cater',
      desc: 'Servcie App is a One-Stop Solution for finding any Service Problems. finding a qualified  professional is relatively a tough task - especially when there is an urgent requirement.',
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1724251638777-d859425204fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3M3x8fGVufDB8fHx8fA%3D%3D',
      heading: 'Gru Cater',
      desc: 'Servcie App is a One-Stop Solution for finding any Service Problems. finding a qualified  professional is relatively a tough task - especially when there is an urgent requirement.',
    },
  ];
}

