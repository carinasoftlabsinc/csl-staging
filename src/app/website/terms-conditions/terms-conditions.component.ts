import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';

@Component({
    selector: 'app-terms-conditions',
    templateUrl: './terms-conditions.component.html',
    styleUrls: ['./terms-conditions.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TermsConditionsComponent implements OnInit {

  cardText: string = `Partner with Clarity
Understand Our Terms Before We Begin.`;

  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Terms & Conditions - Carina Softlabs Inc.',
      description: 'Read the Terms and Conditions of Carina Softlabs Inc. to understand the rules and guidelines for using our website and services.',
      url: 'https://carinasoftlabs.com/terms-conditions',
    });
  }
}