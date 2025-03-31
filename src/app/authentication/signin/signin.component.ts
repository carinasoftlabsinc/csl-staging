import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Role } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Subscription } from "rxjs";
import { AuthService } from "../authServices";
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  private authStatusSub!: Subscription;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.loading = false;
      }
    );
    this.authForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  // adminSet() {
  //   this.authForm.get('username')?.setValue('admin@software.com');
  //   this.authForm.get('password')?.setValue('admin@123');
  // }
  // employeeSet() {
  //   this.authForm.get('username')?.setValue('employee@software.com');
  //   this.authForm.get('password')?.setValue('employee@123');
  // }
  // clientSet() {
  //   this.authForm.get('username')?.setValue('client@software.com');
  //   this.authForm.get('password')?.setValue('client@123');
  // }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Email and Password not valid !';
      return;
    } else {

      this.authService.login(this.f['email'].value, this.f['password'].value);
      this.loading = true;    
    }
  }

   override ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
