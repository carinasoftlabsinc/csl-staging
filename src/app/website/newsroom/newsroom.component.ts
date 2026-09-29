import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, DOCUMENT, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
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
    const image =
      'https://admin.carinasoftlabs.com/web/web/file/news/image-1731506036405.png';

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

    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    script.text = JSON.stringify(schema);
    this.renderer.appendChild(this.document.head, script);
    this.seoElements.push(script);
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
