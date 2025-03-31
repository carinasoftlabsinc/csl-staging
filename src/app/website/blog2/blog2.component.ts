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
@Component({
  selector: 'app-blog2',
  templateUrl: './blog2.component.html',
  styleUrls: ['./blog2.component.scss'],
})
export class Blog2Component implements OnInit {
  cardData: any = null; // Holds the matched blog data
  sections: any[] = [];
  activeSection!: string;
  activeSubSection!: string;
  apiUrl = `${environment.apiUrl}/admin/getAll_blog`; // Replace with environment variable if needed
  imageUrl = environment.imageBaseUrl;
  allBlogs: any[] = [];
  filteredBlogs: any[] = [];


  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const blogId = params['title']; // Extract the `title` parameter from route
      if (blogId) {
        this.getFilterData(blogId);
      }
    });

    this.fetchAllBlogs();
  }

  fetchAllBlogs() {
    this.http.get(this.apiUrl).subscribe(
      (response: any) => {
        if (response && response.data && response.data.data) {
          this.allBlogs = response.data.data; // Store all fetched blogs
  
          // Exclude the currently open blog after data is fetched
          if (this.cardData) {
            this.filteredBlogs = this.allBlogs.filter(
              (blog) => this.formatHeading(blog.titleLink) !== this.formatHeading(this.cardData.titleLink)
            );
          }
        } else {
          console.warn('No data found');
        }
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }
  

  getFilterData(_id: string) {
    this.http.get(this.apiUrl).subscribe(
      (data: any) => {
        if (data && data.data && data.data.data) {
          // Find the blog where `titleLink` matches the `_id`
          this.cardData = data.data.data.find(
            (item: any) => this.formatHeading(item.titleLink) === _id
          );

          if (this.cardData) {
            this.sections = this.cardData.sections || [];

            // Apply styles after setting `cardData`
            setTimeout(() => this.applyStyles(), 0);

            if (this.sections.length > 0) {
              this.activeSection = this.sections[0]._id;
              const flatSubSections = this.sections.flatMap(
                (section) => section.subSections || []
              );
              this.activeSubSection =
                flatSubSections.length > 0 ? flatSubSections[0]._id : '';
            }
          } else {
            console.warn('No blog found for ID:', _id);
            this.resetData();
          }
        } else {
          console.warn('Invalid API response format');
          this.resetData();
        }
      },
      (error) => {
        console.error('Error while retrieving blog data:', error);
        this.resetData();
      }
    );
  }

  private resetData() {
    this.cardData = null;
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

  
}
