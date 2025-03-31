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

  fetchFeaturedBlogs() {
    this.http
      .get<any>(`${environment.apiUrl}/admin/getAll_blog`)
      .subscribe((response) => {
        if (response.status === 'success' && response.data?.data) {
          const blogs = response.data.data;

          const gameBlogs = blogs
          .filter((blog: { category: string }) => blog.category === 'game');
          this.gameBlogs = gameBlogs;

          const digitalM = blogs
          .filter((blog: { category: string }) => blog.category === 'digital-marketing');
          this.digitalM = digitalM;

          const App = blogs
          .filter((blog: { category: string }) => blog.category === 'app');
          this.App = App;

          const web = blogs
          .filter((blog: { category: string }) => blog.category === 'web');
          this.web = web;


          // Filter, sort, and get latest 3 featured blogs
          const latestFeaturedBlogs = blogs
            .filter((blog: { isFeature: any }) => blog.isFeature) // Keep only featured blogs
            .sort(
              (
                a: { createdAt: string | number | Date },
                b: { createdAt: string | number | Date }
              ) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ) // Sort by date (latest first)
            .slice(0, 3); // Keep the latest 3 blogs

          // Assign to UI variables
          if (latestFeaturedBlogs.length > 0) {
            this.featured = latestFeaturedBlogs[0];
          }

          if (latestFeaturedBlogs.length > 1) {
            this.featured2 = latestFeaturedBlogs.slice(1);
          }

          
        }
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
