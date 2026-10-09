import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContactService } from 'app/website/contact/contact.service';

@Component({
  selector: 'app-quote-section',
  templateUrl: './quote-section.component.html',
  // Two colour themes driven by CSS variables. The form dropdowns read the same variables,
  // and autofilled fields keep the theme colours instead of the browser's blue/grey fill.
  styles: [
    `
      .quote-dark {
        --q-bg: #0b0c10;
        --q-heading: #ffffff;
        --q-text: #b4b9cb;
        --q-rule: #34394b;
        --q-line: #424b65;
        --q-field-bg: #b4b9cb1a;
        --q-muted: #6b7189;
        --q-link: #ffffff;
        --q-send-bg: #34394b;
        --q-send-hover: #424b65;
        --q-panel: #16181f;
        --q-panel-hover: #23262f;
        --q-panel-active: #ffffff;
        --q-panel-shadow: rgba(0, 0, 0, 0.5);
        --q-panel-border: #34394b;
        --q-sel-bg: rgba(188, 138, 251, 0.18);
        --q-sel-text: #bc8afb;
      }
      .quote-light {
        --q-bg: #ffffff;
        --q-heading: #0b0c10;
        --q-text: #34394b;
        --q-rule: #b4b9cb;
        --q-line: #b4b9cb;
        --q-field-bg: #f4f5f7;
        --q-muted: #8a90a8;
        --q-link: #0b0c10;
        --q-send-bg: #34394b;
        --q-send-hover: #0b0c10;
        --q-panel: color-mix(in srgb, #b4b9cb 18%, #ffffff);
        --q-panel-hover: color-mix(in srgb, #b4b9cb 40%, #ffffff);
        --q-panel-active: #0b0c10;
        --q-panel-shadow: rgba(11, 12, 16, 0.12);
        --q-panel-border: #b4b9cb;
        --q-sel-bg: color-mix(in srgb, #bc8afb 30%, #ffffff);
        --q-sel-text: #0b0c10;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-text-fill-color: var(--q-text);
        caret-color: var(--q-text);
        -webkit-box-shadow: 0 0 0 1000px var(--q-bg) inset;
        transition: background-color 9999s ease-out 0s;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuoteSectionComponent implements OnInit {
  @Input() service = 'Web Development';
  /** 'dark' (default) or 'light' colour theme. */
  @Input() theme: 'dark' | 'light' = 'dark';
  /** Left-side image; defaults to the web development devices mock-up. */
  @Input() image = 'assets/images/web-form.webp';
  @Input() imageAlt = 'Web design and development projects shown across desktop, laptop, tablet and phone';
  @Input() imageWidth = 750;
  @Input() imageHeight = 560;

  readonly bookingUrl = 'https://calendar.app.google/mezjQ2cpZyzbixNv6';
  readonly services = [
    'Web Development',
    'Mobile App Development',
    'Game Development',
    'Digital Marketing',
    'AI & Emerging Tech',
  ];
  readonly budgets = [
    'Under $5,000',
    '$5,000 – $15,000',
    '$15,000 – $50,000',
    '$50,000+',
    'Not sure yet',
  ];
  readonly mail = 'business@carinasoftlabs.com';
  readonly phone = '91319 58215';
  readonly address =
    '10/2, 2nd Floor, Shree Mahadeo House, near Hotel Surya, Sriram Nagar, South Tukoganj, Indore, (M.P.) 452001';

  quoteForm: UntypedFormGroup;
  submitted = false;
  loading = false;

  constructor(
    fb: UntypedFormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.quoteForm = fb.group({
      name: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(15)]],
      service: ['', Validators.required],
      budget: [''],
      message: [''],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  onSubmit(): void {
    if (this.loading) return;
    for (const field of ['name', 'email', 'phone', 'message']) {
      const control = this.quoteForm.get(field);
      control?.setValue((control.value || '').trim(), { emitEvent: false });
    }
    this.submitted = true;
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { name, email, phone, message, service, budget } = this.quoteForm.value;
    this.contactService.Add(name, email, phone, message, '', budget, service).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status !== 'success') {
          this.notify(response.message || 'Unable to submit your enquiry. Please try again.');
          return;
        }
        this.submitted = false;
        this.resetForm();
        this.notify('Data submitted successfully');
        this.router.navigate(['/thank-you']);
      },
      error: (error) => {
        this.loading = false;
        this.notify(error.message);
      },
    });
  }

  ngOnInit(): void {
    this.quoteForm.patchValue({ service: this.service });
  }

  private resetForm(): void {
    this.quoteForm.reset({
      name: '',
      email: '',
      phone: '',
      service: this.service,
      budget: '',
      message: '',
      termsAccepted: false,
    });
  }

  private notify(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
