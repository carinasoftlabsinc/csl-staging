import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

@Component({
  selector: 'app-digital-service',
  templateUrl: './digital-service.component.html',
  styleUrls: ['./digital-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class DigitalServiceComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Digital Marketing Services | Carina Softlabs',
      description: 'Scale your brand with data-driven digital marketing services from Carina Softlabs: SEO, email marketing, social media, and performance ads.',
      url: 'https://carinasoftlabs.com/digital-marketing',
    });
  }

  cases = [
    {
      image: 'assets/images/dm-case-seo-performance.webp',
      title: 'Search Engine Optimization',
      description:
        'Rank higher and win qualified organic traffic. We combine technical SEO, content strategy and link building to grow visibility for the keywords that bring customers.',
      liveDemo: 'https://carinasoftlabs.com/contact-us',
      diviLink: 'https://carinasoftlabs.com/contact-us',
    },
    {
      image: 'assets/images/dm-case-social-campaign.webp',
      title: 'Social Media Marketing',
      description:
        'Build a brand people follow and talk about. Content calendars, creative and community management that turn reach into engagement and new followers.',
      liveDemo: 'https://carinasoftlabs.com/contact-us',
      diviLink: 'https://carinasoftlabs.com/contact-us',
    },
    {
      image: 'assets/images/dm-case-email-campaign.webp',
      title: 'Email Marketing',
      description:
        'Turn subscribers into customers with targeted campaigns and automation. Segmented journeys, high-converting design and clear reporting on opens, clicks and revenue.',
      liveDemo: 'https://carinasoftlabs.com/contact-us',
      diviLink: 'https://carinasoftlabs.com/contact-us',
    },
    {
      image: 'assets/images/dm-case-performance-ads.webp',
      title: 'Performance Advertising',
      description:
        'Pay-per-click campaigns across Google, Meta and LinkedIn built around return on ad spend, with continuous testing to lower cost per lead.',
      liveDemo: 'https://carinasoftlabs.com/contact-us',
      diviLink: 'https://carinasoftlabs.com/contact-us',
    },
    {
      image: 'assets/images/dm-case-ecommerce-growth.webp',
      title: 'E-Commerce Marketing',
      description:
        'Grow your online store with product-led campaigns, conversion optimization and retention flows that lift average order value and repeat purchases.',
      liveDemo: 'https://carinasoftlabs.com/contact-us',
      diviLink: 'https://carinasoftlabs.com/contact-us',
    },
    {
      image: 'assets/images/dm-case-marketing-analytics.webp',
      title: 'Marketing Analytics',
      description:
        'See what really drives revenue. Unified dashboards across channels, attribution and audience insights so every decision is backed by data.',
      liveDemo: 'https://carinasoftlabs.com/contact-us',
      diviLink: 'https://carinasoftlabs.com/contact-us',
    },
  ].map((c) => ({
    ...c,
    // Smaller copies of each photo: 640px for phones and 420px for the thumbnails.
    imageSm: c.image.replace('.webp', '-640.webp'),
    imageMd: c.image.replace('.webp', '-960.webp'),
    thumb: c.image.replace('.webp', '-thumb.webp'),
  }));

  selectedCard = this.cases[0];

  // Method to update selected card
  selectCard(card: any) {
    this.selectedCard = card;
  }

  numCards = [
    {
      bgColor: 'bg-[#B1DF4F]',
      textColor: 'text-[#0B0C10]',
      paraColor: 'text-[#34394B]',
      num: '01',
      heading: 'Search Engine <br> Optimization (SEO)',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/f0/ae/58/f0ae58f4e6832b494a7c379c93c824ea.jpg',
    },
    {
      bgColor: 'bg-[#BC8AFB]',
      textColor: 'text-[#0B0C10]',
      paraColor: 'text-[#34394B]',
      num: '02',
      heading: 'Email <br> Marketing',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/53/e8/1a/53e81ad378d5ebd78e3bdc7326f9a63f.jpg',
    },
    {
      bgColor: 'bg-[#FB8ACE]',
      textColor: 'text-white',
      paraColor: 'text-white',
      num: '03',
      heading: 'E-Commerce <br> Marketing <br> (Like Amazon)',
      para: 'At Carina Softlabs Inc., we serve as your comprehensive destination for all your business requirements. Our extensive',
      hovImg:
        'https://i.pinimg.com/474x/59/17/b7/5917b7e17018b540969dc28b5dc5373d.jpg',
    },
  ];

  FourW = [
    { icon: '../../../assets/images/DGclientLogo2.svg', digits: '$685', desc: 'M', small: false, para: 'in Revenue Generated for Our Clients' },
    { icon: '../../../assets/images/DGclientLogo3.svg', digits: '2000', desc: '+', small: false, para: 'Clients Served' },
    { icon: '../../../assets/images/DGclientLogo4.svg', digits: '93%', desc: 'Retention', small: true, para: 'Rate Our Partners Love Us' },
    { icon: '../../../assets/images/DGclientLogo5.svg', digits: '28%', desc: 'Avg.', small: true, para: 'Increase in Website Traffic' },
  ];

  // Solution by Data Source tiles, in Figma order. "tile" logos are drawn on the full 312 x 140 tile;
  // "icon" logos are centred, sized in cqw (1% of the tile width). The last tile is an empty placeholder as in the design.
  dataSources: { name: string; tile?: string; icon?: string; size?: string; label?: string; text?: string }[] = [
    { name: 'Salesforce', tile: 'salesforce' },
    { name: 'Excel', icon: 'excel', size: 'h-[20.2cqw] w-auto', label: 'Excel' },
    { name: 'Google Analytics', icon: 'google-analytics', size: 'h-[20.2cqw] w-auto', label: 'Google Analytics' },
    { name: 'Box', icon: 'box', size: 'w-[34.9cqw] h-auto' },
    { name: 'MySQL', tile: 'mysql' },
    { name: 'QuickBooks', tile: 'quickbooks' },
    { name: 'X', tile: 'x' },
    { name: 'Google Docs', icon: 'google-docs', size: 'h-[23.8cqw] w-auto' },
    { name: 'Facebook', tile: 'facebook' },
    { name: 'JSON', text: 'JSON' },
    { name: 'HubSpot', tile: 'hubspot' },
    { name: '' },
  ];
}
