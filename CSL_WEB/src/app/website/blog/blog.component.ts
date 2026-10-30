import { Component, OnInit, OnDestroy, Inject, Renderer2, DOCUMENT, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { formatHeading } from '@core/utils/slug.util';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { NgTemplateOutlet } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, RouterLink, NgTemplateOutlet, FooterComponent]
})
export class BlogComponent implements OnInit, OnDestroy {
  gameBlogs: any[] = [];
  digitalM : any[] = [];
  App : any[] = [];
  web : any[] = [];
  loadingGame = true;
  loadingWeb = true;
  loadingDigital = true;
  loadingApp = true;
  loadingFeatured = true;
  private seoElements: HTMLElement[] = [];

  private readonly seoService = inject(SeoService);

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  imageUrl = environment.imageBaseUrl;
  /** Shown when a post has no cover image or the file cannot be loaded. */
  readonly fallbackImage = 'assets/images/og/og-default.png';

  cardImage(image: string | undefined): string {
    if (!image) return this.fallbackImage;
    const match = /^\/blog\/(image_2-[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|gif))$/i.exec(image);
    return match ? `${this.imageUrl}/blog-card/${match[1]}.webp` : this.imageUrl + image;
  }

  onCoverError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const original = img.dataset['original'];
    if (original && img.src !== original && !img.dataset['retried']) {
      img.dataset['retried'] = 'true';
      img.src = original;
      return;
    }
    // Swap once, so a missing fallback cannot trigger an endless error loop.
    if (!img.src.endsWith(this.fallbackImage)) {
      img.src = this.fallbackImage;
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Gaming Trends & Tech Blog | Web Dev & Digital Marketing'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Discover expert tech articles covering game development trends, mobile app engineering, web technologies, and AI-driven digital marketing strategies.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/blog');
    this.setOpenGraphTags();
    this.setSchemaMarkup();

    this.fetchFeaturedBlogs();
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
    const title = 'Tech & Digital Insights | Game, Web, App & Marketing';
    const description =
      'Explore the latest insights on game development, web and app development, digital marketing, design, technology trends and digital innovation.';
    const url = 'https://carinasoftlabs.com/blog';
    const image = 'https://carinasoftlabs.com/assets/images/og/og-default.png';

    this.seoService.setOg({ title, description, url, image });
  }

  private setSchemaMarkup(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Blog',
          '@id': 'https://carinasoftlabs.com/blog#blog',
          url: 'https://carinasoftlabs.com/blog',
          name: 'Tech & Digital Insights | Game, Web, App & Marketing',
          description:
            'Explore the latest insights on game development, web and app development, digital marketing, design, technology trends and digital innovation.',
          isPartOf: {
            '@id': 'https://carinasoftlabs.com/#website',
          },
          publisher: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://carinasoftlabs.com/blog#breadcrumb',
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
              name: 'Blog',
              item: 'https://carinasoftlabs.com/blog',
            },
          ],
        },
      ],
    };

    this.seoService.setJsonLd(schema);
  }

  fetchFeaturedBlogs() {
    this.loadingGame = true;
    this.loadingWeb = true;
    this.loadingDigital = true;
    this.loadingApp = true;
    this.loadingFeatured = true;

    const fields = 'title,titleLink,category,description,image,image_2,author,date,isFeature,createdAt';
    this.http
      .get<any>(`${environment.apiUrl}/admin/getAll_blog?fields=${fields}`)
      .pipe(
        timeout(15000),
        catchError((err) => {
          console.error('Error fetching blogs in BlogComponent:', err);
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response?.status === 'success' && response?.data?.data) {
            const blogs = response.data.data;

            this.gameBlogs = blogs.filter((b: any) => b.category === 'game');
            this.web = blogs.filter((b: any) => b.category === 'web');
            this.digitalM = blogs.filter((b: any) => b.category === 'digital-marketing');
            this.App = blogs.filter((b: any) => b.category === 'app');

            const latestFeaturedBlogs = blogs
              .filter((blog: any) => blog.isFeature)
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              .slice(0, 3);

            if (latestFeaturedBlogs.length > 0) {
              this.featured = latestFeaturedBlogs[0];
            }
            if (latestFeaturedBlogs.length > 1) {
              this.featured2 = latestFeaturedBlogs.slice(1);
            }
          }

          this.loadingGame = false;
          this.loadingWeb = false;
          this.loadingDigital = false;
          this.loadingApp = false;
          this.loadingFeatured = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loadingGame = false;
          this.loadingWeb = false;
          this.loadingDigital = false;
          this.loadingApp = false;
          this.loadingFeatured = false;
          this.cdr.markForCheck();
        },
      });
  }
  

  navigateToBlog(blog: any) {
    const formattedTitle = blog.titleLink; // Ensure this matches the backend data
    this.router.navigate([`/blog/${formattedTitle}`]);
  }
  

  featured: any; // Stores the first blog
  featured2: any[] = []; // Stores the second and third blogs

 
  formatHeading(heading: string): string {
    return formatHeading(heading);
  }

  cardText: string = `Find Out How We Solved <br class="hidden sm:block" /> Complex "IT" Challenge`;
}
