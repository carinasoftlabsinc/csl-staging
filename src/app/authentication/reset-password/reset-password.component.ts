import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
// import icVisibility from '@iconify/icons-ic/twotone-visibility';
// import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { AuthService } from '../authServices';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  form: FormGroup;
  private token: string = '';
  visible = false;
  inputType = 'password';
  hide = true;
  // icVisibility = icVisibility;
  // icVisibilityOff = icVisibilityOff;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService,
  ) {{
        this.form = this.fb.group({
          // Define your form controls here
          password: ['', [Validators.required]],
          passwordConfirm: ['', [Validators.required]],
        });
      } }

  ngOnInit() {
   this.route.paramMap.subscribe((paramMap: ParamMap) => {
     if(paramMap.has('token')) {
      this.token = paramMap.get("token") ?? '';
      
     }
   })
  }


  onReset(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.resetPassword(form.value.password, form.value.passwordConfirm,this.token);
 }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  btnClick() {
    this.router.navigate(['/signin']);
  }
}
