import { optimizeContentImages } from '@core/utils/content-images.util';
import { addHeadingIds, ContentHeading } from '@core/utils/content-headings.util';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  SecurityContext,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeoService } from '@core/service/seo.service';
import { matchesSlug, formatHeading } from '@core/utils/slug.util';
import { timeout, catchError, of } from 'rxjs';

@Component({
  selector: 'app-blog2',
  templateUrl: './blog2.component.html',
  styleUrls: ['./blog2.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class Blog2Component implements OnInit {
  cardData: any = null;
  cardDataa: any = null;
  allCards: any[] = [];
  allBlogs: any[] = [];
  filteredBlogs: any[] = [];
  sections: any[] = [];
  sanitizedSections: {
    _id: string;
    heading: string;
    sanitizedContent: SafeHtml;
  }[] = [];
  /** The post body (one HTML document); null for older posts that still use `sections`. */
  contentHtml: SafeHtml | null = null;
  /** Table of contents: the post's <h2> headings, or the section headings of older posts. */
  tocItems: ContentHeading[] = [];
  loading = false;
  loadingBlog = true;
  loadingMoreBlogs = true;
  isNotFound = false;
  faqs: {
    question: string;
    answer: string;
    _id: string;
    open?: boolean;
    safeAnswer?: SafeHtml;
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seoService: SeoService,
    private cdr: ChangeDetectorRef
  ) {}

  getAll_blogTitles = `${environment.apiUrl}/admin/getAll_blogTitles`;
  imageUrl = environment.imageBaseUrl;

  activeSection = '';
  activeSubSection = '';

  @ViewChild('stickySidebar') stickySidebar!: ElementRef;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const titleLink = params['title'];
      if (titleLink) {
        this.getBlogIdFromTitle(titleLink);
      } else {
        console.warn('Title parameter is missing in URL');
        this.isNotFound = true;
        this.seoService.setNotFoundStatus();
        this.resetData();
      }
    });

    this.fetchAllBlogs();
  }

  fetchAllBlogs() {
    this.loadingMoreBlogs = true;

    this.http
      .get(
        `${environment.apiUrl}/admin/getAll_blog?category=web&fields=title,titleLink,category,image,image_2,author,date`
      )
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error('Error fetching blogs:', err);
          return of({ data: { data: [] } });
        })
      )
      .subscribe({
        next: (response: any) => {
          this.loadingMoreBlogs = false;
          if (response?.data?.data) {
            this.allBlogs = response.data.data;

            if (this.cardDataa) {
              this.filteredBlogs = this.allBlogs.filter(
                (blog) => blog.titleLink !== this.cardDataa.titleLink
              );
            }
          }
        },
      });
  }

  getBlogIdFromTitle(titleLink: string) {
    this.loading = true;

    this.http
      .get(this.getAll_blogTitles)
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error('Error getting blog titles:', err);
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response?.data) {
            const blog = response.data.find(
              (item: any) => matchesSlug(item, titleLink)
            );

            if (blog?._id) {
              this.isNotFound = false;
              this.getBlogById(blog._id);
            } else {
              console.warn('No blog found with titleLink:', titleLink);
              this.isNotFound = true;
              this.seoService.setNotFoundStatus();
              this.resetData();
            }
          } else {
            this.isNotFound = true;
            this.seoService.setNotFoundStatus();
            this.resetData();
          }
        },
      });
  }

  getBlogById(_id: string) {
    this.loadingBlog = true;
    this.http
      .get(`${environment.apiUrl}/admin/get_blog/${_id}`)
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error('Error fetching blog by id:', err);
          return of(null);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.loadingBlog = false;
          this.cardDataa = res?.data?.data;
          if (!this.cardDataa) {
            this.isNotFound = true;
            this.seoService.setNotFoundStatus();
            return;
          }

        const content: string = this.cardDataa?.content || '';
        if (content.trim()) {
          // Heading ids are added after cleaning, because Angular's sanitizer removes `id`.
          const { html, headings } = addHeadingIds(this.cleanContent(content));
          this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(html);
          this.tocItems = headings;
          this.sections = [];
          this.sanitizedSections = [];
        } else {
          const rawSections = this.cardDataa?.sections || [];
          this.contentHtml = null;
          this.sections = rawSections;
          this.sanitizedSections = rawSections.map((section: any) => ({
            _id: section._id,
            heading: section.heading,
            sanitizedContent: this.sanitizeContent(section.content || ''),
          }));
          this.tocItems = rawSections
            .filter((section: any) => section.heading)
            .map((section: any) => ({ id: section._id, text: section.heading }));
        }
        this.faqs = (this.cardDataa?.faqs || []).map((faq: any, i: any) => ({
          ...faq,
          open: i === 0,
          safeAnswer: this.sanitizeContent(faq.answer || ''),
        }));

        const canonicalSlug = this.formatHeading(this.cardDataa.titleLink || this.cardDataa.title);
        this.seoService.setPage({
          title: `${this.cardDataa.title} | Carina Softlabs`,
          description:
            this.cardDataa.description ||
            'Read more insights on technology and innovation from Carina Softlabs.',
          url: `https://carinasoftlabs.com/blog/${canonicalSlug}`,
          image: this.cardDataa.image
            ? `${environment.imageBaseUrl}${this.cardDataa.image}`
            : undefined,
          type: 'article',
          imageAlt: this.cardDataa.title,
          publishedTime: this.cardDataa.createdAt,
          modifiedTime: this.cardDataa.updatedAt || this.cardDataa.createdAt,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: this.cardDataa.title,
            description: this.cardDataa.description,
            image: this.cardDataa.image
              ? `${environment.imageBaseUrl}${this.cardDataa.image}`
              : undefined,
            author: {
              '@type': 'Person',
              name: this.cardDataa.author || 'Carina Softlabs',
            },
            datePublished: this.cardDataa.createdAt,
            dateModified: this.cardDataa.updatedAt || this.cardDataa.createdAt,
          },
        });

        this.fetchAllBlogs();
        this.activeSection = this.tocItems[0]?.id || '';
        this.activeSubSection = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching blog by ID:', error);
        this.loadingBlog = false;
        this.isNotFound = true;
        this.seoService.setNotFoundStatus();
      },
    });
  }

  toggleFAQ(index: number) {
    if (this.faqs[index]) {
      this.faqs[index].open = !this.faqs[index].open;
    }
  }

  private resetData() {
    this.cardData = null;
    this.cardDataa = null;
    this.sections = [];
    this.sanitizedSections = [];
    this.contentHtml = null;
    this.tocItems = [];
    this.activeSection = '';
    this.activeSubSection = '';
  }

  formatHeading(heading: string): string {
    return formatHeading(heading);
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    this.activeSection = sectionId;
    this.activeSubSection = '';
  }

  scrollToSubSection(event: Event, subSectionId: string) {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    document
      .getElementById(subSectionId)
      ?.scrollIntoView({ behavior: 'smooth' });
    this.activeSubSection = subSectionId;
  }

  private highlightActiveSection() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      const rect = element?.getBoundingClientRect();
      if (rect && rect.top >= 0 && rect.top < window.innerHeight / 2) {
        this.activeSection = item.id;
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.adjustStickyPosition();
    this.highlightActiveSection();
  }

  private adjustStickyPosition() {
    if (!isPlatformBrowser(this.platformId) || !this.stickySidebar?.nativeElement) return;
    const stickyElement = this.stickySidebar.nativeElement;
    const sectionElement = stickyElement.closest('section');
    if (!sectionElement) return;
    const sectionBottom = sectionElement.getBoundingClientRect().bottom;
    const stickyHeight = stickyElement.offsetHeight;

    if (sectionBottom <= stickyHeight + 20) {
      stickyElement.style.position = 'absolute';
      stickyElement.style.bottom = '0';
      stickyElement.style.top = 'unset';
      stickyElement.style.width = '100%';
    } else {
      stickyElement.style.position = 'sticky';
      stickyElement.style.top = '50px';
      stickyElement.style.bottom = 'unset';
    }
  }

  sanitizeContent(rawHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.cleanContent(rawHtml));
  }

  /** Post HTML made safe to show: Angular's sanitizer, then (in the browser) inline fonts and styles removed. */
  private cleanContent(rawHtml: string): string {
    // Angular's sanitizer removes `id`, which anchor links (#name) need: carry it through in `title`.
    const marked = rawHtml.replace(
      /<a\b([^>]*?)\sid\s*=\s*["']([a-z0-9_-]+)["']([^>]*)>/gi,
      (_, before, id, after) => `<a${before}${after} title="__anchor:${id}">`
    );
    const cleaned = (this.sanitizer.sanitize(SecurityContext.HTML, marked) ?? '').replace(
      /\stitle="__anchor:([a-z0-9_-]+)"/gi,
      ' id="$1"'
    );
    if (!isPlatformBrowser(this.platformId)) {
      return optimizeContentImages(cleaned);
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleaned;

    const unwantedTags = ['font', 'span'];
    unwantedTags.forEach((tag) => {
      const elements = tempDiv.getElementsByTagName(tag);
      while (elements.length > 0) {
        const element = elements[0];
        const parent = element.parentNode;
        while (element.firstChild) {
          parent?.insertBefore(element.firstChild, element);
        }
        parent?.removeChild(element);
      }
    });

    tempDiv
      .querySelectorAll('[style]')
      .forEach((el) => el.removeAttribute('style'));

    const images = tempDiv.getElementsByTagName('img');
    Array.from(images).forEach((img) => {
      img.style.width = '100%';
      img.style.height = 'auto';
      img.classList.add('w-full', 'h-auto');
    });

    return optimizeContentImages(tempDiv.innerHTML);
  }
}
