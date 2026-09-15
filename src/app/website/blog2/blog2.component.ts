import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
  SecurityContext,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeoService } from '@core/service/seo.service';

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
  sections: any[] = [];
  activeSection!: string;
  activeSubSection!: string;
  apiUrl = `${environment.apiUrl}/admin/getAll_blog`;
  singleBlogApi = `${environment.apiUrl}/admin/get_blog`;
  getAll_blogTitles = `${environment.apiUrl}/admin/getAll_blogTitles`;
  imageUrl = environment.imageBaseUrl;
  allBlogs: any[] = [];
  filteredBlogs: any[] = [];
  loadingBlog = true;
  loadingMoreBlogs = true;
  sanitizedSections: {
    _id: string;
    heading: string;
    sanitizedContent: SafeHtml;
  }[] = [];
  loading = false;
  isNotFound = false;
  faqs: {
    question: string;
    answer: string;
    _id: string;
    open?: boolean;
    safeAnswer?: SafeHtml;
  }[] = [];

  @ViewChild('stickySidebar') stickySidebar!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const titleLink = params['title'];
      if (titleLink) {
        this.getBlogIdFromTitle(titleLink);
      }
    });
  }

  fetchAllBlogs() {
    this.loadingMoreBlogs = true;

    this.http
      .get(`${environment.apiUrl}/admin/getAll_blog?category=web`)
      .subscribe({
        next: (response: any) => {
          this.loadingMoreBlogs = false;
          if (response && response.data && response.data.data) {
            this.allBlogs = response.data.data;

            if (this.cardDataa) {
              this.filteredBlogs = this.allBlogs.filter(
                (blog) => blog.titleLink !== this.cardDataa.titleLink
              );
            }
          }
        },
        error: (error) => {
          console.error('Error fetching blogs:', error);
          this.loadingMoreBlogs = false;
        },
      });
  }

  getBlogIdFromTitle(titleLink: string) {
    this.loading = true;

    this.http.get(this.getAll_blogTitles).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.data) {
          const blog = response.data.find(
            (item: any) =>
              item.titleLink === titleLink ||
              this.formatHeading(item.titleLink) === titleLink
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
      error: (error) => {
        this.loading = false;
        this.isNotFound = true;
        this.seoService.setNotFoundStatus();
        console.error('Error getting blogs:', error);
      },
    });
  }

  getBlogById(_id: string) {
    this.loadingBlog = true;
    this.http.get(`${environment.apiUrl}/admin/get_blog/${_id}`).subscribe({
      next: (res: any) => {
        this.loadingBlog = false;
        this.cardDataa = res.data.data;
        if (!this.cardDataa) {
          this.isNotFound = true;
          this.seoService.setNotFoundStatus();
          return;
        }

        const rawSections = this.cardDataa?.sections || [];
        this.sections = rawSections;
        this.sanitizedSections = rawSections.map((section: any) => ({
          _id: section._id,
          heading: section.heading,
          sanitizedContent: this.sanitizeContent(section.content || ''),
        }));
        this.faqs = (this.cardDataa?.faqs || []).map((faq: any, i: any) => ({
          ...faq,
          open: i === 0,
          safeAnswer: this.sanitizer.bypassSecurityTrustHtml(faq.answer),
        }));

        this.seoService.setPage({
          title: `${this.cardDataa.title} | Carina Softlabs`,
          description:
            this.cardDataa.description ||
            'Read more insights on technology and innovation from Carina Softlabs.',
          url: `https://carinasoftlabs.com/blog/${this.cardDataa.titleLink}`,
          image: this.cardDataa.image
            ? `${environment.imageBaseUrl}${this.cardDataa.image}`
            : undefined,
          type: 'article',
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
        if (this.sections.length > 0) {
          this.activeSection = this.sections[0]._id;
          const flatSubSections = this.sections.flatMap(
            (section) => section.subSections || []
          );
          this.activeSubSection =
            flatSubSections.length > 0 ? flatSubSections[0]._id : '';
        }
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
    this.activeSection = '';
    this.activeSubSection = '';
  }

  formatHeading(heading: string): string {
    return heading || '';
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
    this.sections.forEach((section) => {
      const element = document.getElementById(section._id);
      const rect = element?.getBoundingClientRect();
      if (rect && rect.top >= 0 && rect.top < window.innerHeight / 2) {
        this.activeSection = section._id;
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
}
