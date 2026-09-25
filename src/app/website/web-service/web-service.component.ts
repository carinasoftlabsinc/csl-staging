import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

@Component({
  selector: 'app-web-service',
  templateUrl: './web-service.component.html',
  styleUrls: ['./web-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class WebServiceComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Web Development Services | Carina Softlabs',
      description: 'Modern, responsive web development services by Carina Softlabs, including front-end, back-end, eCommerce, and enterprise web applications.',
      url: 'https://carinasoftlabs.com/web-development',
    });
  }

  // vision cards content
  viscards = [
    {
      imgSrc: 'assets/images/webIcon1.svg',
      heading: 'website',
      description:
        'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
    },
    {
      imgSrc: 'assets/images/webIcon2.svg',
      heading: 'Ecommerce',
      description:
        'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
    },
    {
      imgSrc: 'assets/images/webIcon3.svg',
      heading: 'Web Applications',
      description:
        'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
    },
    {
      imgSrc: 'assets/images/webIcon4.svg',
      heading: 'Content Management System',
      description:
        'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
    },
  ];

  solutions = [
    {
      imgSrc: 'assets/images/webIcon5.svg',
      heading: 'Frontend Development',
      description:
        'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
    },
    {
      imgSrc: 'assets/images/webIcon6.svg',
      heading: 'Backend Development',
      description:
        'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
    },
    {
      imgSrc: 'assets/images/webIcon7.svg',
      heading: 'Full Stack Development',
      description:
        'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
    },
    {
      imgSrc: 'assets/images/webIcon8.svg',
      heading: 'Low-Code Development',
      description:
        'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
    },
  ];
}
