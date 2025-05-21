import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
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

  allNews: any[] = [];

  @ViewChild('contentContainer', { static: false })
  contentContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private elRef: ElementRef,
    private renderer: Renderer2,
    public sanitizer: DomSanitizer
  ) {}

  imageUrl = environment.imageBaseUrl;

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

  // fetchAllNews() {
  //   const apiUrl = `${environment.apiUrl}/admin/getAll_news`;

  //   this.http.get(apiUrl).subscribe(
  //     (response: any) => {
  //       if (response && response.data && response.data.data) {
  //         this.allNews = response.data.data; // Store the fetched data in allNews array
  //       } else {
  //         console.warn('No data found');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching news data:', error);
  //     }
  //   );
  // }

  fetchAllNews() {
  const apiUrl = `${environment.apiUrl}/admin/getAll_news`;

  this.isLoadingNews = true;

  this.http.get(apiUrl).subscribe(
    (response: any) => {
      if (response && response.data && response.data.data) {
        this.allNews = response.data.data;
      } else {
        console.warn('No data found');
        this.allNews = [];
      }
      this.isLoadingNews = false;
    },
    (error) => {
      console.error('Error fetching news data:', error);
      this.allNews = [];
      this.isLoadingNews = false;
    }
  );
}


  ngAfterViewInit() {
    // Apply styles once the view has been initialized
    this.applyStyles();
  }

  getFilterData(_id: string) {
    this.loadingNews = true;
    const apiUrl = `${environment.apiUrl}/admin/getAll_news`;

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        if (data && data.data && data.data.data) {
          this.loadingNews = false;
          this.cardData = data.data.data.find(
            (item: any) => this.formatHeading(item.titleLink) === _id
          );

          if (this.cardData?.content) {
  this.sanitizedContent = this.sanitizeContent(this.cardData.content);
}
          this.sections = data.sections || [];

          // Apply styles after setting cardData
          setTimeout(() => this.applyStyles(), 0);

          if (this.sections.length > 0) {
            this.activeSection = this.sections[0].id;
            const flatSubSections = this.sections.flatMap(
              (section) => section.subSections || []
            );
            this.activeSubSection =
              flatSubSections.length > 0 ? flatSubSections[0].id : '';
          }
        } else {
          console.warn('No data found for id:', _id);
          this.cardData = null;
          this.sections = [];
          this.activeSection = '';
          this.activeSubSection = '';
        }
      },
      (error) => {
        console.error('Error while retrieving data:', error);
        this.loadingNews = false;
        this.cardData = null;
        this.sections = [];
        this.activeSection = '';
        this.activeSubSection = '';
      }
    );
  }

  formatHeading(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  applyStyles() {
    if (!this.contentContainer) return;

    const contentElement = this.contentContainer.nativeElement;
    const headings = contentElement.querySelectorAll('h1, h2, h3');
    const paragraphs = contentElement.querySelectorAll('p');

    // Apply Tailwind styles to headings
    headings.forEach((heading: HTMLElement) => {
      this.renderer.addClass(heading, 'text-2xl');
      this.renderer.addClass(heading, 'font-medium');
      this.renderer.addClass(heading, 'my-1.5');
    });

    // Apply Tailwind styles to paragraphs
    // paragraphs.forEach((paragraph: HTMLElement) => {
    //   this.renderer.addClass(paragraph, 'text-base');
    //   this.renderer.addClass(paragraph, 'leading-relaxed');
    //   this.renderer.addClass(paragraph, 'my-2');
    // });
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    this.activeSection = sectionId;
    this.activeSubSection = '';
  }

  @ViewChild('stickySidebar', { static: true }) stickySidebar!: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.adjustStickyPosition();
  }

  private adjustStickyPosition() {
    const stickyElement = this.stickySidebar.nativeElement;
    const sectionElement = stickyElement.closest('section');
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

  isWhiteBackground = true;
  toggleBackground() {
    this.isWhiteBackground = !this.isWhiteBackground;
  }

  isModalOpen = false;
  formData = { email: '' };

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  
  sanitizeContent(rawHtml: string): SafeHtml {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;

    // List of unwanted tags to remove entirely
    const unwantedTags = ['font', 'span'];

    unwantedTags.forEach((tag) => {
      const elements = tempDiv.getElementsByTagName(tag);
      while (elements.length > 0) {
        const element = elements[0];
        const parent = element.parentNode;
        // Replace the tag with its inner content
        while (element.firstChild) {
          parent?.insertBefore(element.firstChild, element);
        }
        parent?.removeChild(element);
      }
    });

    // Remove inline styles from remaining elements
    tempDiv
      .querySelectorAll('[style]')
      .forEach((el) => el.removeAttribute('style'));

    const images = tempDiv.getElementsByTagName('img');
    Array.from(images).forEach((img) => {
      img.style.width = '100%';
      img.style.height = 'auto'; // Optional, maintain aspect ratio
      img.classList.add('w-full', 'h-auto'); // Add Tailwind classes
    });

    return this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML);
  }

  onSubmit(): void {
    console.log('Form submitted:', this.formData);
    this.closeModal();
  }
}
