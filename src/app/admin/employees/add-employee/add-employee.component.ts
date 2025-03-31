import { Component, OnInit, ViewChild } from '@angular/core';

import {
  FormControl,
  FormGroup,
  NgForm,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmployeesDataService } from '../services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'app/authentication/authServices';

// Define an interface for the designations object
interface DesignationOption {
  value: string;
  label: string;
}
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  form!: FormGroup;
  departments = [
    { value: 'game-department', label: 'Game Department' },
    { value: 'web-department', label: 'Web Department' },
    { value: 'design-department', label: 'Design Department' },
    { value: 'QA-department', label: 'QA Department' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'management', label: 'Management' },
    // Add other department options as needed.
  ];
  // Use the defined interface for the designations object
  // designations: { [key: string]: DesignationOption[] }  = {
  //   'game-department': [
  //     { value: 'game-developer', label: 'Game Developer' },
  //     { value: 'animator', label: 'Animator' },
  //     { value: 'graphic-designer', label: 'Graphic Designer' },
  //     // Add other game department designations as needed.
  //   ],
  //   'web-department': [
  //     { value: 'full-stack-developer', label: 'Full Stack Developer' },
  //     { value: 'frontend-developer', label: 'Frontend Developer' },
  //     { value: 'backend-developer', label: 'Backend Developer' },
  //     // Add other web department designations as needed.
  //   ],
  //   'design-department': [
  //     { value: 'ui/ux designer', label: 'UI/UX Designer' },
  //     { value: 'web-designer', label: 'WEB Designer' },
  //   ],
  //   'QA-department': [
  //     { value: 'QA Manual Tester', label: 'QA Manual Tester' },
  //     { value: 'Automation Tester', label: 'Automation Tester' },
  //     // Add other web department designations as needed.
  //   ],
  //   'digital-marketing': [
  //     { value: 'SEO Executive', label: 'SEO Executive' },
  //     { value: 'Operations Manager', label: 'Operations Manager' },
  //     // Add other web department designations as needed.
  //   ],
  //   // Add other departments and their corresponding designations as needed.
  // };
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  // numRegex = /^-?\d*[.,]?\d{0,4}$/;
  numRegex = /^((\\+91-?)|0)?[0-9]{10}$/;
  data!: {
    _id: any;
    name: any;
    email: any;
    profile_image: any;
    role: any;
    address: any;
    phone: any;
    active: any;
    gender: any;
    joinDate: any;
    addedBy: any;
    dob: any;
    designation: any;
    department: any;
    graduation: any;
    shifts: any;
    isProbation: any;
  };
  username!: string | null;
  @ViewChild('formDirective') private formDirective!: NgForm;
  filteredDesignations?: { value: string; label: string }[];

  constructor(
    private service: EmployeesDataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}


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
      role: new FormControl('Employee'),
      address: new FormControl(null, {
        validators: [Validators.required],
      }),
      phone: new FormControl(null, [Validators.required, Validators.pattern(this.numRegex)]),

      gender: new FormControl(null, {
        validators: [Validators.required],
      }),
      department: new FormControl(null, {
        validators: [Validators.required],
      }),
      designation: new FormControl(null, {
        validators: [Validators.required],
      }),
      dob: new FormControl(null),
      joinDate: new FormControl(null),
      graduation: new FormControl(null),
      shifts: new FormControl(null),
      isProbation: new FormControl(null),
      addedBy: new FormControl(this.username),
    });
    this.FORM();
  }

  FORM() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.ID = paramMap.get('id');
        this.service.getByID(this.ID ?? '').subscribe((data) => {
          this.isLoading = false;
          this.data = {
            _id: data.data.data._id,
            name: data.data.data.name,
            email: data.data.data.email,
            profile_image: data.data.data.profile_image,
            department: data.data.data.department,
            designation: data.data.data.designation,
            role: data.data.data.role,
            address: data.data.data.address,
            phone: data.data.data.phone,
            dob: data.data.data.dob,
            gender: data.data.data.gender,
            joinDate: data.data.data.joinDate,
            graduation: data.data.data.graduation,
            shifts: data.data.data.shifts,
            isProbation: data.data.data.isProbation,
            addedBy: data.data.data.addedBy,
            active: data.data.data.active,
          };

          this.form.setValue({
            name: this.data.name,
            email: this.data.email,
            role: this.data.role,
            department: this.data.department,
            designation: this.data.designation,
            address: this.data.address,
            phone: this.data.phone,
            dob: this.data.dob,
            gender: this.data.gender,
            graduation: this.data.graduation,
            shifts: this.data.shifts,
            isProbation: this.data.isProbation,
            joinDate: this.data.joinDate,
            password: '',
            passwordConfirm: '',
            addedBy: '',
          });
          // this.updateDesignations();
        });
      } else {
        this.mode = 'add';
        this.ID = null;
      }
    });
  }



  passwordFieldType: string = 'password';
  passwordConfirmFieldType: string = 'password';

  public togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }
  public togglePasswordConfirmVisibility(): void {
    this.passwordConfirmFieldType = this.passwordConfirmFieldType === 'password' ? 'text' : 'password';
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  get email() {
    return this.form.get('email');
  }
  get name() {
    return this.form.get('name');
  }
  get address() {
    return this.form.get('address');
  }
  get phone() {
    return this.form.get('phone');
  }
  get gender() {
    return this.form.get('gender');
  }



  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'add') {
      this.service.Add(
        this.form.value.name,
        this.form.value.email,
        this.form.value.password,
        this.form.value.passwordConfirm,
        this.form.value.role,
        this.form.value.department,
        this.form.value.designation,
        this.form.value.phone,
        this.form.value.address,
        this.form.value.dob,
        this.form.value.gender,
        this.form.value.joinDate,
        this.form.value.addedBy,
        this.form.value.graduation,
        this.form.value.shifts,
        this.form.value.isProbation
      );
      // this.formDirective.resetForm();
    } else {
      this.service.Edit(
        this.form.value.name,
        this.form.value.email,
        this.form.value.department,
        this.form.value.designation,
        this.form.value.role,
        this.form.value.address,
        this.form.value.phone,
        this.form.value.dob,
        this.form.value.gender,
        this.form.value.graduation,
        this.form.value.shifts,
        this.ID ?? ''
      );
    }
  }
  back() {
    this.router.navigateByUrl('/admin/employees/allEmployees');
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


}
