// import { Component } from '@angular/core';

// type Category =
//   | 'Game Development'
//   | 'App Development'
//   | 'Web Development'
//   | 'Digital Marketing';

// @Component({
//   selector: 'app-portfolio',
//   templateUrl: './portfolio.component.html',
//   styleUrls: ['./portfolio.component.scss'],
// })
// export class PortfolioComponent {
//   SrcWords: Category[] = [
//     'Game Development',
//     'App Development',
//     'Web Development',
//     'Digital Marketing',
//   ];

//   selectedCategory: Category = this.SrcWords[0];

//   cards: Record<
//     Category,
//     { title: string; description: string; imageUrl: string }[]
//   > = {
//     'Game Development': [
//       {
//         title: 'Game 1',
//         description: 'Details about Game 1',
//         imageUrl:
//           'https://i.pinimg.com/736x/47/7c/81/477c81739c52bc400d94f7f8616ad064.jpg',
//       },
//       {
//         title: 'Game 2',
//         description: 'Details about Game 2',
//         imageUrl:
//           'https://i.pinimg.com/736x/e6/53/d8/e653d8908d38c94ff4e73b89b71708be.jpg',
//       },
//       {
//         title: 'Game 2',
//         description: 'Details about Game 2',
//         imageUrl:
//           'https://i.pinimg.com/736x/60/91/61/60916180aeea84580dff77cdfe465157.jpg',
//       },
//       {
//         title: 'Game 2',
//         description: 'Details about Game 2',
//         imageUrl:
//           'https://i.pinimg.com/736x/b2/7e/0e/b27e0eb5a603f0e8243cf914c183fa28.jpg',
//       },
//       {
//         title: 'Game 2',
//         description: 'Details about Game 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/cf/6d/d2/cf6dd26af68709a7ddf21e6c70011013.jpg',
//       },
//       {
//         title: 'Game 6',
//         description: 'Details about Game 2',
//         imageUrl:
//           'https://i.pinimg.com/736x/3f/dc/57/3fdc57e7eaba9e1eca43f7d2f93e16b5.jpg',
//       },
//       {
//         title: 'Game 7',
//         description: 'Details about Game 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/15/1a/86/151a86127d672a53255441f5c875abb7.jpg',
//       },
//       {
//         title: 'Game 8',
//         description: 'Details about Game 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/09/2e/f2/092ef29d3926e79531fe91de38bf7951.jpg',
//       },
//     ],
//     'App Development': [
//       {
//         title: 'App 1',
//         description: 'Details about App 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/89/36/cf/8936cf96920712ae0549e81e5d67428c.jpg',
//       },
//       {
//         title: 'App 2',
//         description: 'Details about App 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/89/36/cf/8936cf96920712ae0549e81e5d67428c.jpg',
//       },
//       {
//         title: 'App 3',
//         description: 'Details about App 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/89/36/cf/8936cf96920712ae0549e81e5d67428c.jpg',
//       },
//       {
//         title: 'App 4',
//         description: 'Details about App 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/89/36/cf/8936cf96920712ae0549e81e5d67428c.jpg',
//       },
//       {
//         title: 'App 5',
//         description: 'Details about App 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/89/36/cf/8936cf96920712ae0549e81e5d67428c.jpg',
//       },
//       {
//         title: 'App 6',
//         description: 'Details about App 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/89/36/cf/8936cf96920712ae0549e81e5d67428c.jpg',
//       },
//       {
//         title: 'App 7',
//         description: 'Details about App 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/89/36/cf/8936cf96920712ae0549e81e5d67428c.jpg',
//       },
//       {
//         title: 'App 8',
//         description: 'Details about App 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/89/36/cf/8936cf96920712ae0549e81e5d67428c.jpg',
//       },
//     ],
//     'Web Development': [
//       {
//         title: 'Website 1',
//         description: 'Details about Website 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/1a/b3/8b/1ab38b4f2bb28d7ffc677b7a125600d8.jpg',
//       },
//       {
//         title: 'Website 2',
//         description: 'Details about Website 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/18/3d/21/183d215355178b3750ea949b69645595.jpg',
//       },
//       {
//         title: 'Website 1',
//         description: 'Details about Website 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/1a/b3/8b/1ab38b4f2bb28d7ffc677b7a125600d8.jpg',
//       },
//       {
//         title: 'Website 2',
//         description: 'Details about Website 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/18/3d/21/183d215355178b3750ea949b69645595.jpg',
//       },
//       {
//         title: 'Website 1',
//         description: 'Details about Website 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/1a/b3/8b/1ab38b4f2bb28d7ffc677b7a125600d8.jpg',
//       },
//       {
//         title: 'Website 2',
//         description: 'Details about Website 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/18/3d/21/183d215355178b3750ea949b69645595.jpg',
//       },
//       {
//         title: 'Website 1',
//         description: 'Details about Website 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/1a/b3/8b/1ab38b4f2bb28d7ffc677b7a125600d8.jpg',
//       },
//       {
//         title: 'Website 2',
//         description: 'Details about Website 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/18/3d/21/183d215355178b3750ea949b69645595.jpg',
//       },
//     ],
//     'Digital Marketing': [
//       {
//         title: 'Campaign 1',
//         description: 'Details about Campaign 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/6f/dd/3d/6fdd3d6ab5773461ea876d008fee593d.jpg',
//       },
//       {
//         title: 'Campaign 2',
//         description: 'Details about Campaign 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/cd/c1/ef/cdc1ef397a46564bb46d3d60926a6aec.jpg',
//       },
//       {
//         title: 'Campaign 1',
//         description: 'Details about Campaign 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/6f/dd/3d/6fdd3d6ab5773461ea876d008fee593d.jpg',
//       },
//       {
//         title: 'Campaign 2',
//         description: 'Details about Campaign 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/cd/c1/ef/cdc1ef397a46564bb46d3d60926a6aec.jpg',
//       },
//       {
//         title: 'Campaign 1',
//         description: 'Details about Campaign 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/6f/dd/3d/6fdd3d6ab5773461ea876d008fee593d.jpg',
//       },
//       {
//         title: 'Campaign 2',
//         description: 'Details about Campaign 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/cd/c1/ef/cdc1ef397a46564bb46d3d60926a6aec.jpg',
//       },
//       {
//         title: 'Campaign 1',
//         description: 'Details about Campaign 1',
//         imageUrl:
//           'https://i.pinimg.com/474x/6f/dd/3d/6fdd3d6ab5773461ea876d008fee593d.jpg',
//       },
//       {
//         title: 'Campaign 2',
//         description: 'Details about Campaign 2',
//         imageUrl:
//           'https://i.pinimg.com/474x/cd/c1/ef/cdc1ef397a46564bb46d3d60926a6aec.jpg',
//       },
//     ],
//   };

