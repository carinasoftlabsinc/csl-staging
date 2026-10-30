import { Component, OnDestroy, OnInit, AfterViewInit, Inject, Renderer2, DOCUMENT, ChangeDetectionStrategy, PLATFORM_ID, inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import type { ServiceImageTransition } from './service-image-transition';
import { SeoService } from '@core/service/seo.service';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import { whenNearViewport } from '@core/utils/when-near-viewport.util';
import { HeaderComponent } from '../header/header.component';
import { GradientButtonComponent } from '../components/gradient-button/gradient-button.component';
import { RouterLink } from '@angular/router';
import { BubbleCardComponent } from '../../shared/components/bubble-card/bubble-card.component';
import { QuoteSectionComponent } from '../components/quote-section/quote-section.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, GradientButtonComponent, RouterLink, BubbleCardComponent, QuoteSectionComponent, FooterComponent]
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  allServiceimgs = [
    '../../../assets/images/game-service.webp',
    '../../../assets/images/digital-service.webp',
    '../../../assets/images/app-service.webp',
    '../../../assets/images/web-service.webp',
    '/assets/images/ai-service.webp',
  ];

  @ViewChild('serviceStage') private serviceStage?: ElementRef<HTMLElement>;
  @ViewChild('serviceContent') private serviceContent?: ElementRef<HTMLElement>;
  private imageTransition?: ServiceImageTransition;
  private readonly transitionAbort = new AbortController();
  private disposed = false;
  private readonly zone = inject(NgZone);
  private serviceMedia?: ReturnType<typeof import('gsap').gsap.matchMedia>;
  private desktopQuery?: MediaQueryList;
  private transitionScheduled = false;
  private seoElements: HTMLElement[] = [];

  private readonly seoService = inject(SeoService);

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const stage = this.serviceStage?.nativeElement;
    const content = this.serviceContent?.nativeElement;
    if (stage && content) {
      this.desktopQuery = window.matchMedia('(min-width: 768px)');
      this.desktopQuery.addEventListener('change', this.scheduleTransition);
      this.scheduleTransition();
    }
  }

  private readonly scheduleTransition = (): void => {
    const stage = this.serviceStage?.nativeElement;
    const content = this.serviceContent?.nativeElement;
    if (!stage || !content || !this.desktopQuery?.matches || this.transitionScheduled) return;
    this.transitionScheduled = true;
    void whenNearViewport(content, '1200px', this.transitionAbort.signal).then(() => {
      if (this.disposed) return;
      this.zone.runOutsideAngular(() => {
        void Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('./service-image-transition')])
          .then(([{ gsap }, { ScrollTrigger }, module]) => {
            if (this.disposed) return undefined;
            gsap.registerPlugin(ScrollTrigger);
            return module.createServiceImageTransition(stage, this.transitionAbort.signal).then(transition => ({ transition, gsap }));
          })
          .then(result => {
            if (!result) return;
            const { transition, gsap } = result;
            if (this.disposed) transition.destroy();
            else {
              this.imageTransition = transition;
              this.serviceMedia = gsap.matchMedia();
              this.serviceMedia.add({
                desktop: '(min-width: 768px)',
                reducedMotion: '(prefers-reduced-motion: reduce)',
              }, context => {
                if (!context.conditions?.['desktop']) return;
                const playhead = { position: 0 };
                const tween = gsap.to(playhead, {
                  position: this.allServiceimgs.length - 1,
                  ease: 'none',
                  onUpdate: () => transition.setProgress(playhead.position),
                  scrollTrigger: {
                    trigger: content,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: context.conditions['reducedMotion'] ? true : 0.45,
                    invalidateOnRefresh: true,
                  },
                });
                // Honour restored scroll positions without playing through earlier services.
                tween.progress(tween.scrollTrigger?.progress ?? 0);
                return () => transition.setProgress(0);
              });
            }
          })
          .catch(() => {
            // Keep the first native image visible if a source cannot decode.
          });
      });
    });
  };

  line: string = `Find Out How We Solved Complex "IT" Challenges`;
  services: string[] = [
    'GAME DEVELOPMENT',
    'APP DEVELOPMENT',
    'WEB DEVELOPMENT',
    'DIGITAL MARKETING',
  ];
  /** Alt text for the hero pictures, in the same order as `serviceimgs`. */
  serviceimgAlts: string[] = [
    'Game development services by Carina Softlabs',
    'Mobile app development services by Carina Softlabs',
    'Web development services by Carina Softlabs',
    'Digital marketing services by Carina Softlabs',
  ];
  serviceimgs: string[] = [
    '../../../assets/images/service-hero-game.webp',
    '../../../assets/images/service-hero-app.webp',
    '../../../assets/images/service-hero-web.webp',
    '../../../assets/images/service-hero-digital.webp',
  ];

  currentWordIndex = 0;
  private intervalId: any;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Change word and image every 2 seconds. Outside the Angular zone so the app can become stable
      // (a never-ending timer inside it blocks hydration event replay).
      this.zone.runOutsideAngular(() => {
        this.intervalId = setInterval(() => this.zone.run(() => this.updateWordIndex()), 2000);
      });
    }

    this.titleService.setTitle(
      'Game Development Services, Custom App & SEO Marketing Agency'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'End-to-end tech solutions: custom game development services, web app engineering, mobile app development (iOS/Android), and full-scale SEO marketing.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/services');
    this.setOpenGraphTags();
    this.setSchemaMarkup();
  }

  ngOnDestroy() {
    this.disposed = true;
    this.desktopQuery?.removeEventListener('change', this.scheduleTransition);
    this.serviceMedia?.revert();
    this.transitionAbort.abort();
    clearInterval(this.intervalId);
    this.imageTransition?.destroy();

    this.seoElements.forEach((el) => {
      if (el.parentNode) {
        this.renderer.removeChild(el.parentNode, el);
      }
    });
    this.seoElements = [];
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector(
      "link[rel='canonical']"
    );
    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(this.document.head, link);
      this.seoElements.push(link as HTMLElement);
    }
    this.renderer.setAttribute(link, 'href', url);
  }

  private setOpenGraphTags(): void {
    const title = 'IT & Digital Services | Game, Web, App & Marketing';
    const description =
      'Explore 15+ years of expertise in game development, digital marketing, web and app development, delivering innovative IT and digital solutions for businesses.';
    const url = 'https://carinasoftlabs.com/services';
    const image = 'https://carinasoftlabs.com/assets/images/service-hero-game.png';

    this.seoService.setOg({ title, description, url, image });
  }

  private setSchemaMarkup(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://carinasoftlabs.com/services#webpage',
          url: 'https://carinasoftlabs.com/services',
          name: 'IT & Digital Services | Game, Web, App & Marketing',
          description:
            'Explore 15+ years of expertise in game development, digital marketing, web and app development, delivering innovative IT and digital solutions for businesses.',
          isPartOf: {
            '@id': 'https://carinasoftlabs.com/#website',
          },
          about: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://carinasoftlabs.com/services#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://carinasoftlabs.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Services',
              item: 'https://carinasoftlabs.com/services',
            },
          ],
        },
      ],
    };

    this.seoService.setJsonLd(schema);
  }

  updateWordIndex() {
    this.currentWordIndex++;
    if (this.currentWordIndex >= this.services.length) {
      setTimeout(() => {
        this.currentWordIndex = 0;
      }, 500); // Wait for half a second for the transition effect
    }
  }

  // text change animation

  activeImage: string = 'image1';

  setActiveImage(image: string) {
    this.activeImage = image;
  }
  activeTab: string = 'tab1';

  // ngOnInit(): void {}

  // changeActiveQuote(index: number): void {
  //   const quotes = document.querySelectorAll('.quote');
  //   const dpNames = document.querySelectorAll('.box-dpname');
  //   const peQuotes = document.querySelectorAll('.pp-quote');

  //   // Update currentIndex to the clicked index
  //   const currentIndex = index;

  //   function showCurrentQuote() {
  //     quotes.forEach((quote, i) => {
  //       if (i === currentIndex) {
  //         quote.classList.add('show');
  //         quote.classList.remove('hide-top', 'hide-bottom');
  //       } else {
  //         quote.classList.remove('show');
  //         if (i < currentIndex) {
  //           quote.classList.add('hide-top');
  //         } else {
  //           quote.classList.add('hide-bottom');
  //         }
  //       }
  //     });

  //     dpNames.forEach((dpName, i) => {
  //       if (i === currentIndex) {
  //         dpName.classList.add('look');
  //         dpName.classList.remove('hide-dp-top', 'hide-dp-bottom');
  //       } else {
  //         dpName.classList.remove('look');
  //         if (i < currentIndex) {
  //           dpName.classList.add('hide-dp-top');
  //         } else {
  //           dpName.classList.add('hide-dp-bottom');
  //         }
  //       }
  //     });

  //     peQuotes.forEach((peQuote, i) => {
  //       if (i === currentIndex) {
  //         peQuote.classList.add('active');
  //       } else {
  //         peQuote.classList.remove('active');
  //       }
  //     });
  //   }

  //   // Call showCurrentQuote to display the clicked quote
  //   showCurrentQuote();
  // }

  showTab(tabId: string) {
    this.activeTab = tabId;
  }

  FourW = [
    {
      question: 'Who ?',
      question1: 'Who are we solving for ?',
      answer:
        "At Carina Softlabs Inc., we are solving problems for our clients. Our focus is entirely on our clients' needs, and we tailor our solutions to address their specific challenges and requirements. We prioritize client satisfaction by delivering personalized and client-centric services.",
    },
    {
      question: 'Why ?',
      question1: 'Why are we solving this problem ?',
      answer:
        "With over a decade of experience in these industries, we understand the core of every problem that arises. Our deep knowledge and expertise allow us to identify and address issues effectively, ensuring that we provide solutions that truly meet our clients' needs and drive their success.",
    },
    {
      question: 'What Goal ?',
      question1: 'What goal we want to achieve ?',
      answer:
        'Our goal is to grow alongside our clients and achieve success together. We aim to deliver solutions that help our clients receive positive reviews from their users. We are proficient in delivering what our clients ask for. This is our goal, and this is what we strive to achieve.',
    },
    {
      question: 'When ?',
      question1: 'When do we deliver ?',
      answer:
        'At Carina Softlabs, we understand that timing is critical for successful project execution. Our approach ensures timely project delivery by meticulously planning each phase, adapting to changes as they arise, and maintaining transparent communication with our clients. We are dedicated to delivering results on schedule, allowing our clients to stay ahead in their markets and meet their business goals with confidence.',
    },
  ];

  // clients = [
  //   {
  //     name: 'Arunanchal Film Festival',
  //     imgSrc: '../../assets/images/client-bub-1.png',
  //     feedback:
  //       'The website is really good. Thanks, Carina for making this event successful.',
  //     feedbackClass: 'quote-text-1 show',
  //     customClass: 'dp-name-1  look',
  //   },
  //   {
  //     name: 'Arizona Derby',
  //     imgSrc: '../../assets/images/client-bub-2.png',
  //     feedback:
  //       'I am really happy with the performance of Team Carina. The game is exactly the same, what I wanted.',
  //     feedbackClass: 'quote-text-3 hide-top',
  //     customClass: 'dp-name-3 hide-dp-top',
  //   },
  //   {
  //     name: 'Space M',
  //     imgSrc: '../../assets/images/client-bub-3.png',
  //     feedback:
  //       'The Teamwork is good. fastest service I got both the applications and website in just 5 months.',
  //     feedbackClass: 'quote-text-4 hide-bottom',
  //     customClass: 'dp-name-4 hide-dp-bottom',
  //   },
  //   {
  //     name: 'Ballegro - Your Pocket Pianist',
  //     imgSrc: '../../assets/images/client-bub-4.png',
  //     feedback:
  //       "Carina teamwork is incredible and amazing. It's good to work with them",
  //     feedbackClass: 'quote-text-5 hide-top',
  //     customClass: 'dp-name-5 hide-dp-top',
  //   },
  //   {
  //     name: 'Bravo - Tip or Pay',
  //     imgSrc: '../../assets/images/client-bub-5.png',
  //     feedback:
  //       'The Website and Application seems perfectly done. I will surely recommend them to others.',
  //     feedbackClass: 'quote-text-6 hide-top',
  //     customClass: 'dp-name-6 hide-dp-top',
  //   },
  //   {
  //     name: 'E-Food',
  //     imgSrc: '../../assets/images/client-bub-6.png',
  //     feedback:
  //       'Carina has always been the most trustworthy company for me. I got all the applications on time. Very reliable, fastest delivery and very humble team.',
  //     feedbackClass: 'quote-text-7  hide-top',
  //     customClass: 'dp-name-7  hide-dp-top',
  //   },
  // ];

  reviews = [
    {
      filled: false,
      name: 'Techreviewer',
      iconSrc: '../../../assets/images/rating-icon-1.webp',
      alt: 'Carina Softlabs reviews on Techreviewer',
      rating: '4.7',
      reviewsNo: '45',
      link: 'https://techreviewer.co/companies/carina-softlabs-inc',
    },
    {
      filled: true,
      // this artwork has built-in padding, so it is enlarged to fill the circle
      imgClass: 'scale-[1.24]',
      name: 'Upwork',
      iconSrc: '../../../assets/images/rating-icon-2.webp',
      alt: 'Carina Softlabs agency profile on Upwork',
      rating: '4.9',
      reviewsNo: '1202',
      link: 'https://www.upwork.com/agencies/carinasoftlabs/',
    },
    {
      filled: false,
      name: 'AmbitionBox',
      iconSrc: '../../../assets/images/rating-icon-3.svg',
      alt: 'Carina Softlabs reviews on AmbitionBox',
      rating: '4.9',
      reviewsNo: '1303',
      link: 'https://www.ambitionbox.com/overview/carina-softlabs-overview',
    },
    {
      filled: false,
      name: 'Clutch',
      iconSrc: '../../../assets/images/rating-icon-5.webp',
      alt: 'Carina Softlabs reviews on Clutch',
      rating: '4.9',
      reviewsNo: '1505',
      link: 'https://clutch.co/profile/carina-softlabs#highlights',
    },
    {
      filled: true,
      name: 'TechBehemoths',
      iconSrc: '../../../assets/images/rating-icon-4.webp',
      alt: 'Carina Softlabs profile on TechBehemoths',
      rating: '4.9',
      reviewsNo: '1404',
      link: 'https://techbehemoths.com/company/carina-softlabs',
    },
    {
      filled: true,
      name: 'TopDevelopers',
      iconSrc: '../../../assets/images/rating-icon-6.svg',
      alt: 'Carina Softlabs profile on TopDevelopers',
      rating: '4.9',
      reviewsNo: '1606',
      link: 'https://www.topdevelopers.co/profile/carinasoftlabs',
    },
  ];

  allServices = [
    {
      id: 'section1',
      title: 'GAME DEVELOPMENT',
      description: `Carina Softlabs is central India’s Leading Game Development Company. We deal in custom games, and our team of talented designers and developers is dedicated to turning your vision into reality. We have a varied spectrum of clients worldwide, and our experience of over a decade makes us unique and attuned to our clients’ needs.`,
      imgSrc: '../../../assets/images/game-service.webp',
      alt: 'Custom game development service',
      route: '/game-development',
      cta: 'Explore Game Development',
    },
    {
      id: 'section2',
      title: 'Digital Marketing',
      description: `We started as an SEO company, and later after a few successful projects we re-launched as a Digital Marketing Company to provide social media services, SEO services, Email Marketing Services, Guest Post Outreach, and all the other services in Digital Marketing. Contact us to get started ranking your business in SERPs.`,
      imgSrc: '../../../assets/images/digital-service.webp',
      alt: 'Digital marketing service| SEO| social media and email marketing',
      route: '/digital-marketing',
      cta: 'Explore Digital Marketing',
    },
    {
      id: 'section3',
      title: 'Mobile App Development',
      description: `Developing complex applications is harder nowadays, but our team of highly skilled developers can turn your dream ideas into reality. We have the best records in App Development, from developing to marketing we are the complete solution to your business needs. Connect with us & let us know how we can touch new heights together.`,
      imgSrc: '../../../assets/images/app-service.webp',
      alt: 'Mobile app development service',
      route: '/app-development',
      cta: 'Explore App Development',
    },
    {
      id: 'section4',
      title: 'Web Development',
      description: `At Carina Softlabs, we understand the need for a website of a business. We have complete web development solutions, from designing to marketing your business. Whether you are an established business or a start-up, we know the steps to launch you on the Internet. Our team of highly experienced developers is here to execute your vision.`,
      imgSrc: '../../../assets/images/web-service.webp',
      alt: 'Web development service| website design and development',
      route: '/web-development',
      cta: 'Explore Web Development',
    },
    {
      id: 'section5',
      title: 'AI & Emerging Technology',
      description: `We combine AI, engineering and creative technology to build intelligent digital products, next-generation games, immersive experiences and automated business solutions. From AI strategy and generative AI to Web3, XR and smarter web and mobile apps, we turn emerging technology into practical solutions built around your business.`,
      imgSrc: '/assets/images/ai-service.webp',
      alt: 'AI and emerging technology service',
      route: '/ai-emerging-technology',
      cta: 'Explore AI & Emerging Tech',
    },
  ];

  cardText: string = `Start Your Project with Us <br class="hidden sm:block" /> Let’s Build Something Great.`;
}
