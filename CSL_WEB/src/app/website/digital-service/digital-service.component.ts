import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ServiceHeroComponent } from '../components/service-hero/service-hero.component';
import { GradientButtonComponent } from '../components/gradient-button/gradient-button.component';
import { RouterLink } from '@angular/router';
import { QuoteSectionComponent } from '../components/quote-section/quote-section.component';

@Component({
  selector: 'app-digital-service',
  templateUrl: './digital-service.component.html',
  styleUrls: ['./digital-service.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgTemplateOutlet, FooterComponent, ServiceHeroComponent, NgClass, GradientButtonComponent, RouterLink, QuoteSectionComponent]
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

  readonly growthSteps = [
    {
      number: 1,
      color: 'green',
      title: 'Get Found on Search',
      description: 'Drive consistent organic traffic by combining technical SEO, advanced on-page optimization, AI search visibility (GEO), and high-authority link building to rank higher where your customers are looking.',
    },
    {
      number: 2,
      color: 'purple',
      title: 'Reach the Right Audience',
      description: 'Capture high-intent buyers instantly with precision-targeted paid search and social ad campaigns across Google, Meta, YouTube, and LinkedIn.',
    },
    {
      number: 3,
      color: 'pink',
      title: 'Build Trust with Content',
      description: 'Position your brand as an industry authority through strategic blogs, comprehensive guides, and compelling content that answer your audience’s core questions.',
    },
    {
      number: 4,
      color: 'green',
      title: 'Turn Visitors into Customers',
      description: 'Maximize conversion rates and streamline user journeys through optimized landing pages, strategic CTAs, and frictionless checkout flows.',
    },
    {
      number: 5,
      color: 'purple',
      title: 'Engage & Retain',
      description: 'Maximize customer lifetime value with automated email marketing workflows, intelligent remarketing, and active community engagement.',
    },
    {
      number: 6,
      color: 'pink',
      title: 'Measure & Scale',
      description: 'Track performance with rigorous analytics and transparent reporting, continuously refining and scaling what drives the highest ROI month over month.',
    },
  ];

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

  // Cards cycle through the three brand colours (green, purple, pink).
  private static readonly cardColors = [
    { bgColor: 'bg-[#B1DF4F]', textColor: 'text-[#0B0C10]', paraColor: 'text-[#34394B]' },
    { bgColor: 'bg-[#BC8AFB]', textColor: 'text-[#0B0C10]', paraColor: 'text-[#34394B]' },
    { bgColor: 'bg-[#FB8ACE]', textColor: 'text-white', paraColor: 'text-white' },
  ];

  numCards = [
    {
      heading: 'Search Engine <br> Optimization',
      hovImg: 'assets/images/dm-case-seo-performance-thumb.webp',
      hovAlt: 'SEO services results dashboard',
      para: 'Build organic traffic that converts by combining technical SEO, high-value content, strategic link building, and AI search optimization for maximum visibility on Google and LLMs.',
    },
    {
      heading: 'Email <br> Marketing',
      hovImg: 'assets/images/dm-case-email-campaign-thumb.webp',
      hovAlt: 'Email marketing campaign preview',
      para: 'Turn subscribers into loyal customers through personalized campaigns, automated workflows, and targeted lead-nurturing sequences designed to drive repeat sales.',
    },
    {
      heading: 'E-Commerce <br> Marketing',
      hovImg: 'assets/images/dm-case-ecommerce-growth-thumb.webp',
      hovAlt: 'E-commerce marketing growth chart',
      para: 'Accelerate store growth on Amazon, Shopify, and other marketplaces with conversion-optimized listings, high-ROI sponsored ads, and remarketing strategies that bring shoppers back to buy.',
    },
    {
      heading: 'Content <br> Marketing',
      hovImg: 'assets/images/dm-case-seo-performance-thumb.webp',
      hovAlt: 'Content marketing performance overview',
      para: 'Establish brand authority and organic visibility through strategic blogs, guides, and videos that answer your customers’ core questions and amplify your SEO performance.',
    },
    {
      heading: 'Performance <br> Marketing',
      hovImg: 'assets/images/dm-case-performance-ads-thumb.webp',
      hovAlt: 'Performance marketing ad campaign results',
      para: 'Drive predictable revenue through high-converting paid search and display campaigns across Google, Meta, and YouTube, focusing strictly on scalable, ROI-driven results.',
    },
    {
      heading: 'Social Media <br> Marketing',
      hovImg: 'assets/images/dm-case-social-campaign-thumb.webp',
      hovAlt: 'Social media marketing campaign preview',
      para: 'Build active, engaged communities across Instagram, Facebook, and LinkedIn with compelling storytelling, thumb-stopping creative content, and precise audience targeting.',
    },
    {
      heading: 'Lead <br> Generation',
      hovImg: 'assets/images/dm-case-marketing-analytics-thumb.webp',
      hovAlt: 'Lead generation analytics dashboard',
      para: 'Fill your sales pipeline with high-intent prospects using conversion-focused landing pages, strategic outbound funnels, and precision-targeted ad campaigns.',
    },
  ].map((card, i) => ({
    ...card,
    ...DigitalServiceComponent.cardColors[i % 3],
    num: String(i + 1).padStart(2, '0'),
  }));

  FourW = [
    { icon: '../../../assets/images/DGclientLogo2.svg', alt: 'Revenue generated icon', digits: '$28.5', desc: 'M', small: false, para: 'Revenue Generated for Clients' },
    { icon: '../../../assets/images/DGclientLogo3.svg', alt: 'Client brands served icon', digits: '432', desc: '+', small: false, para: 'Client Brands Served Globally' },
    { icon: '../../../assets/images/DGclientLogo4.svg', alt: 'Retention rate icon', digits: '93%', desc: 'Retention', small: true, para: 'Client Retention Rate' },
    { icon: '../../../assets/images/DGclientLogo5.svg', alt: 'Organic traffic growth icon', digits: '36%', desc: 'Avg.', small: true, para: 'Average Organic Traffic Growth' },
  ];

  // Tool tiles. "icon" logos are centred, sized in cqw (1% of the tile width); tools without a logo file show their name.
  dataSources: { name: string; logo?: string; square?: boolean; tile?: string; icon?: string; size?: string; label?: string; text?: string }[] = [
    { name: 'Meta Ads', logo: 'Meta_Platforms_Inc.svg' },
    { name: 'Google Ads', logo: 'google_ads.svg' },
    { name: 'Google Analytics', logo: 'Logo_Google_Analytic.svg' },
    { name: 'Claude', logo: 'claude.svg', square: true },
    { name: 'Ahrefs', logo: 'ahrefs.svg' },
    { name: 'Semrush', logo: 'semrush.svg' },
    { name: 'Moz', logo: 'Moz.svg' },
    { name: 'YouTube', logo: 'youtube.svg' },
    { name: 'AdMob', logo: 'google_admob.svg', square: true },
    { name: 'Google Search Console', logo: 'google_search_console.svg', square: true },
    { name: 'Canva', logo: 'canva.svg', square: true },
    { name: 'OpenAI Ads', logo: 'chatgpt.svg', square: true },
  ];

  scrollToSection(event: MouseEvent, id: string): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  }
}
