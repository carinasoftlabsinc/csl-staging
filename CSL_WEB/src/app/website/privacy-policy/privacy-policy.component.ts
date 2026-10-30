import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, FooterComponent]
})
export class PrivacyPolicyComponent implements OnInit {

  cardText: string = `Your Privacy, Our Priority
Committed to Protecting Your Information.`;

  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Privacy Policy - Carina Softlabs Inc.',
      description: 'Read Carina Softlabs\' Privacy Policy to understand how we collect, use, protect, and handle your personal data when you visit our website or use our services.',
      url: 'https://carinasoftlabs.com/privacy-policy',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Privacy Policy | Carina Softlabs',
        'description': 'Read Carina Softlabs\' Privacy Policy to understand how we collect, use, protect, and handle your personal data when you visit our website or use our services.',
        'url': 'https://carinasoftlabs.com/privacy-policy',
        'publisher': {
          '@type': 'Organization',
          'name': 'Carina Softlabs Inc.',
          'url': 'https://carinasoftlabs.com/',
          'logo': 'https://carinasoftlabs.com/assets/logo.png'
        },
        'inLanguage': 'en-US'
      }
    });
  }
}