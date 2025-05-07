import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { id } from '@swimlane/ngx-charts';
import { Title, Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent {
  gameBlogs: any[] = []; 
  digitalM : any[] = [];
  App : any[] = [];
  web : any[] = [];
  loadingGame = true;
  loadingWeb = true;
  loadingDigital = true;
  loadingApp = true;
  loadingFeatured = true;
  
  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient
  ) {}

  imageUrl = environment.imageBaseUrl;

  ngOnInit(): void {
    this.titleService.setTitle(
      'Insights & Innovations: The Carina Softlabs Blog'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Welcome to the Carina Softlabs Blog, your go-to source for the latest insights and innovations in Game Development, Digital Marketing, Web and Mobile App Development, and Emerging Tech.',
    });
    this.fetchFeaturedBlogs();
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
