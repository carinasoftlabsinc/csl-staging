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
      title: 'Web Development Services | Custom Web Apps | Carina Softlabs',
      description: 'Custom web application development services, frontend and backend development, and scalable web development solutions for growing businesses.',
      url: 'https://carinasoftlabs.com/web-development',
      image: 'https://carinasoftlabs.com/assets/images/service-hero-web.png',
      imageAlt: 'Web development services by Carina Softlabs',
    });
  }

  // vision cards content
  viscards = [
    {
      imgSrc: 'assets/images/webIcon1.svg',
      heading: 'Websites',
      description:
        'We develop responsive, SEO-ready business websites that build trust, load fast, and turn visitors into leads.',
    },
    {
      imgSrc: 'assets/images/webIcon2.svg',
      heading: 'eCommerce',
      description:
        'We build online stores with secure payments, easy product management, and a smooth checkout that drives more sales.',
    },
    {
      imgSrc: 'assets/images/webIcon3.svg',
      heading: 'Web Applications',
      description:
        'Our web application development services create custom portals, dashboards, and SaaS platforms built around your business workflows.',
    },
    {
      imgSrc: 'assets/images/webIcon4.svg',
      heading: 'Content Management Systems',
      description:
        'We build easy-to-use CMS platforms, like WordPress or a custom CMS, so your team can update content without writing code.',
    },
  ];

  solutions = [
    {
      imgSrc: 'assets/images/webIcon5.svg',
      heading: 'Frontend Development',
      description:
        'Our frontend development services use React, Vue.js, Angular, and Next.js to build fast, interactive, and responsive interfaces your users will love.',
    },
    {
      imgSrc: 'assets/images/webIcon6.svg',
      heading: 'Backend Development',
      description:
        'Our backend development services use Python, Node.js, NestJS, PHP, and Supabase to build secure APIs, databases, and server logic that scale with your traffic.',
    },
    {
      imgSrc: 'assets/images/webIcon7.svg',
      heading: 'Full Stack Development',
      description:
        'We handle frontend and backend together through MEAN & MERN Stack, giving you one team, one process, and faster delivery from start to finish.',
    },
    {
      imgSrc: 'assets/images/webIcon8.svg',
      heading: 'Low-Code Development',
      description:
        'Need to launch quickly? We build on low-code platforms like Webflow and Mendix to save you time and cost without losing quality.',
    },
    {
      imgSrc: 'assets/images/webIcon9.svg',
      heading: 'Database Development',
      description:
        'Our database development services use MongoDB, MySQL, PostgreSQL, and Microsoft SQL Server to design, build, and manage secure, scalable, and high-performance databases for your applications.',
    },
    {
      imgSrc: 'assets/images/webIcon10.svg',
      heading: 'Infrastructure & DevOps',
      description:
        'Docker, AWS, GCP, Microsoft Azure, and CI/CD pipelines (GitHub Actions).',
    },
  ];
}