//   constructor() {}

//   ngOnInit(): void {}

//   // Method to set the selected category
//   selectCategory(category: Category): void {
//     this.selectedCategory = category;
//   }

//   cardText: string = `Find Out How We Solved <br class="hidden sm:block" /> Complex "IT" Challenge`;
// }

// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { map, tap } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';

// type Category =
//   | 'Game Development'
//   | 'App Development'
//   | 'Web Development'
//   | 'Digital Marketing';

// interface PortfolioItem {
//   title: string;
//   description: string;
//   image: string;
//   category: Category;
// }

// @Component({
//   selector: 'app-portfolio',
//   templateUrl: './portfolio.component.html',
//   styleUrls: ['./portfolio.component.scss'],
// })
// export class PortfolioComponent implements OnInit {
//   SrcWords: Category[] = [
//     'Game Development',
//     'App Development',
//     'Web Development',
//     'Digital Marketing',
//   ];
//   selectedCategory: Category = this.SrcWords[0];
//   portfolioItems$!: Observable<PortfolioItem[]>; // Observable for async pipe
//   filteredItems: PortfolioItem[] = [];
//   portfolioItems: PortfolioItem[] = [];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.portfolioItems$ = this.fetchPortfolioData();
//   }

//   // Fetch portfolio data from the API and return an Observable
//   fetchPortfolioData(): Observable<PortfolioItem[]> {
//     const apiUrl = `${environment.apiUrl}/admin/getAll_project`;

//     return this.http.get<PortfolioItem[]>(apiUrl).pipe(
//       map((data) =>
//         data.map((item) => ({
//           title: item.title,
//           description: item.description,
//           image: item.image || '',
//           category: this.mapCategory(item.category),
//         }))
//       ),
//       tap((items) => {
//         // Initially filter items based on the default selected category
//         this.portfolioItems = items;
//         this.filterItems();
//       })
//     );
//   }

//   // Map API category to display category
//   private mapCategory(category: string): Category {
//     switch (category.toLowerCase()) {
//       case 'game':
//         return 'Game Development';
//       case 'app':
//         return 'App Development';
//       case 'web':
//         return 'Web Development';
//       case 'digital marketing':
//         return 'Digital Marketing';
//       default:
//         throw new Error(`Unknown category: ${category}`);
//     }
//   }

//   // Filter items based on the selected category
//   filterItems(): void {
//     this.filteredItems = this.portfolioItems.filter(
//       (item) => item.category === this.selectedCategory
//     );
//   }

//   // Method to set the selected category and filter items
//   selectCategory(category: Category): void {
//     this.selectedCategory = category;
//     this.filterItems();
//   }

//   cardText: string = `Find Out How We Solved <br class="hidden sm:block" /> Complex "IT" Challenge`;
// }

import { ChangeDetectorRef, Component, OnInit, OnDestroy, Inject, Renderer2, DOCUMENT, ChangeDetectionStrategy, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

import { environment } from "../../../environments/environment"
import { formatHeading } from '@core/utils/slug.util';

type Category =
  | 'All Projects'
  | 'Game Development'
  | 'App Development'
  | 'Web Development'
  | 'Digital Marketing';

interface PortfolioItem {
  _id: string;
  title: string;
  titleLink: string;
  category: string;
  description: string;
  image: string;
  image_2: string;
  content: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    data: PortfolioItem[];
  };
}



