import { Component } from '@angular/core';

@Component({
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.scss'],
})
export class CaseStudiesComponent {
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
