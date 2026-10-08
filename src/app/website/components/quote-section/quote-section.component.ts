import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContactService } from 'app/website/contact/contact.service';

@Component({
  selector: 'app-quote-section',
  templateUrl: './quote-section.component.html',
  // Keep autofilled fields on the dark background instead of the browser's blue/grey fill.
  styles: [
    `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-text-fill-color: #b4b9cb;
        caret-color: #b4b9cb;
        -webkit-box-shadow: 0 0 0 1000px #0b0c10 inset;
        transition: background-color 9999s ease-out 0s;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuoteSectionComponent implements OnInit {
  @Input() service = 'Web Development';

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
