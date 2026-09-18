import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '@core/service/seo.service';
import { matchesSlug, formatHeading } from '@core/utils/slug.util';

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
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CaseStudiesComponent implements OnInit {
  cardData: any;
  _id: any;
  allProjects: PortfolioItem[] = [];
  imageUrl = environment.imageBaseUrl;
  loading = true;
  isNotFound = false;
  caseGoals = [
    { image: 'assets/case-goal-1.png', alt: 'Goal 1', text: 'Lorem ipsum dolor sit amet.' },
    { image: 'assets/case-goal-2.png', alt: 'Goal 2', text: 'Lorem ipsum dolor sit amet.' },
    { image: 'assets/case-goal-3.png', alt: 'Goal 3', text: 'Lorem ipsum dolor sit amet.' },
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private seoService: SeoService
  ) {}

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
  }

  getFilterData(_id: string) {
    const apiUrl = `${environment.apiUrl}/admin/getAll_project`;
    this.loading = true;
    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        if (data && data.data && data.data.data) {
          this.loading = false;

          this.cardData = data.data.data.find(
            (item: any) => matchesSlug(item, _id)
          );

          if (this.cardData) {
            this.isNotFound = false;
            this.allProjects = data.data.data.filter(
              (item: any) =>
                item.category === this.cardData.category &&
                item.titleLink !== this.cardData.titleLink
            );

            if (this.cardData.workSteps) {
              const icons = [
                'assets/images/process-design.svg',
                'assets/images/process-graphics.svg',
                'assets/images/process-development.svg',
                'assets/images/process-testing.svg',
                'assets/images/process-review.svg',
              ];

              this.cardData.workSteps = this.cardData.workSteps.map(
                (step: any, index: number) => ({
                  ...step,
                  icon: icons[index] ?? 'assets/images/default-icon.svg',
                })
              );
            }

            const canonicalSlug = this.formatHeading(this.cardData.titleLink || this.cardData.title);
            this.seoService.setPage({
              title: `${this.cardData.title} | Case Study | Carina Softlabs`,
              description:
                this.cardData.description ||
                'Explore our project case studies and engineering portfolio at Carina Softlabs.',
              url: `https://carinasoftlabs.com/portfolio/${canonicalSlug}`,
              image: this.cardData.image
                ? `${environment.imageBaseUrl}${this.cardData.image}`
                : undefined,
              type: 'article',
              jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                headline: this.cardData.title,
                description: this.cardData.description,
                image: this.cardData.image
                  ? `${environment.imageBaseUrl}${this.cardData.image}`
                  : undefined,
              },
            });
          } else {
            console.warn('No data found for id:', _id);
            this.isNotFound = true;
            this.seoService.setNotFoundStatus();
            this.cardData = null;
            this.allProjects = [];
          }
        } else {
          this.isNotFound = true;
          this.seoService.setNotFoundStatus();
          this.cardData = null;
          this.allProjects = [];
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error while retrieving data:', error);
        this.isNotFound = true;
        this.seoService.setNotFoundStatus();
        this.cardData = null;
        this.allProjects = [];
      },
    });
  }

  formatHeading(title: string): string {
    return formatHeading(title);
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/job-fallback.png';
  }

  icons = [
    '../../../assets/images/process-design.svg',
    '../../../assets/images/process-graphics.svg',
    '../../../assets/images/process-development.svg',
    '../../../assets/images/process-testing.svg',
    '../../../assets/images/process-review.svg',
  ];
}
