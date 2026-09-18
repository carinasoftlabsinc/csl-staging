import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  Renderer2,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
  SecurityContext,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeoService } from '@core/service/seo.service';
import { matchesSlug, formatHeading } from '@core/utils/slug.util';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NewsDetailComponent implements OnInit, AfterViewInit {
  cardData: any;
  _id: any;
  sections: any[] = [];
  activeSection!: string;
  activeSubSection!: string;
  sanitizedContent: SafeHtml | null = null;
  loadingNews = true;
  isLoadingNews = true;
  isNotFound = false;
  allNews: any[] = [];
  imageUrl = environment.imageBaseUrl;
  isWhiteBackground = true;
  isModalOpen = false;
  formData = { email: '' };

  @ViewChild('contentContainer', { static: false })
  contentContainer!: ElementRef;

  @ViewChild('stickySidebar')
  stickySidebar!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private elRef: ElementRef,
    private renderer: Renderer2,
    public sanitizer: DomSanitizer,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const titleParam = params['id'];
      if (titleParam) {
        this._id = titleParam.toString();
        this.getFilterData(this._id);
      } else {
        console.warn('Title parameter is missing');
      }
    });

    this.fetchAllNews();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.applyStyles();
    }
  }

  fetchAllNews() {
    this.isLoadingNews = true;
    const apiUrl = `${environment.apiUrl}/admin/getAll_news`;

    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        if (data?.data?.data) {
          this.allNews = data.data.data;
        } else {
          this.allNews = [];
        }
        this.isLoadingNews = false;
      },
      error: (error) => {
        console.error('Error fetching news data:', error);
        this.allNews = [];
        this.isLoadingNews = false;
      },
    });
  }

  getFilterData(_id: string) {
    this.loadingNews = true;
    const apiUrl = `${environment.apiUrl}/admin/getAll_news`;

    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        if (data?.data?.data) {
          this.loadingNews = false;
          this.cardData = data.data.data.find(
            (item: any) => matchesSlug(item, _id)
          );

          if (this.cardData) {
            this.isNotFound = false;
            if (this.cardData.content) {
              this.sanitizedContent = this.sanitizeContent(this.cardData.content);
            }
            this.sections = data.sections || [];

            const canonicalSlug = this.formatHeading(this.cardData.titleLink || this.cardData.title);
            this.seoService.setPage({
              title: `${this.cardData.title} | Carina Softlabs`,
              description:
                this.cardData.description ||
                'Latest news and press releases from Carina Softlabs.',
              url: `https://carinasoftlabs.com/news/${canonicalSlug}`,
              image: this.cardData.image
                ? `${environment.imageBaseUrl}${this.cardData.image}`
                : undefined,
              type: 'article',
              jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'NewsArticle',
                headline: this.cardData.title,
                description: this.cardData.description,
                image: this.cardData.image
                  ? `${environment.imageBaseUrl}${this.cardData.image}`
                  : undefined,
                author: {
                  '@type': 'Person',
                  name: this.cardData.author || 'Carina Softlabs',
                },
                datePublished: this.cardData.createdAt,
                dateModified: this.cardData.updatedAt || this.cardData.createdAt,
              },
            });

            if (isPlatformBrowser(this.platformId)) {
              setTimeout(() => this.applyStyles(), 0);
            }

            if (this.sections.length > 0) {
              this.activeSection = this.sections[0].id;
              const flatSubSections = this.sections.flatMap(
                (section) => section.subSections || []
              );
              this.activeSubSection =
                flatSubSections.length > 0 ? flatSubSections[0].id : '';
            }
          } else {
            console.warn('No news found with id:', _id);
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
      error: (error) => {
        console.error('Error while retrieving data:', error);
        this.loadingNews = false;
        this.isNotFound = true;
        this.seoService.setNotFoundStatus();
        this.resetData();
      },
    });
  }

  private resetData() {
    this.cardData = null;
    this.sections = [];
    this.activeSection = '';
    this.activeSubSection = '';
  }

  formatHeading(title: string): string {
    return title || '';
  }

  applyStyles() {
    if (!isPlatformBrowser(this.platformId) || !this.contentContainer) return;

    const contentElement = this.contentContainer.nativeElement;
    const headings = contentElement.querySelectorAll('h1, h2, h3');

    headings.forEach((heading: HTMLElement) => {
      this.renderer.addClass(heading, 'text-2xl');
      this.renderer.addClass(heading, 'font-medium');
      this.renderer.addClass(heading, 'my-1.5');
    });
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    this.activeSection = sectionId;
    this.activeSubSection = '';
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.adjustStickyPosition();
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

  toggleBackground() {
    this.isWhiteBackground = !this.isWhiteBackground;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  sanitizeContent(rawHtml: string): SafeHtml {
    if (!isPlatformBrowser(this.platformId)) {
      const cleaned = this.sanitizer.sanitize(SecurityContext.HTML, rawHtml) ?? '';
      return this.sanitizer.bypassSecurityTrustHtml(cleaned);
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;

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

    return this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML);
  }

  onSubmit(): void {
    console.log('Form submitted:', this.formData);
    this.closeModal();
  }
}
