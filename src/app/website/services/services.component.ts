import { Component, OnDestroy, OnInit, AfterViewInit, Inject, Renderer2 } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
  allServiceimgs = [
    '../../../assets/images/game-service.png',
    '../../../assets/images/digital-service.png',
    '../../../assets/images/app-service.png',
    '../../../assets/images/web-service.png',
  ];

  currentImage = this.allServiceimgs[0];
  private currentIndex = 0;
  private seoElements: HTMLElement[] = [];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    const sections = document.querySelectorAll('.ini-service');
    const options = {
      root: null,
      threshold: 0.5, // Adjust the threshold based on when you want the image to change
    };

    const observer = new IntersectionObserver(
      this.onIntersect.bind(this),
      options
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    // Ensure the initial image is visible
    setTimeout(() => {
      const imageElement = document.querySelector('.right-side img');
      if (imageElement) {
        imageElement.classList.add('show');
      }
    }, 10); // Add a slight delay to ensure DOM updates
  }

  onIntersect(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        if (parent) {
          const index = Array.from(parent.children).indexOf(entry.target);
          if (index !== this.currentIndex) {
            this.changeImage(index);
            this.currentIndex = index;
          }
        }
      }
    });
  }

  changeImage(index: number): void {
    const imageElement = document.querySelector('.right-side img');
    if (imageElement) {
      imageElement.classList.remove('show');

      setTimeout(() => {
        this.currentImage =
          this.allServiceimgs[index] || this.allServiceimgs[0];
        setTimeout(() => {
          if (imageElement) {
            imageElement.classList.add('show');
          }
        }, 10);
      }, 500);
    }
  }

  line: string = `Find Out How We Solved Complex "IT" Challenges`;
  services: string[] = [
    'GAME DEVELOPMENT',
    'APP DEVELOPMENT',
    'WEB DEVELOPMENT',
    'DIGITAL MARKETING',
  ];
  serviceimgs: string[] = [
    '../../../assets/images/service-hero-game.png',
    '../../../assets/images/service-hero-app.png',
    '../../../assets/images/service-hero-web.png',
    '../../../assets/images/service-hero-digital.png',
  ];

  currentWordIndex = 0;
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.updateWordIndex();
    }, 2000); // Change word and image every 2 seconds

    this.titleService.setTitle(
      'IT Solutions & Digital Services | Game, Web, App & Marketing'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        '15+ years of proven work in game development, digital marketing, web and app development, delivering innovative IT and digital solutions for businesses.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/services');
    this.setOpenGraphTags();
    this.setSchemaMarkup();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);

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

    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Carina Softlabs Inc.' });
    this.metaService.updateTag({ property: 'og:image', content: image });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
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

    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    script.text = JSON.stringify(schema);
    this.renderer.appendChild(this.document.head, script);
    this.seoElements.push(script);
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
      iconSrc: '../../../assets/images/rating-icon-1.svg',
      rating: '4.7',
      reviewsNo: '45',
      link: 'https://techreviewer.co/companies/carina-softlabs-inc',
    },
    {
      iconSrc: '../../../assets/images/rating-icon-2.svg',
      rating: '4.9',
      reviewsNo: '1202',
      link: 'https://www.upwork.com/agencies/carinasoftlabs/',
    },
    {
      iconSrc: '../../../assets/images/rating-icon-3.svg',
      rating: '4.9',
      reviewsNo: '1303',
      link: 'https://www.ambitionbox.com/overview/carina-softlabs-overview',
    },
    {
      iconSrc: '../../../assets/images/rating-icon-4.svg',
      rating: '4.9',
      reviewsNo: '1404',
      link: 'https://techbehemoths.com/company/carina-softlabs',
    },
    {
      iconSrc: '../../../assets/images/rating-icon-5.svg',
      rating: '4.9',
      reviewsNo: '1505',
      link: 'https://clutch.co/profile/carina-softlabs#highlights',
    },
    {
      iconSrc: '../../../assets/images/rating-icon-6.svg',
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
      buttonText: 'View More',
      buttonLink: '#',
      imgSrc: '../../../assets/images/game-service.png',
    },
    {
      id: 'section2',
      title: 'Digital Marketing',
      description: `We started as an SEO company, and later after a few successful projects we re-launched as a Digital Marketing Company to provide social media services, SEO services, Email Marketing Services, Guest Post Outreach, and all the other services in Digital Marketing. Contact us to get started ranking your business in SERPs.`,
      buttonText: 'View More',
      buttonLink: '#',
      imgSrc: '../../../assets/images/digital-service.png',
    },
    {
      id: 'section3',
      title: 'Mobile App Development',
      description: `Developing complex applications is harder nowadays, but our team of highly skilled developers can turn your dream ideas into reality. We have the best records in App Development, from developing to marketing we are the complete solution to your business needs. Connect with us & let us know how we can touch new heights together.`,
      buttonText: 'View More',
      buttonLink: '#',
      imgSrc: '../../../assets/images/app-service.png',
    },
    {
      id: 'section4',
      title: 'Web Development',
      description: `At Carina Softlabs, we understand the need for a website of a business. We have complete web development solutions, from designing to marketing your business. Whether you are an established business or a start-up, we know the steps to launch you on the Internet. Our team of highly experienced developers is here to execute your vision.`,
      buttonText: 'View More',
      buttonLink: '#',
      imgSrc: '../../../assets/images/web-service.png',
    },
  ];

  cardText: string = `Start Your Project with Us <br class="hidden sm:block" /> Let’s Build Something Great.`;
}
