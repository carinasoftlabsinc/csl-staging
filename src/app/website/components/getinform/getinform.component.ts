import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'app/website/contact/contact.service';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/service/analytics.service';

@Component({
  selector: 'app-getinform',
  templateUrl: './getinform.component.html',
  styleUrls: ['./getinform.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class GetinformComponent implements OnInit {
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() imgSrc: string | null = null;
  @Input() servicePreset: string = '';
  @Input() formOnly = false;
  @Input() bookingUrl = 'https://calendar.app.google/A5eDKdLkRDF9KokT7';
  mail = 'business@carinasoftlabs.com';

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
  getinformForm: UntypedFormGroup;
  submitted = false;
  loading = false;

  constructor(
    private fb: UntypedFormBuilder,
    private service: ContactService,
    private snackBar: MatSnackBar,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {
    this.getinformForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      service: ['', Validators.required],
      budget: [''],
      message: [''],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    if (this.servicePreset) {
      this.getinformForm.patchValue({ service: this.servicePreset });
    }
  }

  private showSuccessMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });

    snackBarRef.afterDismissed().subscribe(() => {});
  }

  private showErrorMessage(message: string) {
    const snackBarRef = this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });

    snackBarRef.afterDismissed().subscribe(() => {});
  }

  onSave() {
    if (this.loading) return;
    for (const field of ['name', 'email', 'phone', 'message']) {
      const control = this.getinformForm.get(field);
      control?.setValue((control.value || '').trim(), { emitEvent: false });
    }
    this.submitted = true;
    if (this.getinformForm.invalid) {
      this.getinformForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const form = this.getinformForm.value;
    this.service
      .Add(
        form.name.trim(),
        form.email.trim(),
        form.phone.trim(),
        form.message.trim(),
        '',
        form.budget,
        form.service
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.status !== 'success') {
            this.showErrorMessage(response.message || 'Unable to submit your enquiry. Please try again.');
            return;
          }
          this.submitted = false;

          // Track GA4 generate_lead conversion event
          this.analyticsService.trackGenerateLead({
            formName: 'Lead Capture Form — ' + form.service,
            category: 'lead_generation',
          });

          this.getinformForm.reset({
            name: '',
            phone: '',
            email: '',
            service: this.servicePreset || '',
            budget: '',
            message: '',
            termsAccepted: false,
          });
          this.showSuccessMessage('Data submitted successfully');
          this.router.navigate(['/thank-you']);
        },
        error: (error) => {
          this.loading = false;
          console.error(error);
          this.showErrorMessage(error.message);
        },
      });
  }
}
