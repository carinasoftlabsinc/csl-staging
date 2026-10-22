import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, DOCUMENT, ChangeDetectionStrategy, PLATFORM_ID, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import { newsroomService } from './newsroom.service';
import { environment } from 'environments/environment';
import { formatHeading } from '@core/utils/slug.util';

@Component({
    selector: 'app-newsroom',
    templateUrl: './newsroom.component.html',
    styleUrls: ['./newsroom.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NewsroomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;
  private observer!: IntersectionObserver;
  private seoElements: HTMLElement[] = [];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Set up Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in view - add autoplay to the src
            this.videoIframe.nativeElement.src =
              'https://www.youtube.com/embed/J2vM81MHUa0?si=lO0Fo_F9VsVfGCnz&autoplay=1&mute=0';
          } else {
            // Remove autoplay when video is out of view (optional)
            this.videoIframe.nativeElement.src =
              'https://www.youtube.com/embed/J2vM81MHUa0?si=lO0Fo_F9VsVfGCnz';
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold based on when you want it to start
    );

    // Start observing the video element
    if (this.videoIframe) {
      this.observer.observe(this.videoIframe.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Disconnect observer when component is destroyed
    if (this.observer) {
      this.observer.disconnect();
    }

    this.seoElements.forEach((el) => {
      if (el.parentNode) {
        this.renderer.removeChild(el.parentNode, el);
      }
    });
    this.seoElements = [];
  }

  // formatHeading(heading: string): string {
  //   return heading.toLocaleLowerCase().replace(/ /g, '-');
  // }

  featured: any[] = [];
  allNews: any[] = [];
  prevFeatured: any[] = [];

  private readonly seoService = inject(SeoService);

  constructor(
    private newsroomService: newsroomService,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  imageUrl = environment.imageBaseUrl;

  /** Alt text from the SEO alt text sheet for the news images, by image file. Other news use their title. */
  private readonly newsImageAlts: Record<string, string> = {
    'image_2-0ba3f7b5-8478-4b9d-ad85-69ece521d38f': 'The Best Gift is Fun: simple surprises at the Carina Softlabs office',
    'image_2-685f2c7c-61b4-4ae0-a7af-bf0762967c94': 'Carina Softlabs team Diwali party celebration',
    'image_2-08caf86d-cb34-4a44-b216-523584a1842f': 'Carina Softlabs welcomes tech expert from Europe for strategic discussion',
    'image_2-7b3d5d31-7f60-49ba-9711-f3c7db97708b': 'Mayank Pande birthday celebration at Carina Softlabs',
    'image_2-fd5e65e7-8262-4c24-b9d5-5aae7c57661c': 'Carina Softlabs celebrates 14 years of growth with its team',
    'image_2-57818d65-115e-4d13-8a44-0929a3287d11': 'Carina Softlabs team celebrates Ganesh Chaturthi at the office',
    'image_2-c4fa0580-e6b0-4171-ae06-892ed741ec19': 'Fun Friday activities for the Carina Softlabs team',
    'image_2-e4f22b49-67d1-4061-86dc-fba9561dc2cf': 'Carina Softlabs recognised at IGDC 2024',
    'image_2-f0030b59-015a-4999-920f-4d0f92768429': 'Carina Softlabs announces partnership with Skywalk Games',
    'image_2-836af001-0413-45f3-8c91-d10cb3276866': 'Carina Softlabs presents record-time game at Startup Expo',
    'image_2-1731504197401': 'Carina Softlabs VR experience of Ayodhya featured in Indian media',
    'image_2-1731504745295': 'Carina Softlabs at Startup Expo 2024| SGSITS Indore',
    'image_2-1731506036408': 'Pragati Singh Suman at International Eminence Excellence Awards 2023| Dubai',
  };

  newsImageAlt(news: any): string {
    const file = String(news?.image_2 || '').split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') || '';
    return this.newsImageAlts[file] || news?.title || 'Carina Softlabs news';
  }
  /** Shown when a story has no cover image or the file cannot be loaded. */
  readonly fallbackImage = 'assets/images/og/og-default.png';

  onCoverError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Swap once, so a missing fallback cannot trigger an endless error loop.
    if (!img.src.endsWith(this.fallbackImage)) {
      img.src = this.fallbackImage;
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'News Room | Latest Company News, Updates & Events'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Stay updated with the latest company news, achievements, events & industry updates from Carina Softlabs across game, web, app development & digital marketing.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/news-room');
    this.setOpenGraphTags();
    this.setSchemaMarkup();

    this.fetchFeaturedItems();
    this.fetchAllNews();
    this.fetchPreFeaturedItems();
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
    const title = 'News Room | Latest Company News, Updates & Events';
    const description =
      'Stay updated with the latest company news, achievements, events and industry updates from Carina Softlabs across game, web, app development and digital marketing.';
    const url = 'https://carinasoftlabs.com/news-room';
    const image = 'https://admin.carinasoftlabs.com/web/web/file/news/image-1731506036405.png';

    this.seoService.setOg({ title, description, url, image });
  }

  private setSchemaMarkup(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://carinasoftlabs.com/news-room#webpage',
          url: 'https://carinasoftlabs.com/news-room',
          name: 'News Room | Latest Company News, Updates & Events',
          description:
            'Stay updated with the latest company news, achievements, events and industry updates from Carina Softlabs across game, web, app development and digital marketing.',
          isPartOf: {
            '@id': 'https://carinasoftlabs.com/#website',
          },
          about: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://carinasoftlabs.com/news-room#breadcrumb',
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
              name: 'News Room',
              item: 'https://carinasoftlabs.com/news-room',
            },
          ],
        },
      ],
    };

    this.seoService.setJsonLd(schema);
  }

  featuredLoading = true;
