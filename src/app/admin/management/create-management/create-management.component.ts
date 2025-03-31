import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators,AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'app/authentication/authServices';

@Component({
  selector: 'app-create-management',
  templateUrl: './create-management.component.html',
  styleUrls: ['./create-management.component.scss']
})
export class CreateManagementComponent implements OnInit {
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  form!: FormGroup;
  public mode = "add";
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  numRegex = /^((\\+91-?)|0)?[0-9]{10}$/;
  data!: { _id: any; name: any; email: any; profile_image: any; role: any; address: any; phone: any; active: any; gender: any, joinDate: any, addedBy: any, dob:any };

  @ViewChild('formDirective') private formDirective!: NgForm;
  username: any;
  constructor(
    private service: DataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: any) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.username = this.authService.getuserName();
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null),
      passwordConfirm: new FormControl(null),
      role: new FormControl(null, {
        validators: [Validators.required],
      }),
      address: new FormControl(null, {
        validators: [Validators.required],
      }),
      phone: new FormControl(null, [Validators.required, Validators.pattern(this.numRegex)]),
      gender: new FormControl(null, {
        validators: [Validators.required],
      }),
      dob: new FormControl(null),
      joinDate: new FormControl(null),
      addedBy: new FormControl(this.username)
    });

    this.FORM();
  }

  FORM() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.isLoading = true;
        this.mode = "edit";
        this.ID = paramMap.get("id");
        this.service.getByID(this.ID ?? '').subscribe(data => {
          this.isLoading = false;
          this.data = {
            _id: data.data.data._id,
            name: data.data.data.name,
            email: data.data.data.email,
            profile_image: data.data.data.profile_image,
            role: data.data.data.role,
            address: data.data.data.address,
            phone: data.data.data.phone,
            dob: data.data.data.dob,
            gender: data.data.data.gender,
            joinDate: data.data.data.joinDate,
            addedBy:data.data.data.addedBy,
            active: data.data.data.active,
          };
          this.form.setValue({
            name: this.data.name,
            email: this.data.email,
            role: this.data.role,
            address: this.data.address,
            phone: this.data.phone,
            dob: this.data.dob,
            gender: this.data.gender,
            joinDate: this.data.joinDate,
            password: '',
            passwordConfirm: '',
            addedBy: "",
          });
        });
      } else {
        this.mode = "add";
        this.ID = null;
      }
    });
  }

  get email() { return this.form.get('email'); };
  get name() { return this.form.get('name'); };
  get role() { return this.form.get('role'); };
  get address() { return this.form.get('address'); };
  get phone() { return this.form.get('phone'); };
  get gender() { return this.form.get('gender'); };

  passwordFieldType: string = 'password';
  passwordConfirmFieldType: string = 'password';

  // togglePasswordVisibility() {
  //   this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  // }

  // togglePasswordConfirmVisibility() {
  //   this.passwordConfirmFieldType = this.passwordConfirmFieldType === 'password' ? 'text' : 'password';
  // }

  public togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }
  public togglePasswordConfirmVisibility(): void {
    this.passwordConfirmFieldType = this.passwordConfirmFieldType === 'password' ? 'text' : 'password';
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  onSave() {

    if (this.form.invalid) {
      return
    }

    if (this.mode === "add") {
      this.service.Add(
        this.form.value.name,
        this.form.value.email,
        this.form.value.password,
        this.form.value.passwordConfirm,
        this.form.value.role,
        this.form.value.address,
        this.form.value.phone,
        this.form.value.dob,
        this.form.value.gender,
        this.form.value.joinDate,
        this.form.value.addedBy,
      )
      // this.formDirective.resetForm();
    } else {
      this.service.Edit(
        this.form.value.name,
        this.form.value.email,
        this.form.value.role,
        this.form.value.address,
        this.form.value.phone,
        this.form.value.dob,
        this.form.value.gender,
        this.ID ?? ''
      )

    }

  }

  back() {
    this.router.navigateByUrl('/admin/management/all-management')
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  validatePhone(control: AbstractControl): { [key: string]: any } | null {
    console.log(control.value)
    const phoneNumber = control.value;
    const numRegex = /^[0-9]+$/; // Regular expression for numeric characters
      // console.log(phoneNumber.length)
      console.log(typeof phoneNumber)
    if (!phoneNumber || phoneNumber.length !== 10 || !numRegex.test(phoneNumber)) {
      return { invalidPhone: true };
    }
    return null;
  }
}
