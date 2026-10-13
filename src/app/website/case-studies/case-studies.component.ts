import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '@core/service/seo.service';
import { matchesSlug, formatHeading } from '@core/utils/slug.util';
import { timeout } from 'rxjs';

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
    { image: 'assets/case-goal-1.png', alt: '', text: 'Understand the vision.' },
    { image: 'assets/case-goal-2.png', alt: '', text: 'Design a clear experience.' },
    { image: 'assets/case-goal-3.png', alt: '', text: 'Deliver reliable results.' },
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private seoService: SeoService,
    private cdr: ChangeDetectorRef
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
    const apiUrl = `${environment.apiUrl}/admin/getAll_project?fields=_id,title,titleLink,category,description,image,image_2,projectLogo`;
    this.loading = true;
    this.http.get(apiUrl).pipe(timeout(10000)).subscribe({
      next: (data: any) => {
        if (data && data.data && data.data.data) {
          this.loading = false;

          const summary = data.data.data.find(
            (item: any) => matchesSlug(item, _id)
          );

          this.allProjects = data.data.data;
          if (summary?._id) {
            this.allProjects = data.data.data.filter(
              (item: any) =>
                item.category === summary.category && item.titleLink !== summary.titleLink
            );
            this.http.get(`${environment.apiUrl}/admin/get_/${summary._id}`).subscribe({
              next: (detail: any) => {
                this.cardData = detail?.data?.data;
                if (!this.cardData) {
                  this.isNotFound = true;
                  this.seoService.setNotFoundStatus();
                  return;
                }
            this.isNotFound = false;

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
              imageAlt: this.cardData.title,
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
            this.cdr.detectChanges();
              },
              error: (error) => {
                console.error('Error fetching portfolio detail:', error);
                this.isNotFound = true;
                this.seoService.setNotFoundStatus();
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
