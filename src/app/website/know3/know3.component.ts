import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-know3',
    templateUrl: './know3.component.html',
    styleUrls: ['./know3.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Know3Component implements OnInit, AfterViewInit, OnDestroy {
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    gsap.registerPlugin(ScrollTrigger);

    // Listen for route changes and reinitialize animations
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.initScrollAnimation();
        }, 100); // Small delay to allow the view to render
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      this.initScrollAnimation();
    }, 100); // Small delay to ensure the DOM is fully rendered
  }

  ngOnDestroy(): void {
    // Unsubscribe from the router events when the component is destroyed
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (isPlatformBrowser(this.platformId)) {
      // Kill GSAP ScrollTriggers to avoid issues when navigating away
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    }
  }

  initScrollAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Clear previous ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    const section = document.getElementById('scrollIt');
    if (section) {
      gsap.to(section, {
        x: -900, // Move the div 900px to the left
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    const fillRect = document.getElementById('fillRe');
    if (fillRect) {
      gsap.to(fillRect, {
        height: 1250, // Full height of the SVG element
        ease: 'none',
        scrollTrigger: {
          trigger: '.tri',
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });
    }
  }

  changeActiveQuote(index: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const quotes = document.querySelectorAll('.quote');
    const dpNames = document.querySelectorAll('.box-dpname');
    const peQuotes = document.querySelectorAll('.pp-quote');

    // Update currentIndex to the clicked index
    const currentIndex = index;

    function showCurrentQuote() {
      quotes.forEach((quote, i) => {
        if (i === currentIndex) {
          quote.classList.add('show');
          quote.classList.remove('hide-top', 'hide-bottom');
        } else {
          quote.classList.remove('show');
          if (i < currentIndex) {
            quote.classList.add('hide-top');
          } else {
            quote.classList.add('hide-bottom');
          }
        }
      });

      dpNames.forEach((dpName, i) => {
        if (i === currentIndex) {
          dpName.classList.add('look');
          dpName.classList.remove('hide-dp-top', 'hide-dp-bottom');
        } else {
          dpName.classList.remove('look');
          if (i < currentIndex) {
            dpName.classList.add('hide-dp-top');
          } else {
            dpName.classList.add('hide-dp-bottom');
          }
        }
      });

      peQuotes.forEach((peQuote, i) => {
        if (i === currentIndex) {
          peQuote.classList.add('active');
        } else {
          peQuote.classList.remove('active');
        }
      });
    }

    // Call showCurrentQuote to display the clicked quote
    showCurrentQuote();
  }

  clients = [
    {
      name: 'Arunanchal Film Festival',
      imgSrc: '../../assets/images/client-bub-1.png',
      feedback:
        'The website is really good. Thanks, Carina for making this event successful.',
      feedbackClass: 'quote-text-1 show',
      customClass: 'dp-name-1  look',
    },
    {
      name: 'Arizona Derby',
      imgSrc: '../../assets/images/client-bub-2.png',
      feedback:
        'I am really happy with the performance of Team Carina. The game is exactly the same, what I wanted.',
      feedbackClass: 'quote-text-3 hide-top',
      customClass: 'dp-name-3 hide-dp-top',
    },
    {
      name: 'Space M',
      imgSrc: '../../assets/images/client-bub-3.png',
      feedback:
        'The Teamwork is good. fastest service I got both the applications and website in just 5 months.',
      feedbackClass: 'quote-text-4 hide-bottom',
      customClass: 'dp-name-4 hide-dp-bottom',
    },
    {
      name: 'Ballegro - Your Pocket Pianist',
      imgSrc: '../../assets/images/client-bub-4.png',
      feedback:
        "Carina teamwork is incredible and amazing. It's good to work with them",
      feedbackClass: 'quote-text-5 hide-top',
      customClass: 'dp-name-5 hide-dp-top',
    },
    {
      name: 'Bravo - Tip or Pay',
      imgSrc: '../../assets/images/client-bub-5.png',
      feedback:
        'The Website and Application seems perfectly done. I will surely recommend them to others.',
      feedbackClass: 'quote-text-6 hide-top',
      customClass: 'dp-name-6 hide-dp-top',
    },
    {
      name: 'E-Food',
      imgSrc: '../../assets/images/client-bub-6.png',
      feedback:
        'Carina has always been the most trustworthy company for me. I got all the applications on time. Very reliable, fastest delivery and very humble team.',
      feedbackClass: 'quote-text-7  hide-top',
      customClass: 'dp-name-7  hide-dp-top',
    },
  ];

  heroS = [
    {
      customClass:
        'left-[28vw] top-[7vh] lg:top-[14vh] 2xl:top-[13vh] lg:left-[22vw]',
      heading: 'Focus',
      desc: 'We prioritize our clients’ needs by understanding their business goals and providing tailored solutions. Our team collaborates closely with clients to ensure that every project aligns with their vision and delivers maximum value.',
      
    },
    {
      customClass: 'top-0 left-[63vw] lg:left-[48.5vw]',
      heading: 'Adapt',
      desc: 'We embrace an agile work process, allowing us to adapt quickly to changes and deliver high-quality products efficiently. Regular sprints and iterations ensure continuous improvement and timely project completion.',
    },
    {
      customClass:
        'left-[95.5vw] top-[7vh] lg:top-[14vh] 2xl:top-[13vh] lg:left-[75.2vw]',
      heading: 'Innovate',
      desc: 'We stay ahead of the curve by integrating the latest technologies and trends into our work. Our team is committed to innovation, creating solutions that are not only effective but also future-proof.',
    },
    {
      customClass: 'top-0 left-[129vw] lg:left-[101.5vw]',
      heading: 'Communicate',
      desc: 'We believe in maintaining clear and open communication with our clients and within our team. Regular updates, feedback loops, and transparency in every stage of the project build trust and ensure a smooth workflow.',
      line: 'hidden',
    },
  ];

  steps = [
    {
      imgAlign: 'lg:text-right',
      num: '1',
      imgSrc: '',
      title: ' Project Understanding',
      desc: 'In the initial phase of our project process, we focus on understanding the core ideas and objectives behind the project. This involves thorough discussions with clients or stakeholders to gain insights into their vision, goals, and expectations.',
    },
    {
      customClass: 'md:order-first',
      imgAlign: 'lg:text-left',
      num: '2',
      imgSrc: '',
      title: ' Project Requirements',
      desc: 'The second phase of our project lifecycle revolves around defining and managing project requirements. This critical step involves capturing, analyzing, documenting, and validating what the project needs to achieve.',
    },
    {
      imgAlign: 'lg:text-right',
      num: '3',
      imgSrc: '',
      title: 'Project Planning',
      desc: 'Project planning is a pivotal phase that sets the roadmap for the entire project. It involves meticulous budgeting, scheduling, and resource management to ensure efficient utilization of resources and timely delivery of project objectives.',
    },
    {
      customClass: 'md:order-first',
      imgAlign: 'lg:text-left',
      num: '4',
      imgSrc: '',
      title: 'Project Execution',
      desc: 'Project execution is where plans are put into action, and progress is made towards achieving project goals. It involves tracking performance, addressing challenges, and adapting to changes in real-time to ensure successful project delivery.',
    },
  ];
}
