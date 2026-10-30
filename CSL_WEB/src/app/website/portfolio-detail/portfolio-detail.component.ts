import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { GetinformComponent } from '../components/getinform/getinform.component';
import { FooterComponent } from '../footer/footer.component';
import { SlicePipe } from '@angular/common';

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

@Component({
    selector: 'app-portfolio-detail',
    templateUrl: './portfolio-detail.component.html',
    styleUrls: ['./portfolio-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, RouterLink, GetinformComponent, FooterComponent, SlicePipe]
})
export class PortfolioDetailComponent {
  cardData: any;
  _id: any;
  allProjects: PortfolioItem[] = [];
  imageUrl = environment.imageBaseUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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

    // this.fetchAllNews();
  }

  // getFilterData(_id: string) {
  //   const apiUrl = `${environment.apiUrl}/admin/getAll_project`;

  //   this.http.get(apiUrl).subscribe(
  //     (data: any) => {
  //       if (data && data.data && data.data.data) {
  //         this.cardData = data.data.data.find(
  //           (item: any) => this.formatHeading(item.titleLink) === _id
  //         );
  //         this.allProjects = data.data.data
  //       } else {
  //         console.warn('No data found for id:', _id);
  //         this.cardData = null;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error while retrieving data:', error);
  //       this.cardData = null;
  //     }
  //   );
  // }

  getFilterData(_id: string) {
    const apiUrl = `${environment.apiUrl}/admin/getAll_project`;

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        if (data && data.data && data.data.data) {
          // Find the specific cardData
          this.cardData = data.data.data.find(
            (item: any) => this.formatHeading(item.titleLink) === _id
          );

          if (this.cardData) {
            // Filter all projects to include only those in the same category, excluding the current cardData
            this.allProjects = data.data.data.filter(
              (item: any) =>
                item.category === this.cardData.category &&
                item.titleLink !== this.cardData.titleLink
            );

            console.log('Filtered allProjects:', this.allProjects);
          } else {
            console.warn('No data found for id:', _id);
            this.cardData = null;
            this.allProjects = [];
          }
        } else {
          console.warn('Data structure is not as expected');
          this.cardData = null;
          this.allProjects = [];
        }
      },
      (error) => {
        console.error('Error while retrieving data:', error);
        this.cardData = null;
        this.allProjects = [];
      }
    );
  }

  formatHeading(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  devProcess = [
    {
      title: 'DESIGN',
      icon: '../../../assets/images/process-design.svg',
      description:
        'Graphic Design, Mock-up Testing, Visual Feedback, Progress and Loading',
    },
    {
      title: 'GRAPHICS',
      icon: '../../../assets/images/process-graphics.svg',
      description:
        'Animations and Graphics Integration, Admin Console Integration',
    },
    {
      title: 'DEVELOPMENT',
      icon: '../../../assets/images/process-development.svg',
      description:
        'Technical Documentation, Frontend Development, Backend Development',
    },
    {
      title: 'TESTING',
      icon: '../../../assets/images/process-testing.svg',
      description:
        'Concept Validation, First-click Testing, Usability Task Analysis, UAT',
    },
    {
      title: 'REVIEW',
      icon: '../../../assets/images/process-review.svg',
      description: 'Client Interview, Empathy Mapping, Market Analysis',
    },
  ];
}
