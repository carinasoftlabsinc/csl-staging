import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-digital-service',
    templateUrl: './digital-service.component.html',
    styleUrls: ['./digital-service.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DigitalServiceComponent {

  cases = [
    {
      image: 'https://images.unsplash.com/photo-1739475981073-ee12bff8ba10?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Web page 1',
      description: 'Our employees are at the heart of our company. Here’s what they have to say about working at Mixmax. Our employees are at the heart of our company. Here’s what they have to say about working at Mixmax. Our employees are at the heart of our company. Here’s what they have to say about working at Mixmax. Our employees are at the heart of our company. Here’s what they have to say about working at Mixmax. Our employees are at the heart of our company. Here’s what they have to say about working at Mixmax.',
      liveDemo: 'https://example.com/demo1',
      diviLink: 'https://example.com/divi1',
    },
    {
      image: 'https://images.unsplash.com/photo-1739475981073-ee12bff8ba10?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Web page 2',
      description: 'Description for card 2.',
      liveDemo: 'https://example.com/demo2',
      diviLink: 'https://example.com/divi2',
    },
    {
      image: 'https://images.unsplash.com/photo-1736821481668-2cb07ceed73b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Web page 3',
      description: 'Description for card 3.',
      liveDemo: 'https://example.com/demo3',
      diviLink: 'https://example.com/divi3',
    },
    {
      image: 'https://images.unsplash.com/photo-1736821481668-2cb07ceed73b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Web page 4',
      description: 'Description for card 3.',
      liveDemo: 'https://example.com/demo3',
      diviLink: 'https://example.com/divi3',
    },
    {
      image: 'https://images.unsplash.com/photo-1736821481668-2cb07ceed73b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Web page 5',
      description: 'Description for card 3.',
      liveDemo: 'https://example.com/demo3',
      diviLink: 'https://example.com/divi3',
    },
    {
      image: 'https://images.unsplash.com/photo-1736821481668-2cb07ceed73b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Web page 6',
      description: 'Description for card 3.',
      liveDemo: 'https://example.com/demo3',
      diviLink: 'https://example.com/divi3',
    },
  ];

  selectedCard = this.cases[0];

  // Method to update selected card
  selectCard(card: any) {
    this.selectedCard = card;
  }

  numCards = [
    {
      bgColor: 'bg-[#B1DF4F]',
      num: '01',
      heading: 'Search Engine Optimization',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/f0/ae/58/f0ae58f4e6832b494a7c379c93c824ea.jpg',
    },
    {
      bgColor: 'bg-[#BC8AFB]',
      num: '02',
      heading: 'Email <br> Marketing',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/53/e8/1a/53e81ad378d5ebd78e3bdc7326f9a63f.jpg',
    },
    {
      bgColor: 'bg-[#FB8ACE]',
      num: '03',
      heading: 'E-Commerce Marketing',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/59/17/b7/5917b7e17018b540969dc28b5dc5373d.jpg',
    },
  ];

  FourW = [
    {
      icon: '../../../assets/images/DGclientLogo2.svg',
      digits: '$685 M',
      desc: '',
      para:
        "in Revenue Generated for Our Clients",
    },
    {
      icon: '../../../assets/images/DGclientLogo3.svg',
      digits: '2000 +',
      desc: '',
      para:
        "Clients Served",
    },
    {
      icon: '../../../assets/images/DGclientLogo4.svg',
      digits: '93%',
      desc: 'RETENTION',
      para:
        "Rate Our Partners Love Us For Our Work",
    },
    {
      icon: '../../../assets/images/DGclientLogo5.svg',
      digits: '28%',
      desc: 'AVG.',
      para:
        "Increase in Website Traffic",
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
