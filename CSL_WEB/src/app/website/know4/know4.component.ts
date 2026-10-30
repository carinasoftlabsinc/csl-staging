

import { Component, OnInit, OnDestroy, Inject, Renderer2, DOCUMENT, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, HostListener, PLATFORM_ID, TransferState, afterNextRender, makeStateKey, inject } from '@angular/core';
import { isPlatformServer, NgClass } from '@angular/common';
import { SeoService } from '@core/service/seo.service';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { GradientButtonComponent } from '../components/gradient-button/gradient-button.component';
import { RouterLink } from '@angular/router';
import { ModalFormComponent } from '../../shared/components/modal-form/modal-form.component';
import { TestimonialBubbleComponent } from '../components/testimonial-bubble/testimonial-bubble.component';
import { FooterComponent } from '../footer/footer.component';

const JOBS_STATE_KEY = makeStateKey<JobPost[]>('careers-jobs');

interface JobPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  skillImage: string[];
  roleCategory: string;
  employmentType: string;
  location: string;
  experience: string;
  noOfPositions: number;
  applicationDeadline: string;
  salary: string;
  isFeatured: boolean;
  active: boolean;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    data: JobPost[];
  };
}

@Component({
    selector: 'app-know4',
    templateUrl: './know4.component.html',
    styleUrls: ['./know4.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, NgClass, FormsModule, GradientButtonComponent, RouterLink, ModalFormComponent, TestimonialBubbleComponent, FooterComponent]
})
export class Know4Component implements OnInit, OnDestroy {
  private seoElements: HTMLElement[] = [];

  cards: JobPost[] = [];
  apiUrl = `${environment.apiUrl}/admin/getAllCareerJobPost`;
  imageUrl = `${environment.imageBaseUrl}`;
  filteredCards: JobPost[] = [];
  roles = [
    { id: 1, position: 'Game Development' },
    { id: 2, position: 'Digital Marketing' },
    { id: 3, position: 'Web/App Development' },
    { id: 4, position: 'Business Development' },
  ];

  employments = [
    { id: 1, type: 'Full-time' },
    { id: 2, type: 'Part-time' },
    { id: 3, type: 'Contract' },
    { id: 4, type: 'Internship' },
  ];
  searchTerm: string = '';
  /** An empty string means "all". */
  selectedRoleCategory: string = '';
  selectedEmploymentType: string = '';
  loading = true;
  loadError = false;

  private readonly seoService = inject(SeoService);
  // The jobs arrive after the first render, so the view is refreshed by hand (also needed for the server-rendered HTML).
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    afterNextRender(() => {
      this.updateTabIndicators();
      // The tab widths change once the web font has loaded.
      this.document.fonts?.ready.then(() => this.updateTabIndicators());
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Careers at Carina Softlabs | Game Developer & Tech Jobs'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Explore career opportunities in game development, digital marketing, web and app development. Join a team driven by technology, creativity, and innovation.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/careers');
    this.setOpenGraphTags();
    this.setSchemaMarkup();

    // The jobs were fetched while the page was prerendered. Show them straight away, then refresh quietly
    // so a position that closed since the last deploy does not stay on screen.
    const prerendered = this.transferState.get(JOBS_STATE_KEY, null);
    if (prerendered) {
      this.transferState.remove(JOBS_STATE_KEY);
      this.cards = prerendered;
      this.loading = false;
    }
    this.fetchJobPosts(!!prerendered);
    this.activeImage = this.items[0].image;
    this.filteredCards = this.getFilteredCards();
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
    const title = 'Careers | Build Your Future in Technology & Innovation';
    const description =
      'Explore career opportunities in game development, digital marketing, web and app development. Join a team driven by technology, creativity and innovation.';
    const url = 'https://carinasoftlabs.com/careers';
    const image = 'https://carinasoftlabs.com/assets/images/employee%20group%20photo.webp';

    this.seoService.setOg({ title, description, url, image });
  }

  private setSchemaMarkup(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://carinasoftlabs.com/careers#webpage',
          url: 'https://carinasoftlabs.com/careers',
          name: 'Careers | Build Your Future in Technology & Innovation',
          description:
            'Explore career opportunities in game development, digital marketing, web and app development. Join a team driven by technology, creativity, and innovation.',
          isPartOf: {
            '@id': 'https://carinasoftlabs.com/#website',
          },
          about: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://carinasoftlabs.com/careers#breadcrumb',
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
              name: 'Careers',
              item: 'https://carinasoftlabs.com/careers',
            },
          ],
        },
      ],
    };

    this.seoService.setJsonLd(schema);
  }

  fetchJobPosts(quiet = false): void {
    if (!quiet) {
      this.loading = true;
      this.loadError = false;
    }
    this.http.get<ApiResponse>(this.apiUrl).subscribe({
      next: (response) => {
        this.cards = response.data.data.filter((item) => item.active !== false).map((item) => ({
          _id: item._id,
          title: item.title,
          description: item.description,
          content: item.content,
          image: item.image || '',
          skillImage: item.skillImage || [],
          roleCategory: item.roleCategory,
          employmentType: item.employmentType,
          location: item.location,
          experience: item.experience,
          noOfPositions: item.noOfPositions,
          applicationDeadline: item.applicationDeadline,
          salary: item.salary,
          isFeatured: item.isFeatured,
          active: item.active,
        }));

        if (isPlatformServer(this.platformId)) {
          this.transferState.set(JOBS_STATE_KEY, this.cards);
        }
        this.filteredCards = this.getFilteredCards();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        if (quiet) return;
        this.loading = false;
        this.loadError = true;
        this.cdr.detectChanges();
      },
    });
  }

  selectRoleCategory(category: string): void {
    this.selectedRoleCategory = category;
    this.filteredCards = this.getFilteredCards();
    this.updateTabIndicatorsNextFrame();
  }

  selectEmploymentType(type: string): void {
    this.selectedEmploymentType = type;
    this.filteredCards = this.getFilteredCards();
    this.updateTabIndicatorsNextFrame();
  }

  getFilteredCards() {
    return this.cards.filter((card) => {
      const matchesTitle = !this.searchTerm || card.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.selectedRoleCategory || card.roleCategory.toLowerCase() === this.selectedRoleCategory.toLowerCase();
      const matchesEmployment = !this.selectedEmploymentType || 
        card.employmentType.toLowerCase().replace('-', '') === this.selectedEmploymentType.toLowerCase().replace('-', '');
  
      return matchesTitle && matchesRole && matchesEmployment;
    });
  }
  
  
  /** Moves each tab group's sliding highlight under its active tab. */
  private updateTabIndicators(): void {
    if (isPlatformServer(this.platformId)) return;
    this.host.nativeElement.querySelectorAll<HTMLElement>('.job-tabs').forEach((group) => {
      const active = group.querySelector<HTMLElement>('.job-tab.is-active');
      if (!active) return;
      group.style.setProperty('--ind-x', `${active.offsetLeft}px`);
      group.style.setProperty('--ind-y', `${active.offsetTop}px`);
      group.style.setProperty('--ind-w', `${active.offsetWidth}px`);
      group.style.setProperty('--ind-h', `${active.offsetHeight}px`);
      group.classList.add('has-indicator');
    });
  }

  // The active class is applied by change detection, so measure once it has run.
  private updateTabIndicatorsNextFrame(): void {
    if (isPlatformServer(this.platformId)) return;
    this.cdr.detectChanges();
    this.updateTabIndicators();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.updateTabIndicators();
  }

  applyFilters(): void {
    this.filteredCards = this.getFilteredCards();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRoleCategory = '';
    this.selectedEmploymentType = '';
    this.applyFilters();
  }

  isActiveCategory(category: string): boolean {
    return this.selectedRoleCategory === category;
  }

  isActiveEmployment(type: string): boolean {
    return this.selectedEmploymentType === type;
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/job-fallback.png';
  }

  activeImage!: string;

  items = [
    {
      title: 'Growth',
      image: '../../../assets/images/img-1-hover.webp',
      alt: 'Active Image',
      hoverColor: 'text-purple-500 !border-purple-500',
    },
    {
      title: 'WORK-LIFE BALANCE',
      image: '../../../assets/images/img-2-hover.webp',
      alt: 'Active Image',
      hoverColor: 'text-pink-500  !border-pink-500',
    },
    {
      title: 'ATMOSPHERE',
      image: '../../../assets/images/img-3-hover.webp',
      alt: 'Active Image',
      hoverColor: 'text-cyan-500  !border-cyan-500',
    },
    {
      title: 'Health & Wellness',
      image: '../../../assets/images/img-4-hover.webp',
      alt: 'Active Image',
      hoverColor: 'text-lime-500 !border-lime-500',
    },
  ];

  /** Alt text of the picture shown for the hovered work-culture heading. */
  get activeImageAlt(): string {
    return this.items.find((item) => item.image === this.activeImage)?.alt || 'Active Image';
  }

  /** Uploaded job image, or the fallback when the job has none (the admin can save it as the text "null"). */
  jobImageSrc(card: any): string {
    const image = card?.image;
    return image && image !== 'null' && image !== 'undefined' ? this.imageUrl + image : 'assets/job-fallback.png';
  }

  /** Job card image alt text, as given in the SEO alt text sheet. */
  jobImageAlt(_card: any): string {
    return 'product image';
  }


  getClass(item: any): string[] {
    return this.activeImage === item.image ? [item.hoverColor] : ['text-black'];
  }

  setActiveImage(image: string) {
    this.activeImage = image;
  }

  roleCard = [
    {
      id: 1,
      role: 'Developer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 5,
      role: 'Developer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 6,
      role: 'Developer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 7,
      role: 'Developer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 2,
      role: 'Designer',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 3,
      role: 'Marketing',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
    {
      id: 4,
      role: 'Manager',
      tech: 'Unity',
      experience: 'fresher/1 year',
    },
  ];

  // modal
  isModalVisible: boolean = false;

  // Open the modal
  openModal() {
    this.isModalVisible = true;
  }

  // Close the modal
  closeModal() {
    this.isModalVisible = false;
  }
}
