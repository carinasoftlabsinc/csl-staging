import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

@Component({
  selector: 'app-game-service',
  templateUrl: './game-service.component.html',
  styleUrls: ['./game-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class GameServiceComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Game Development Services | Carina Softlabs',
      description: 'Explore game development services by Carina Softlabs: concept art, 2D/3D assets creation, animation, and multiplatform game design.',
      url: 'https://carinasoftlabs.com/game-development',
    });
  }

  clients = [
    { heading: 'TOTAL CLIENTS', number: 10 },
    { heading: 'TOTAL CLIENTS', number: 50 },
    { heading: 'TOTAL CLIENTS', number: 120 },
  ];

  SrcWords = [
    {
      word: 'GAME DEVELOPMENT',
      color: '#',
    },
    {
      word: 'GAME DESIGN',
      color: '#FF5722',
    },
    {
      word: 'MULTIPLATFORM DEVELOPMENT',
      color: '#00BCD4',
    },
  ];

  processList = [
    {
      head: 'Game Development Document',
      marker: 'text-[#B1DF4F]',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Concept Art',
      marker: 'text-[#BC8AFB]',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Assets Creation',
      marker: 'text-[#FB8ACE]',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Assets Creation',
      marker: 'text-[#FB8ACE]',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      head: 'Game Assets Creation',
      marker: 'text-[#FB8ACE]',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
    {
      line: 'hidden',
      head: 'Animation  ',
      marker: 'text-[#8AE0FB]',
      desc: 'We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics,We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics',
    },
  ];

  techStack = [
    { imgSrc: '../../assets/images/logo1st.png', w: '150' },
    { imgSrc: '../../assets/images/logo-2.png', w: '150' },
    { imgSrc: '../../assets/images/meen.png', w: '160' },
    { imgSrc: '../../assets/images/logo-4.png', w: '150' },
    { imgSrc: '../../assets/images/logo-3.png', w: '150' },
    { imgSrc: '../../assets/images/mean.png', w: '160' },
    { imgSrc: '../../assets/images/logo-7.png', w: '150' },
    { imgSrc: '../../assets/images/logo-8.png', w: '150' },
    { imgSrc: '../../assets/images/logo-9.png', w: '150' },
    { imgSrc: '../../assets/images/logo-10.png', w: '150' },
    { imgSrc: '../../assets/images/logo-11.png', w: '150' },
    { imgSrc: '../../assets/images/logo-12.png', w: '150' },
  ];
}
