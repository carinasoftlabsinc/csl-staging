import { Component, OnInit, OnDestroy, Inject, Renderer2, DOCUMENT, ChangeDetectionStrategy, inject } from '@angular/core';
import { SeoService } from '@core/service/seo.service';
import { Title, Meta } from '@angular/platform-browser';

import { FormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ContactService } from './contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/service/analytics.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ContactComponent implements OnInit, OnDestroy {
  rangeValue: number = 500;
  clientForm: UntypedFormGroup;
  submitted: boolean | undefined;
  loading: boolean = false;
  private seoElements: HTMLElement[] = [];
  // router: any;
  private readonly seoService = inject(SeoService);

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private fb: UntypedFormBuilder,
    private service: ContactService,
    private snackBar: MatSnackBar,
    private router: Router,
    private analyticsService: AnalyticsService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      budget: [500],
      service: ['', Validators.required],
      message: [''],
      termsAccepted: [false, Validators.requiredTrue] 
    });

  }

  countries: string[] = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo (Congo-Brazzaville)',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czechia',
    'Democratic Republic of the Congo',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar (formerly Burma)',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine State',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];
  
  
  ngOnInit(): void {
    this.titleService.setTitle(
      'Contact Us | Discuss Your Game, Tech & Marketing Project'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Have a project in mind? Contact our experts to discuss game development, digital marketing, web or app development, and turn your ideas into digital solutions.',
    });

    this.setCanonicalUrl('https://carinasoftlabs.com/contact-us');
    this.setOpenGraphTags();
    this.setSchemaMarkup();
  }

  ngOnDestroy(): void {
    this.seoElements.forEach((el) => {
      if (el.parentNode) {
        this.renderer.removeChild(el.parentNode, el);
      }
    });
    this.seoElements = [];
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector(
      "link[rel='canonical']"
    );
    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(this.document.head, link);
      this.seoElements.push(link as HTMLElement);
    }
    this.renderer.setAttribute(link, 'href', url);
  }

  private setOpenGraphTags(): void {
    const title = 'Contact Us | Start Your Digital Project Today';
    const description =
      'Have a project in mind? Contact our experts to discuss game development, digital marketing, web or app development and turn your ideas into digital solutions.';
    const url = 'https://carinasoftlabs.com/contact-us';
    const image = 'https://admin.carinasoftlabs.com/web/web/file/news/image-ee54656e-a5b3-4625-a61d-3b2fc28e2eea.png';

    this.seoService.setOg({ title, description, url, image });
  }

  private setSchemaMarkup(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': 'https://carinasoftlabs.com/contact-us#contactpage',
          url: 'https://carinasoftlabs.com/contact-us',
          name: 'Contact Us | Start Your Digital Project Today',
          description:
            'Have a project in mind? Contact our experts to discuss game development, digital marketing, web or app development and turn your ideas into digital solutions.',
          isPartOf: {
            '@id': 'https://carinasoftlabs.com/#website',
          },
          about: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
          mainEntity: {
            '@id': 'https://carinasoftlabs.com/#organization',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://carinasoftlabs.com/contact-us#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://carinasoftlabs.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Contact Us',
              item: 'https://carinasoftlabs.com/contact-us',
            },
          ],
        },
      ],
    };

    this.seoService.setJsonLd(schema);
  }

  private showSuccessMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      // panelClass: 'snackbar-success',
    });

    snackBarRef.afterDismissed().subscribe(() => {});
  }

  private showErrorMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      // panelClass: 'snackbar-danger',
    });

    snackBarRef.afterDismissed().subscribe(() => {
    });
  }

  onSave() {
    this.submitted = true;
    if (this.clientForm.invalid) {
      return;
    }
    this.loading = true;
    this.service
      .Add(
        this.clientForm.value.name,
        this.clientForm.value.email,
        this.clientForm.value.phone,
        this.clientForm.value.message,
        this.clientForm.value.address,
        this.clientForm.value.budget,
        this.clientForm.value.service
      )
      .subscribe({
        next: (response) => {
          this.loading = false; 
          this.submitted = false;
          // Paused while generate_lead is configured in GA4 to avoid duplicate leads.
          // this.analyticsService.trackGenerateLead({
          //   formName: 'Contact Us Page Form',
          //   category: 'lead_generation',
          // });
          this.clientForm.reset();
          this.showSuccessMessage('Data submitted successfully');
          this.router.navigate(['/thank-you']); // Use the Router to navigate
        },
        error: (error) => {
          // Handle error
          this.loading = false; // Stop showing spinner
          console.error(error);
          this.showErrorMessage(error.message);
        },
      });
  }

  cardText: string = `Got a Challenge ? <br class="hidden sm:block" /> Tell Us How We Can Help`;
}
