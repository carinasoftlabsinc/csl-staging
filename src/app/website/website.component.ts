import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Renderer2, ViewChild, DOCUMENT, ChangeDetectionStrategy, PLATFORM_ID, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { isPlatformBrowser } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { OnDestroy, OnInit } from '@angular/core';
import { CountUp } from 'countup.js';
import { Title, Meta} from '@angular/platform-browser';

import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { formatHeading } from '@core/utils/slug.util';

@Component({
    selector: 'app-website',
    templateUrl: './website.component.html',
    styleUrls: ['./website.component.scss'],
    animations: [
        trigger('fadeInBig', [
            state('void', style({ opacity: 0, transform: 'scale(0.5)' })),
            transition('void => *', [
                animate('500ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
            transition('* => void', [
                animate('500ms ease-in-out', style({ opacity: 0, transform: 'scale(0.5)' })),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WebsiteComponent implements OnInit, AfterViewInit, OnDestroy {
  blogCards: any[] = [];
  loadingBlog = true;
  imageUrl = environment.imageBaseUrl;
  // Counter starts
  @ViewChild('counterSection', { static: true }) counterSection!: ElementRef;

  setupIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.initCountUp();
            observer.disconnect(); // To trigger the animation only once
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold as needed
    );

    observer.observe(this.counterSection.nativeElement);
  }

  initCountUp(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const counters = document.querySelectorAll('.js-count-up');
    const options = {
      useEasing: true,
      useGrouping: true,
      separator: ',',
      decimal: '.',
    };

    counters.forEach((item: Element) => {
      const value = item.getAttribute('data-value');
      if (value) {
        const counter = new CountUp(
          item as HTMLElement,
          parseInt(value),
          options
        );
        counter.start();
      }
    });
  }
  // Counter end

  clients = [
    {
      name: 'Arunanchal Film Festival',
      imgSrc: '../../assets/images/client-bub-1.png',
      feedback:
        'The website is really good. Thanks, Carina for making this event successful.',
      feedbackClass: 'quote-text-1 show',
      customClass: 'dp-name-1  look',
    },
    // {
    //   name: 'Arizona Derby',
    //   imgSrc: '../../assets/images/client-bub-2.png',
    //   feedback:
    //     'I am really happy with the performance of Team Carina. The game is exactly the same, what I wanted.',
    //   feedbackClass: 'quote-text-3 hide-top',
    //   customClass: 'dp-name-3 hide-dp-top',
    // },
    {
      name: 'Peniel Global General Consulting Inc.',
      imgSrc: '../../assets/images/client-bub-2.png',
      feedback:
        'Creating Heaven Missions was an enriching experience. It allowed us to bring Christian teachings to life through engaging gameplay and thoughtful design',
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

  activeImage: string = 'image1';

  setActiveImage(image: string) {
    this.activeImage = image;
  }

  activeTab: string = 'tab1';

  changeActiveQuote(index: number): void {
    const quotes = document.querySelectorAll('.quote');
    const dpNames = document.querySelectorAll('.box-dpname');
    const peQuotes = document.querySelectorAll('.pp-quote');

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

    showCurrentQuote();
  }

  showTab(tabId: string) {
    this.activeTab = tabId;
  }
  private seoElements: HTMLElement[] = [];

  private readonly seoService = inject(SeoService);

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    this.titleService.setTitle(
      'Game Development, Digital Marketing, Web & App Dev Services'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Leverage 15 years of expertise in game development, digital marketing, web and app development services to build, grow, and scale your digital presence.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com');
    this.setOpenGraphTags();
    this.setSchemaMarkup();

    this.fetchBlogs();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
      import('aos').then((AOS) => (AOS.default || AOS).init({ disable: 'mobile' }));
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngOnDestroy(): void {
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
    const title = 'Game Development, Digital Marketing, Web & App Dev Services';
    const description =
      'Leverage 15 years of expertise in game development, digital marketing, web and app development services to build, grow and scale your digital presence.';
    const url = 'https://carinasoftlabs.com';
    const image = 'https://carinasoftlabs.com/assets/images/og/og-default.png';

    this.seoService.setOg({ title, description, url, image });
  }

  private setSchemaMarkup(): void {
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://carinasoftlabs.com/#organization',
      name: 'Carina Softlabs Inc.',
      url: 'https://carinasoftlabs.com/',
      logo: 'https://carinasoftlabs.com/assets/CSL-logo-footer.svg',
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://carinasoftlabs.com/#website',
      name: 'Carina Softlabs Inc.',
      url: 'https://carinasoftlabs.com/',
      publisher: {
        '@id': 'https://carinasoftlabs.com/#organization',
      },
    };

    // Values exactly as given in the SEO audit doc (Home §3.III Local Schema).
    const localSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://www.carinasoftlabs.com/#india-office',
      name: 'Carina Softlabs Inc.',
      url: 'https://www.carinasoftlabs.com/',
      image: 'https://carinasoftlabs.com/assets/CSL-logo.svg',
      logo: 'https://carinasoftlabs.com/assets/CSL-logo.svg',
      telephone: '+91 9131958215',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          '10/2, 2nd Floor, Shree Mahadeo House, near Hotel Surya, Sriram Nagar, South Tukoganj',
        addressLocality: 'Indore',
        addressRegion: 'Madhya Pradesh',
        postalCode: '452001',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 22.7177305,
        longitude: 75.8763343,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:30',
          closes: '18:30',
        },
      ],
      parentOrganization: {
        '@id': 'https://www.carinasoftlabs.com/#organization',
      },
    };

    this.seoService.setJsonLd([organizationSchema, websiteSchema, localSchema]);
  }

  formatHeading(titleLink: string): string {
    return formatHeading(titleLink);
  }
  
  fetchBlogs() {
    this.http.get<any>(`${environment.apiUrl}/admin/getLatestBlogs`).subscribe({
      next: (res) => {
        if (res.success === true && res?.data) {
          this.blogCards = res.data;
        }
        this.loadingBlog = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.loadingBlog = false;
        this.changeDetector.detectChanges();
      },
    });
  }


  clientLogo = [
    {
      ImgSrc: '../../assets/images/client-l-1.svg',
      alt: 'abacus',
    },
    {
      ImgSrc: '../../assets/images/client-l-8.svg',
      alt: 'IPR',
    },
    {
      ImgSrc: '../../assets/images/client-l-9.svg',
      alt: 'popil tunes',
    },
    {
      ImgSrc: '../../assets/images/client-l-2.svg',
      alt: 'surfshark',
    },
    {
      ImgSrc: '../../assets/images/client-l-10.svg',
      alt: 'e food',
    },
    {
      ImgSrc: '../../assets/images/client-l-11.svg',
      alt: 'show around',
    },
    {
      ImgSrc: '../../assets/images/client-l-3.svg',
      alt: 'skale.io',
    },
    {
      ImgSrc: '../../assets/images/client-l-12.svg',
      alt: 'couchhub',
    },
    {
      ImgSrc: '../../assets/images/client-l-13.svg',
      alt: 'bookestan',
    },
    {
      ImgSrc: '../../assets/images/client-l-4.svg',
      alt: 'my own conference',
    },
    // {
    //   ImgSrc: '../../assets/images/client-l-14.svg',
    //   alt: 'arizona derby',
    // },
    {
      ImgSrc: '../../assets/images/client-l-15.svg',
      alt: 'heaven mission',
    },
    {
      ImgSrc: '../../assets/images/client-l-5.svg',
      alt: 'macadons',
    },
    {
      ImgSrc: '../../assets/images/client-l-16.svg',
      alt: 'the little guardian',
    },
    {
      ImgSrc: '../../assets/images/client-l-17.svg',
      alt: 'the howitcher',
    },
    {
      ImgSrc: '../../assets/images/client-l-6.svg',
      alt: 'my little panda',
    },
    {
      ImgSrc: '../../assets/images/client-l-18.svg',
      alt: 'arunachal film festival',
    },
    {
      ImgSrc: '../../assets/images/client-l-19.svg',
      alt: 'livr',
    },
    {
      ImgSrc: '../../assets/images/client-l-7.svg',
      alt: 'herbal life',
    },
    {
      ImgSrc: '../../assets/images/client-l-20.svg',
      alt: 'smartivity',
    },
    {
      ImgSrc: '../../assets/images/client-l-21.svg',
      alt: 'fitbit',
    },
    {
      ImgSrc: '../../assets/images/client-l-22.svg',
      alt: 'B',
    },

    // repeated for infinite loop effect
    {
      ImgSrc: '../../assets/images/client-l-1.svg',
      alt: 'abacus',
    },
    {
      ImgSrc: '../../assets/images/client-l-8.svg',
      alt: 'IPR',
    },
    {
      ImgSrc: '../../assets/images/client-l-9.svg',
      alt: 'popil tunes',
    },
    {
      ImgSrc: '../../assets/images/client-l-2.svg',
      alt: 'surfshark',
    },
    {
      ImgSrc: '../../assets/images/client-l-10.svg',
      alt: 'e food',
    },
    {
      ImgSrc: '../../assets/images/client-l-11.svg',
      alt: 'show around',
    },
    {
      ImgSrc: '../../assets/images/client-l-3.svg',
      alt: 'skale.io',
    },
    {
      ImgSrc: '../../assets/images/client-l-12.svg',
      alt: 'couchhub',
    },
    {
      ImgSrc: '../../assets/images/client-l-13.svg',
      alt: 'bookestan',
    },
    {
      ImgSrc: '../../assets/images/client-l-4.svg',
      alt: 'my own conference',
    },
    // {
    //   ImgSrc: '../../assets/images/client-l-14.svg',
    //   alt: 'arizona derby',
    // },
    {
      ImgSrc: '../../assets/images/client-l-15.svg',
      alt: 'heaven mission',
    },
    {
      ImgSrc: '../../assets/images/client-l-5.svg',
      alt: 'macadons',
    },
    {
      ImgSrc: '../../assets/images/client-l-16.svg',
      alt: 'the little guardian',
    },
    {
      ImgSrc: '../../assets/images/client-l-17.svg',
      alt: 'the howitcher',
    },
    {
      ImgSrc: '../../assets/images/client-l-6.svg',
      alt: 'my little panda',
    },
    {
      ImgSrc: '../../assets/images/client-l-18.svg',
      alt: 'arunachal film festival',
    },
    {
      ImgSrc: '../../assets/images/client-l-19.svg',
      alt: 'livr',
    },
    {
      ImgSrc: '../../assets/images/client-l-7.svg',
      alt: 'herbal life',
    },
    {
      ImgSrc: '../../assets/images/client-l-20.svg',
      alt: 'smartivity',
    },
    {
      ImgSrc: '../../assets/images/client-l-21.svg',
      alt: 'fitbit',
    },
    {
      ImgSrc: '../../assets/images/client-l-22.svg',
      alt: 'B',
    },
  ];

  awards = [
    {
      customClass: '',
      imgSrc: '../../assets/images/award-4.svg',
      width: 107,
      height: 137,
      heading: 'International Eminence Excellence 2023',
      desc: 'Mrs. Pragati Singh Suman (Director), got recognition in Dubai.',
    },
    {
      customClass: 'md:border-l-0 2xl:border-r-0',
      imgSrc: '../../assets/images/award-5.svg',
      width: 107,
      height: 137,
      heading: "Women's Face of the Year 2023",
      desc: 'Mrs. Pragati Singh Suman (Director), recognized by the International Fox Story Magazine',
    },
    {
      customClass: '',
      imgSrc: '../../assets/images/award-3.svg',
      width: 107,
      height: 137,
      heading: 'Women of Substance 2023',
      desc: 'Mrs. Pragati Singh Suman (Director), got recognition in Dubai.',
    },
    {
      customClass: 'md:border-l-0 2xl:border-l 2xl:border-r-0',
      imgSrc: '../../assets/images/award-6.svg',
      width: 107,
      height: 138,
      heading: 'CEO of the Year 2021 & 2022',
      desc: 'Mr. Mayank (CEO) was awarded by “The Indian Achievers’ Forum"',
    },
    {
      customClass: '',
      imgSrc: '../../assets/images/award-2.svg',
      width: 107,
      height: 137,
      heading: 'Most Innovative Tech Company',
      desc: 'Nominated by an Australian firm “Corporate Visions”',
    },
    {
      customClass: 'md:border-l-0',
      imgSrc: '../../assets/images/award-1.svg',
      width: 107,
      height: 137,
      heading: 'Entrepreneur of the Year 2019',
      desc: '2nd Runner-up by Times of India',
    },
  ];

  aboutus = [
    {
      imgSrc: '../../assets/images/lg-1.png',
      width: 80,
      height: 87,
      heading: 'Industry Exposure',
      desc: '12+ years in the industry',
    },
    {
      imgSrc: '../../assets/images/lg-2.png',
      width: 91,
      height: 90,
      heading: 'Customised Solutions',
      desc: 'Tailored to your needs',
    },
    {
      imgSrc: '../../assets/images/lg-3.png',
      width: 85,
      height: 88,
      heading: 'Technology Experts',
      desc: 'Cutting-edge tech Proficient',
    },
    {
      imgSrc: '../../assets/images/lg-4.png',
      width: 89,
      height: 88,
      heading: 'Comprehensive Support',
      desc: 'Every step of the way',
    },
    {
      imgSrc: '../../assets/images/lg-5.png',
      width: 78,
      height: 78,
      heading: 'On-Time Delivery',
      desc: 'Guaranteed project completion',
    },
    {
      imgSrc: '../../assets/images/lg-6.png',
      width: 81,
      height: 80,
      heading: 'Proven Success',
      desc: 'Delivering for Our Clients',
    },
  ];

  techStack = [
    { imgSrc: '../../assets/images/logo1st.png', w: '150' },
    { imgSrc: '../../assets/images/logo-2.png', w: '150' },
    { imgSrc: '../../assets/images/meen.png', w: '160' },
    { imgSrc: '../../assets/images/logo-4.png', w: '150' },
    { imgSrc: '../../assets/images/logo-3.png', w: '150' },
    { imgSrc: '../../assets/images/mean.png', w: '160' },
    { imgSrc: '../../assets/images/logo-7.png', w: '150' },
    { imgSrc: '../../assets/images/logo-8.png', w: '150' },
    { imgSrc: '../../assets/images/logo-9.png', w: '150' },
    { imgSrc: '../../assets/images/logo-10.png', w: '150' },
    { imgSrc: '../../assets/images/logo-11.png', w: '150' },
    { imgSrc: '../../assets/images/logo-12.png', w: '150' },
  ];

  hoverGif = [
    {
      heading: 'Web <br> Development',
      desc: 'Empowering Your Online Journey.',
      route: '/web-development',
    },
    {
      heading: 'Game <br> Development',
      desc: 'We Make Games That Players Love.',
      route: '/game-development',
    },
    {
      heading: 'Digital <br> Marketing',
      desc: 'Boost Your Brand with Digital Strategies.',
      route: '/digital-marketing',
    },
    {
      heading: 'Emerging <br> Tech',
      desc: 'Shaping the Future with AI, AR/VR, and XR Innovation.',
      route: '/services',
    },
  ];

  projectNum = [
    {
      heading: 'WEB DEVELOPMENT <br /> PROJECT',
      value: '455',
    },
    {
      heading: 'APP DEVELOPMENT <br /> PROJECT',
      value: '125',
      customClass: 'mt-4 lg:mt-0',
    },
    {
      heading: 'GAME DEVELOPMENT <br /> PROJECT',
      value: '76',
      customClass: 'mt-4 lg:mt-0',
    },
    {
      heading: 'DIGITAL MARKETING',
      value: '432',
      customClass: 'mt-4 lg:mt-0',
    },
  ];

  cardText: string = `Got a Vision? Let’s Make <br class="hidden sm:block" /> It a Reality Together`;
}
