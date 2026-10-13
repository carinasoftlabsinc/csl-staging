import { HostListener, DOCUMENT, ChangeDetectionStrategy, PLATFORM_ID, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  Renderer2,
} from '@angular/core';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Subscription } from 'rxjs';

export interface ListItem {
  title: string;
  image: string;
  description: string;
}

@Component({
    selector: 'app-know',
    templateUrl: './know.component.html',
    styleUrls: ['./know.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class KnowComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('slider1Ref') slider1Ref!: ElementRef;
  @ViewChild('slider2Ref') slider2Ref!: ElementRef;

  /** Value shown in the Our Values panel. Stays on the last one the visitor picked. */
  activeItem: ListItem | null = null;
  private slider1: KeenSliderInstance | null = null;
  private slider2: KeenSliderInstance | null = null;

  private routerSubscription: Subscription | null = null;
  private seoElements: HTMLElement[] = [];
  private readonly seoService = inject(SeoService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);

      // Subscribe to router events
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.destroySliders();
          setTimeout(() => {
            this.initSliders();
            this.initializeProgressBar();
          }, 0);
        }
      });
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'About Carina Softlabs | 15+ Years of Technology Expertise'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Discover our 15+ year journey in game development, digital marketing, web and app development, driven by innovation, expertise, and client success.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/know-us');
    this.setOpenGraphTags();
    this.setSchemaMarkup();

    this.activeItem = this.items[0];
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSliders();
      this.initializeProgressBar();
    }
  }

  ngOnDestroy(): void {
    this.destroySliders();
    // Unsubscribe to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    // Kill all existing ScrollTriggers on component destroy
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    }

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
    const title = 'About Carina Softlabs | 15+ Years of Technology Expertise';
    const description =
      'Discover our 15+ year journey in game development, digital marketing, web and app development, driven by innovation, expertise, and client success.';
    const url = 'https://carinasoftlabs.com/know-us';
    const image = 'https://carinasoftlabs.com/assets/images/og/og-default.png';

    this.seoService.setOg({ title, description, url, image });
  }

  private setSchemaMarkup(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': 'https://carinasoftlabs.com/know-us#aboutpage',
          url: 'https://carinasoftlabs.com/know-us',
          name: 'About Us | 15+ Years of Digital & Technology Expertise',
          description:
            'Discover our 15+ year journey in game development, digital marketing, web and app development, driven by innovation, expertise and client success.',
          isPartOf: {
            '@id': 'https://carinasoftlabs.com/#website',
          },
          about: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://carinasoftlabs.com/know-us#breadcrumb',
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
              name: 'Know Us',
              item: 'https://carinasoftlabs.com/know-us',
            },
          ],
        },
      ],
    };

    this.seoService.setJsonLd(schema);
  }

  private initSliders(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.slider1 = new KeenSlider(this.slider1Ref.nativeElement, {
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
            perView: 4,
            spacing: 32,
          },
        },
      },
    });

    this.slider2 = new KeenSlider(this.slider2Ref.nativeElement, {
      loop: true,
      slides: {
        origin: 'center',
        perView: 1.25,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: {
            origin: 'auto',
            perView: 2,
            spacing: 32,
          },
        },
      },
    });
  }

  private destroySliders(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.slider1?.destroy();
    this.slider2?.destroy();
    this.slider1 = null;
    this.slider2 = null;
  }

  selectValue(item: ListItem): void {
    this.activeItem = item;
  }

  prevSlide(slider: number): void {
    if (slider === 1) {
      this.slider1?.prev();
    } else if (slider === 2) {
      this.slider2?.prev();
    }
  }

  nextSlide(slider: number): void {
    if (slider === 1) {
      this.slider1?.next();
    } else if (slider === 2) {
      this.slider2?.next();
    }
  }

  initializeProgressBar() {
    if (!isPlatformBrowser(this.platformId)) return;
    const mask = document.querySelector('.mask');
    const jourElements = document.querySelectorAll('.jour');
    const jourWrap = document.querySelector('.jour-wrap');

    if (!mask || !jourWrap || jourElements.length === 0) {
      console.error('Mask element, jour-wrap, or jour elements not found');
      return;
    }

    // Set initial mask state to ensure it starts empty
    gsap.set(mask, { attr: { width: '0%' } });

    // Kill existing ScrollTriggers to avoid duplicate triggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Initialize ScrollTrigger for the entire jour-wrap container
    ScrollTrigger.create({
      trigger: jourWrap,
      scroller: jourWrap,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const totalScrollHeight = self.end - self.start;
        const currentScroll = self.scroll() - self.start;
        const progress = (currentScroll / totalScrollHeight) * 100;
        gsap.set(mask, { attr: { width: `${progress}%` } });
      },
    });

    // Initialize ScrollTrigger for each jour element
    jourElements.forEach((jourElement, index) => {
      ScrollTrigger.create({
        trigger: jourElement,
        scroller: jourWrap,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const currentSectionIndex = index + self.progress;
          const totalSections = jourElements.length;
          const progress = (currentSectionIndex / totalSections) * 100;
          gsap.set(mask, { attr: { width: `${progress}%` } });
        },
      });
    });
  }

  items: ListItem[] = [
    {
      title: 'Innovation and Creativity',
      image: '../../../assets/images/value-1.webp',
      description:
        'We are experts in innovation and creativity, constantly pushing boundaries in game development, digital marketing, app development, and web development to provide ongoing success to our clients.',
    },
    {
      title: 'Customer-Centric Approach',
      image: '../../../assets/images/value-2.webp',
      description:
        'We understand the client’s needs and propose our solution to exceed their expectations. By closely knowing their objectives, we make sure to deliver top-notch work.',
    },
    {
      title: 'Quality and Excellence',
      image: '../../../assets/images/value-3.webp',
      description:
        'We are committed to delivering high-quality services that set industry trends. From flawless code in app and web development to amazing gameplay experiences in game development.',
    },
    {
      title: 'Collaboration and Teamwork',
      image: '../../../assets/images/value-4.webp',
      description:
        'We strongly believe in the power of collaboration and teamwork. Our office is filled with a positive team environment. We know how to work as a team force to excel in our commitment to our clients.',
    },
  ];

  // journey cards content

  journeys = [
    {
      year: '11',
      imgSrc: '../../../assets/images/journey-1.webp',
      description:
        'Initially started as a web development and SEO company, our co-founder and CEO Mayank Pandey, along with director Pragati Singh Suman, began in 2011 with just 2 or 3 team members.',
      customClass: '',
    },
    {
      year: '12',
      imgSrc: '../../../assets/images/journey-2.webp',
      description:
        "After an year of hard work, we expanded our services to encompass complete digital marketing, website development. The dedication of our team members, their expertise & collaborative efforts delivered us exceptional results and drove our clients' success.",
      // customClass: 'mt-20',
    },
    {
      year: '14',
      imgSrc: '../../../assets/images/journey-3.webp',
      description:
        'Successfully completed 3 years of growth, recognized the growing importance of mobile technology, we ventured into mobile application development & further expanded our team. This new service enabled us to create user-friendly apps tailored to diverse business requirements and enhance our clients digital reach.',
      // customClass: 'mt-20',
    },
    {
      year: '15',
      imgSrc: '../../../assets/images/journey-4.webp',
      description:
        "We were excited to embark on team recreation activities as a growing technology company! These outings allowed us to spend quality time together, making connections and deepening our understanding of each other. Building strong relationships with colleagues is a key to our team's success!",
      // customClass: 'mt-20',
    },
    {
      year: '17',
      imgSrc: '../../../assets/images/journey-5.webp',
      description:
        'We got our first augmented reality project in this period and did exceptionally well. As a result, we increased our team size to take on more work in this emerging field.',
      // customClass: 'mt-20',
    },
    {
      year: '21',
      imgSrc: '../../../assets/images/journey-6.webp',
      description: `Our CEO & Co-Founder, Mr. Mayank Pande, was selected as a winner of "Indian Achievers' Award 2021" by one of the most reputed online communities known as "Indian Achievers’ Forum (IAF)".`,
      // customClass: 'mt-20',
    },
    {
      year: '23',
      imgSrc: '../../../assets/images/journey-7.webp',
      description:
        'Our director at Carina Softlabs Inc., Miss Pragati Singh Suman, has won the prestigious International Eminence Excellence Award in Dubai! 🌟🏆',
      // customClass: 'mt-20',
    },
    {
      year: '24',
      imgSrc: '../../../assets/images/journey-8.webp',
      description:
        'From a spark of an idea to the spotlight at Start Expo event at E-Summit 2024, it has been an incredible journey! We showcased our passion for gaming at MANIT-Bhopal (NIT-B) and at SGSITS-Indore, both the events were organized by E-Cell🎮✨.',
      // customClass: 'mt-20 2xl:pb-52 xl:pb-28 lg:pb-24',
      line: 'hidden',
    },
  ];

  // vision cards content
  viscards = [
    {
      imgSrc: 'assets/images/vision-1.svg',
      description:
        'Our vision is to become a trusted partner for our clients, consistently exceeding their expectations and delivering ultimate results.',
      customClass: 'bg-[#B1DF4F]',
    },
    {
      imgSrc: 'assets/images/vision-2.svg',
      description:
        'We aspire to continuously enhance our skills, processes, and technologies to stay at the forefront of innovation and provide ever-improving solutions.',
      customClass: 'bg-[#BC8AFB]',
    },
    {
      imgSrc: 'assets/images/vision-3.svg',
      description:
        'We aim to make a positive impact on society by developing products and services that enrich lives, promote inclusivity, and contribute to the betterment of communities.',
      customClass: 'bg-[#FB8ACE]',
    },
    {
      imgSrc: 'assets/images/vision-4.svg',
      description:
        'Expanding our reach globally, collaborating with diverse cultures, and enriching our perspectives to create truly universal solutions.',
      customClass: 'bg-[#8AE0FB]',
    },
  ];

  // team content
  team = [
    {
      imageSrc: '../../../assets/images/Mayank Sir.webp',
      name: 'MAYANK PANDE',
      position: 'CEO & Co-Founder',
    },
    {
      imageSrc: '../../../assets/images/Pragati Mam.webp',
      name: 'PRAGATI SINGH',
      position: 'Director',
    },
    {
      imageSrc: '../../../assets/images/Neha Mam.webp',
      name: 'NEHA PANDE',
      position: 'Chief Marketing Officer',
    },
    {
      imageSrc: '../../../assets/images/Manish.webp',
      name: 'MANISH GURNANI',
      position: 'Director, BD & Sales',
    },
  ];

  // clients content
  clients = [
    {
      imageSrc: '../../assets/images/client-bub-1.webp',
      clientName: 'Arunanchal Film Festival',
      description:
        'The website is really good. Thanks, Carina for making this event successful.',
    },
    // {
    //   imageSrc: '../../assets/images/client-bub-2.webp',
    //   clientName: 'Arizona Derby',
    //   description:
    //     'I am really happy with the performance of Team Carina. The game is exactly the same, what I wanted.',
    // },
  
    {
      imageSrc: '../../assets/images/client-bub-3.webp',
      clientName: 'Space M',
      description:
        'The Teamwork is good. fastest service I got both the applications and website in just 5 months.',
    },
    {
      imageSrc: '../../assets/images/client-bub-4.webp',
      clientName: 'Ballegro - Your Pocket Pianist',
      description:
        "Carina teamwork is incredible and amazing. It's good to work with them",
    },
    {
      imageSrc: '../../assets/images/client-bub-5.webp',
      clientName: 'Bravo - Tip or Pay',
      description:
        'The Website and Application seems perfectly done. I will surely recommend them to others.',
    },
    {
      imageSrc: '../../assets/images/client-bub-6.webp',
      clientName: 'E-Food',
      description:
        'Carina has always been the most trustworthy company for me. I got all the applications on time. Very reliable, fastest delivery and very humble team.',
    },
  ];

  events = [
    {
      imgSrc: '../../../assets/images/events/IMG_2.webp',
      width: 1200,
      height: 900,
      customClass: 'md:max-w-[600px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_1.webp',
      width: 1200,
      height: 900,
      customClass: 'md:max-w-[480px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_3.webp',
      width: 900,
      height: 1200,
      customClass: 'md:max-w-[300px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_4.webp',
      width: 900,
      height: 1200,
      customClass: 'md:max-w-[300px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_5.webp',
      width: 1200,
      height: 900,
      customClass: 'md:max-w-[300px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_6.webp',
      width: 1200,
      height: 900,
      customClass: 'md:max-w-[450px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_7.webp',
      width: 1200,
      height: 900,
      customClass: 'md:max-w-[300px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_8.webp',
      width: 1200,
      height: 900,
      customClass: 'md:max-w-[600px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_9.webp',
      width: 1200,
      height: 900,
      customClass: 'md:max-w-[480px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_10.webp',
      width: 900,
      height: 1200,
      customClass: 'md:max-w-[300px] md:max-h-[400px]',
    },
    {
      imgSrc: '../../../assets/images/events/IMG_11.webp',
      width: 1200,
      height: 900,
      customClass: 'md:max-w-[300px] md:max-h-[400px]',
    },
    // repeated
  ];

  news = [
    { imgSrc: '../../../assets/images/media-logo-1.webp' },
    { imgSrc: '../../../assets/images/Free Press.webp' },
    { imgSrc: '../../../assets/images/patrika.webp' },
    { imgSrc: '../../../assets/images/Nai Duniya.webp' },
    { imgSrc: '../../../assets/images/Haribhoomi.webp' },
    { imgSrc: '../../../assets/images/Techreviewer.webp' },
    { imgSrc: '../../../assets/images/Insights Success.webp' },
    { imgSrc: '../../../assets/images/Insights Success (1).webp' },
    { imgSrc: '../../../assets/images/Indian Achievers.webp' },
  ];

  cardText: string = `Envisioning Success ? <br class="hidden sm:block" /> Let’s Work Together`;
}
