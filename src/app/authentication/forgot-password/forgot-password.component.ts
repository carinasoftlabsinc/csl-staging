import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  NgForm
} from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthService } from '../authServices';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  isLoading = false;
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.authForm.controls;
  }

  // onSubmit() {
  //   if (this.authForm.invalid) {
  //     return;
  //   } else {
  //     this.isLoading = true;
  //     this.authService.forgotPassword(this.authForm.value.email);
  //     this.router.navigate(['/signin']);
  //     const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(
  //       'Reset link sent to your email',
  //       '',
  //       {
  //         duration: 2000,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'right',
  //         panelClass: 'snackbar-success',
  //       }
  //     );
  //   }
  // }
  


  onSubmit() {
    if (this.authForm .invalid) {
      return;
    }

    this.submitted = true;
    this.authService.forgotPassword(this.authForm.value)
    this.router.navigate(['/signin']);
  }
}
