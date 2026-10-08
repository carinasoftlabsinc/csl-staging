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
        'We use the most popular frontend frameworks like React.js, Vue.js, and Angular that enable us to create the surface layer of your product.',
    },
    {
      imgSrc: 'assets/images/webIcon6.svg',
      heading: 'Backend Development',
      description:
        'We use server-side technologies like Python, Ruby on Rails, and Node.js for prototyping and development, producing fast and scalable web apps.',
    },
    {
      imgSrc: 'assets/images/webIcon7.svg',
      heading: 'Full Stack Development',
      description:
        'We deliver end-to-end web development, combining frontend and backend solutions and other technologies necessary to make your product a success.',
    },
    {
      imgSrc: 'assets/images/webIcon8.svg',
      heading: 'Low-Code Development',
      description:
        'We also specialize in building no-code and low-code web solutions that allow clients to save time and money. We use platforms like Webflow or Mendix.',
    },
  ];
}
