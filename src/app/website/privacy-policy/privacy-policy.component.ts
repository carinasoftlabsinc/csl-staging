import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PrivacyPolicyComponent implements OnInit {

  cardText: string = `Your Privacy, Our Priority
Committed to Protecting Your Information.`;

  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Privacy Policy - Carina Softlabs Inc.',
      description: 'Read the Privacy Policy of Carina Softlabs Inc. to understand the rules and guidelines for using our website and services.',
      url: 'https://carinasoftlabs.com/privacy-policy',
    });
  }
}