prevFeaturedLoading = true;
allNewsLoading = true;


  // fetchFeaturedItems(): void {
  //   this.newsroomService.getFeaturedItems().subscribe({
  //     next: (data) => {
  //       this.featured = data.data.data;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching featured news:', error);
  //     },
  //     complete: () => {
  //       console.log('News fetch complete');
  //     },
  //   });
  // }

  // fetchPreFeaturedItems(): void {
  //   this.newsroomService.getPreFeaturedItems().subscribe({
  //     next: (data) => {
  //       this.prevFeatured = data.data.data;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching featured news:', error);
  //     },
  //     complete: () => {
  //       console.log('News fetch complete');
  //     },
  //   });
  // }

  // fetchAllNews(): void {
  //   this.newsroomService.getAllNews().subscribe({
  //     next: (data) => {
  //       this.allNews = data.data.data;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching all news:', error);
  //     },
  //     complete: () => {
  //       console.log('News fetch complete');
  //     },
  //   });
  // }

  fetchFeaturedItems(): void {
    this.featuredLoading = true;
    this.newsroomService.getFeaturedItems().subscribe({
      next: (data) => {
        this.featured = data?.data?.data || [];
        this.featuredLoading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching featured news:', error);
        this.featuredLoading = false;
        this.changeDetector.detectChanges();
      },
      complete: () => {
        this.featuredLoading = false;
      },
    });
  }

  fetchPreFeaturedItems(): void {
    this.prevFeaturedLoading = true;
    this.newsroomService.getPreFeaturedItems().subscribe({
      next: (data) => {
        this.prevFeatured = data?.data?.data || [];
        this.prevFeaturedLoading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching previous featured news:', error);
        this.prevFeaturedLoading = false;
        this.changeDetector.detectChanges();
      },
      complete: () => {
        this.prevFeaturedLoading = false;
      },
    });
  }

  fetchAllNews(): void {
    this.allNewsLoading = true;
    this.newsroomService.getAllNews().subscribe({
      next: (data) => {
        this.allNews = data?.data?.data || [];
        this.allNewsLoading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching all news:', error);
        this.allNewsLoading = false;
        this.changeDetector.detectChanges();
      },
      complete: () => {
        this.allNewsLoading = false;
      },
    });
  }


  formatHeading(title: string): string {
    return formatHeading(title);
  }

  cardText: string = `Find Out How We Solved <br class="hidden sm:block" /> Complex "IT" Challenge`;

  

}
