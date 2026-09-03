import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { id } from '@swimlane/ngx-charts';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
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

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  imageUrl = environment.imageBaseUrl;

  ngOnInit(): void {
    this.titleService.setTitle(
      'Tech & Digital Insights | Game, Web, App & Marketing Blog'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Explore the latest updates & insights on game development, web and app development, digital marketing, design, technology trends, and digital innovation.',
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
    const image = 'https://carinasoftlabs.com/assets/CSL-logo-footer.svg';

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

    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    script.text = JSON.stringify(schema);
    this.renderer.appendChild(this.document.head, script);
    this.seoElements.push(script);
  }

  // fetchFeaturedBlogs() {
  //   this.http
  //     .get<any>(`${environment.apiUrl}/admin/getAll_blog`)
  //     .subscribe((response) => {
  //       if (response.status === 'success' && response.data?.data) {
  //         const blogs = response.data.data;

  //         const gameBlogs = blogs
  //         .filter((blog: { category: string }) => blog.category === 'game');
  //         this.gameBlogs = gameBlogs;

  //         const digitalM = blogs
  //         .filter((blog: { category: string }) => blog.category === 'digital-marketing');
  //         this.digitalM = digitalM;

  //         const App = blogs
  //         .filter((blog: { category: string }) => blog.category === 'app');
  //         this.App = App;

  //         const web = blogs
  //         .filter((blog: { category: string }) => blog.category === 'web');
  //         this.web = web;


  //         // Filter, sort, and get latest 3 featured blogs
  //         const latestFeaturedBlogs = blogs
  //           .filter((blog: { isFeature: any }) => blog.isFeature) // Keep only featured blogs
  //           .sort(
  //             (
  //               a: { createdAt: string | number | Date },
  //               b: { createdAt: string | number | Date }
  //             ) =>
  //               new Date(b.createdAt).getTime() -
  //               new Date(a.createdAt).getTime()
  //           ) // Sort by date (latest first)
  //           .slice(0, 3); // Keep the latest 3 blogs

  //         // Assign to UI variables
  //         if (latestFeaturedBlogs.length > 0) {
  //           this.featured = latestFeaturedBlogs[0];
  //         }

  //         if (latestFeaturedBlogs.length > 1) {
  //           this.featured2 = latestFeaturedBlogs.slice(1);
  //         }

          
  //       }
  //     });
  // }

  // fetchFeaturedBlogs() {
  //   this.http
  //     .get<any>(`${environment.apiUrl}/admin/getAll_blog`)
  //     .subscribe({
  //       next: (response) => {
  //         if (response.status === 'success' && response.data?.data) {
  //           const blogs = response.data.data;
  
  //           this.gameBlogs = blogs.filter((b: any) => b.category === 'game');
  //           this.loadingGame = false;
  
  //           this.web = blogs.filter((b: any) => b.category === 'web');
  //           this.loadingWeb = false;
  
  //           this.digitalM = blogs.filter((b: any) => b.category === 'digital-marketing');
  //           this.loadingDigital = false;
  
  //           this.App = blogs.filter((b: any) => b.category === 'app');
  //           this.loadingApp = false;
  
  //           const latestFeaturedBlogs = blogs
  //             .filter((blog: any) => blog.isFeature)
  //             .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  //             .slice(0, 3);
  
  //           if (latestFeaturedBlogs.length > 0) {
  //             this.featured = latestFeaturedBlogs[0];
  //           }
  
  //           if (latestFeaturedBlogs.length > 1) {
  //             this.featured2 = latestFeaturedBlogs.slice(1);
  //           }
  //         }
  
  //         // ✅ Ensure loading is turned off regardless
  //         this.loadingFeatured = false;
  //       },
  //       error: () => {
  //         // ✅ Turn off loading even on error
  //         this.loadingFeatured = false;
  //       }
  //     });
  // }
  

  // fetchFeaturedBlogs() {
  //   this.http
  //     .get<any>(`${environment.apiUrl}/admin/getAll_blog`)
  //     .subscribe((response) => {
  //       if (response.status === 'success' && response.data?.data) {
  //         const blogs = response.data.data;
  
  //         this.gameBlogs = blogs.filter((b: any) => b.category === 'game');
  //         this.loadingGame = false;
  
  //         this.web = blogs.filter((b: any) => b.category === 'web');
  //         this.loadingWeb = false;
  
  //         this.digitalM = blogs.filter((b: any) => b.category === 'digital-marketing');
  //         this.loadingDigital = false;
  
  //         this.App = blogs.filter((b: any) => b.category === 'app');
  //         this.loadingApp = false;
  
  //         const latestFeaturedBlogs = blogs
  //           .filter((blog: any) => blog.isFeature)
  //           .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  //           .slice(0, 3);
  
  //         if (latestFeaturedBlogs.length > 0) {
  //           this.featured = latestFeaturedBlogs[0];
  //         }
  
  //         if (latestFeaturedBlogs.length > 1) {
  //           this.featured2 = latestFeaturedBlogs.slice(1);
  //         }
  
  //         this.loadingFeatured = false;
  //       }
  //     });
  // }
  

  fetchFeaturedBlogs() {
    this.loadingGame = true;
    this.loadingWeb = true;
    this.loadingDigital = true;
    this.loadingApp = true;
    this.loadingFeatured = true;
  
    // Game Blogs
    this.http.get<any>(`${environment.apiUrl}/admin/getAll_blog?category=game`).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data?.data) {
          this.gameBlogs = res.data.data;
        }
        this.loadingGame = false;
      },
      error: () => {
        this.loadingGame = false;
      },
    });
  
    // Web Blogs
    this.http.get<any>(`${environment.apiUrl}/admin/getAll_blog?category=web`).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data?.data) {
          this.web = res.data.data;
        }
        this.loadingWeb = false;
      },
      error: () => {
        this.loadingWeb = false;
      },
    });
  
    // Digital Marketing Blogs
    this.http.get<any>(`${environment.apiUrl}/admin/getAll_blog?category=digital-marketing`).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data?.data) {
          this.digitalM = res.data.data;
        }
        this.loadingDigital = false;
      },
      error: () => {
        this.loadingDigital = false;
      },
    });
  
    // App Blogs
    this.http.get<any>(`${environment.apiUrl}/admin/getAll_blog?category=app`).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data?.data) {
          this.App = res.data.data;
        }
        this.loadingApp = false;
      },
      error: () => {
        this.loadingApp = false;
      },
    });
  
    // Featured Blogs
    this.http.get<any>(`${environment.apiUrl}/admin/getAll_blog?isFeature=true`).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data?.data) {
          const featuredBlogs = res.data.data
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
  
          if (featuredBlogs.length > 0) {
            this.featured = featuredBlogs[0];
          }
          if (featuredBlogs.length > 1) {
            this.featured2 = featuredBlogs.slice(1);
          }
        }
        this.loadingFeatured = false;
      },
      error: () => {
        this.loadingFeatured = false;
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
    return heading.toLocaleLowerCase().replace(/ /g, '-');
  }

  cardText: string = `Find Out How We Solved <br class="hidden sm:block" /> Complex "IT" Challenge`;
}
