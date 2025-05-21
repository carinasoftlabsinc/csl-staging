import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-blog2',
  templateUrl: './blog2.component.html',
  styleUrls: ['./blog2.component.scss'],
})
export class Blog2Component implements OnInit {
  cardData: any = null; // Holds the matched blog data
  cardDataa: any = null; // Holds the matched blog data
  sections: any[] = [];
  activeSection!: string;
  activeSubSection!: string;
  apiUrl = `${environment.apiUrl}/admin/getAll_blog`; // Replace with environment variable if needed
  singleBlogApi = `${environment.apiUrl}/admin/get_blog`; // assuming your baseUrl ends with /web/web/v1
  getAll_blogTitles = `${environment.apiUrl}/admin/getAll_blogTitles`; // assuming your baseUrl ends with /web/web/v1
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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // this.route.params.subscribe((params) => {
    //   const blogId = params['title']; // Extract the `title` parameter from route
    //   if (blogId) {
    //     this.getFilterData(blogId);
    //   }
    // });

    this.route.params.subscribe((params) => {
      const titleLink = params['title'];
      if (titleLink) {
        this.getBlogIdFromTitle(titleLink);
      }
    });

    // this.fetchAllBlogs();
  }

  fetchAllBlogs() {
    this.loadingMoreBlogs = true;

    this.http
      .get(`${environment.apiUrl}/admin/getAll_blog?category=web`)
      .subscribe(
        (response: any) => {
          this.loadingMoreBlogs = false;
          if (response && response.data && response.data.data) {
            this.allBlogs = response.data.data; // Store all fetched blogs

            if (this.cardDataa) {
              this.filteredBlogs = this.allBlogs.filter(
                (blog) => blog.titleLink !== this.cardDataa.titleLink
              );
            }
          } else {
            console.warn('No data found');
          }
        },
        (error) => {
          console.error('Error fetching blogs:', error);
          this.loadingMoreBlogs = false;
        }
      );
  }

  // getFilterData(_id: string) {
  //   this.loadingBlog = true;
  //   this.http.get(this.apiUrl).subscribe(
  //     (data: any) => {
  //       this.loadingBlog = false;
  //       if (data && data.data && data.data.data) {
  //         // Find the blog where `titleLink` matches the `_id`
  //         this.cardData = data.data.data.find(
  //           (item: any) => this.formatHeading(item.titleLink) === _id
  //         );

  //         if (this.cardData) {
  //           // this.sections = this.cardData.sections || [];
  //           const rawSections = this.cardData.sections || [];
  //           this.sections = rawSections;

  //           this.sanitizedSections = rawSections.map((section: any) => ({
  //             _id: section._id,
  //             heading: section.heading,
  //             sanitizedContent: this.sanitizeContent(section.content || '')
  //           }));

  //           // Apply styles after setting `cardData`
  //           setTimeout(() => this.applyStyles(), 0);

  //           if (this.sections.length > 0) {
  //             this.activeSection = this.sections[0]._id;
  //             const flatSubSections = this.sections.flatMap(
  //               (section) => section.subSections || []
  //             );
  //             this.activeSubSection =
  //               flatSubSections.length > 0 ? flatSubSections[0]._id : '';
  //           }
  //         } else {
  //           console.warn('No blog found for ID:', _id);
  //           this.resetData();
  //         }
  //       } else {
  //         console.warn('Invalid API response format');
  //         this.resetData();
  //       }
  //     },
  //     (error) => {
  //       console.error('Error while retrieving blog data:', error);
  //       this.loadingBlog = false;
  //       this.resetData();
  //     }
  //   );
  // }

  getBlogIdFromTitle(titleLink: string) {
    this.loading = true; // Show loading

    this.http.get(this.getAll_blogTitles).subscribe(
      (response: any) => {
        this.loading = false; // Hide loading after response
        if (response?.data) {
          const blog = response.data.find(
            (item: any) => this.formatHeading(item.titleLink) === titleLink
          );

          if (blog?._id) {
            this.getBlogById(blog._id);
          } else {
            console.warn('No blog found with titleLink:', titleLink);
            this.resetData();
          }
        } else {
          console.warn('No data received from blog titles API.');
          this.resetData();
        }
      },
      (error) => {
        this.loading = false; // Hide loading on error
        console.error('Error getting blogs:', error);
      }
    );
  }

  // getBlogIdFromTitle(titleLink: string) {
  //   // Option 1: Use getAll_blog to map titleLink → _id
  //   this.http.get(this.getAll_blogTitles).subscribe(
  //     (data: any) => {
  //       if (data && data.data && data.data.data) {
  //         const blog = data.data.data.find(
  //           (item: any) => this.formatHeading(item.titleLink) === titleLink
  //         );
  //         if (blog?._id) {
  //           this.getBlogById(blog._id);
  //         } else {
  //           console.warn('No blog found with titleLink:', titleLink);
  //           this.resetData();
  //         }
  //       }
  //     },
  //     (error) => {
  //       console.error('Error getting blogs:', error);
  //     }
  //   );
  // }

  getBlogById(_id: string) {
    this.loadingBlog = true;
    this.http.get(`${environment.apiUrl}/admin/get_blog/${_id}`).subscribe(
      (res: any) => {
        this.loadingBlog = false;
        this.cardDataa = res.data.data;
        const rawSections = this.cardDataa?.sections || [];
        this.sections = rawSections;
        this.sanitizedSections = rawSections.map((section: any) => ({
          _id: section._id,
          heading: section.heading,
          sanitizedContent: this.sanitizeContent(section.content || ''),
        }));
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
      (error) => {
        console.error('Error fetching blog by ID:', error);
        this.loadingBlog = false;
      }
    );
  }

  private resetData() {
    this.cardData = null;
    this.cardDataa = null;
    this.sections = [];
    this.activeSection = '';
    this.activeSubSection = '';
  }

  private applyStyles() {
    // Custom styles can be applied here after DOM updates if needed
  }

  formatHeading(heading: string): string {
    return heading.toLowerCase().replace(/ /g, '-');
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    this.activeSection = sectionId;
    this.activeSubSection = ''; // Clear active sub-section on main section scroll
  }

  scrollToSubSection(event: Event, subSectionId: string) {
    event.preventDefault();
    document
      .getElementById(subSectionId)
      ?.scrollIntoView({ behavior: 'smooth' });
    this.activeSubSection = subSectionId;
  }

  private highlightActiveSection() {
    this.sections.forEach((section) => {
      const element = document.getElementById(section._id);
      const rect = element?.getBoundingClientRect();
      if (rect && rect.top >= 0 && rect.top < window.innerHeight / 2) {
        this.activeSection = section._id;
      }
    });
  }

  @ViewChild('stickySidebar', { static: true }) stickySidebar!: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.adjustStickyPosition();
    this.highlightActiveSection();
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
}
