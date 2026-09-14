import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'app/website/contact/contact.service';
import { Router } from '@angular/router'; // Import the Router

@Component({
    selector: 'app-getinform',
    templateUrl: './getinform.component.html',
    styleUrls: ['./getinform.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GetinformComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() imgSrc: string | null = null; 
  mail = 'business@carinasoftlabs.com';

  rangeValue: number = 500;
  getinformForm: UntypedFormGroup;
  submitted: boolean | undefined;
  loading: boolean | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    private service: ContactService,
    private snackBar: MatSnackBar,
     private router: Router // Inject Router here
  ) {
    this.getinformForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      message: [''],
    });
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

    snackBarRef.afterDismissed().subscribe(() => {});
  }

  onSave() {
    this.submitted = true;
    if (this.getinformForm.invalid) {
      return;
    }
    this.loading = true;
    this.service
      .addService(
        this.getinformForm.value.name,
        this.getinformForm.value.email,
        this.getinformForm.value.phone,
        this.getinformForm.value.message,
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.submitted = false;
          this.getinformForm.reset();
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
}
