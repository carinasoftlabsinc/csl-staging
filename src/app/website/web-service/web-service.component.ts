import { Component } from '@angular/core';

@Component({
    selector: 'app-web-service',
    templateUrl: './web-service.component.html',
    styleUrls: ['./web-service.component.scss'],
    standalone: false
})
export class WebServiceComponent {
 // vision cards content
 viscards = [
  {
    imgSrc: 'assets/images/webIcon1.svg',
    heading:'website',
    description:
      'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
  },
  {
    imgSrc: 'assets/images/webIcon2.svg',
    heading:'Ecommerce',
    description:
    'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
},
  {
    imgSrc: 'assets/images/webIcon3.svg',
    heading:'Web Applications',
    description:
      'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
  },
  {
    imgSrc: 'assets/images/webIcon4.svg',
    heading:'Content Management System',
    description:
    'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
},
];

 solutions = [
  {
    imgSrc: 'assets/images/webIcon5.svg',
    heading:'Frontend Development',
    description:
      'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
  },
  {
    imgSrc: 'assets/images/webIcon6.svg',
    heading:'Backend Development',
    description:
      'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
  },
  {
    imgSrc: 'assets/images/webIcon7.svg',
    heading:'Full Stack Development',
    description:
      'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
  },
  {
    imgSrc: 'assets/images/webIcon8.svg',
    heading:'Low-Code Development',
    description:
      'A well-designed website is a powerful marketing and communication tool that helps build trust and generate leads.',
   },
];
}