@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PortfolioComponent implements OnInit, OnDestroy {
  SrcWords: Category[] = [
    'All Projects',
    'Game Development',
    'App Development',
    'Web Development',
    'Digital Marketing',
  ];
  selectedCategory: Category = 'All Projects';
  allCards: PortfolioItem[] = [];
  cards: PortfolioItem[] = [];
  apiUrl = `${environment.apiUrl}/admin/getAll_project`;
  imageUrl = `${environment.imageBaseUrl}`;
  loading: boolean | undefined;
  private seoElements: HTMLElement[] = [];

  private readonly seoService = inject(SeoService);

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(
      'Portfolio | Game, Web, App & Digital Marketing Projects'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Explore our portfolio of game, web, mobile app, and digital marketing projects, showcasing creative solutions, technical expertise, and positive feedback.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/portfolio');
    this.setOpenGraphTags();
    this.setSchemaMarkup();

    this.fetchPortfolioItems();
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
    const title = 'Portfolio | Game, Web, App & Digital Marketing Projects';
    const description =
      'Explore our portfolio of game, web, mobile app and digital marketing projects, showcasing creative solutions, technical expertise and successful digital experiences.';
    const url = 'https://carinasoftlabs.com/portfolio';
    const image = 'https://carinasoftlabs.com/assets/images/og/og-portfolio.jpg';

    this.seoService.setOg({ title, description, url, image });
  }

  private setSchemaMarkup(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://carinasoftlabs.com/portfolio#webpage',
          url: 'https://carinasoftlabs.com/portfolio',
          name: 'Portfolio | Game, Web, App & Digital Marketing Projects',
          description:
            'Explore our portfolio of game, web, mobile app and digital marketing projects, showcasing creative solutions, technical expertise and successful digital experiences.',
          isPartOf: {
            '@id': 'https://carinasoftlabs.com/#website',
          },
          about: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://carinasoftlabs.com/portfolio#breadcrumb',
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
              name: 'Portfolio',
              item: 'https://carinasoftlabs.com/portfolio',
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

  // fetchPortfolioItems(category: Category): void {
  //   const categoryParam = this.mapCategoryToApiParam(category);
  //   this.http.get<PortfolioItem[]>(`${this.apiUrl}${categoryParam}`).subscribe({
  //     next: (data) => {
  //       console.log(data.data.data, 'hey');
  //       this.cards = data.data.data.map((item) => ({
  //         title: item.title,
  //         description: item.description,
  //         image: item.image || '',
  //         category: item.category,
  //       }));
  //     },
  //     error: (error) => {
  //       console.error('Error fetching portfolio data:', error);
  //     },
  //   });
  // }

  // fetchPortfolioItems(category: Category): void {
  //   const categoryParam = this.mapCategoryToApiParam(category);
  //   this.http.get<ApiResponse>(`${this.apiUrl}${categoryParam}`).subscribe({
  //     next: (response) => {
  //       console.log(response.data.data, 'hey');
  //       this.cards = response.data.data.map((item) => ({
  //         title: item.title,
  //         description: item.description,
  //         image: item.image || '',
  //         category: item.category,
  //       }));
  //     },
  //     error: (error) => {
  //       console.error('Error fetching portfolio data:', error);
  //     },
  //   });
  // }
  imagesLoadedCount = 0;
  totalImages = 0;
    fetchPortfolioItems(): void {
      this.loading = true;
      this.imagesLoadedCount = 0;

      this.http.get<ApiResponse>(`${this.apiUrl}?fields=_id,title,titleLink,category,description,image,image_2,projectLogo`).subscribe({
        next: (response) => {
          this.allCards = (response?.data?.data || []).map((item) => ({
            _id: item._id,
            title: item.title,
            titleLink: item.titleLink,
            category: item.category,
            description: item.description,
            image: item.image || '',
            image_2: item.image_2 || '',
            content: item.content || '',
          }));
          this.applySelectedCategory();
          this.loading = false;
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching portfolio data:', error);
          this.loading = false;
          this.changeDetector.detectChanges();
        },
      });
    }
  
  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.applySelectedCategory();
  }

  private applySelectedCategory(): void {
    const categoryParam = this.mapCategoryToApiParam(this.selectedCategory);
    this.cards = categoryParam
      ? this.allCards.filter((project) => project.category === categoryParam)
      : [...this.allCards];
  }

  mapCategoryToApiParam(category: Category): string {
    // Map category names to API parameters
    switch (category) {
      case 'All Projects':
        return '';
      case 'Game Development':
        return 'game';
      case 'App Development':
        return 'app';
      case 'Web Development':
        return 'web';
      case 'Digital Marketing':
        return 'digital-marketing';
      default:
        return '';
    }
  }

  formatHeading(title: string): string {
    return formatHeading(title);
  }

 

  cardText: string = `Find Out How We Solved <br class="hidden sm:block" /> Complex "IT" Challenge`;
}
