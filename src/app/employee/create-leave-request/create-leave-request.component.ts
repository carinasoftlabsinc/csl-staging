import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmployeesService } from '../employee.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'app/authentication/authServices';

@Component({
  selector: 'app-create-leave-request',
  templateUrl: './create-leave-request.component.html',
  styleUrls: ['./create-leave-request.component.scss']
})
export class CreateLeaveRequestComponent {
  form!: FormGroup;
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  username!: string | null;
  @ViewChild('formDirective') private formDirective!: NgForm;
  filteredDesignations?: { value: string; label: string }[];
  data!: { _id: any; employeeName: any; applyDate: any; fromDate: any; toDate: any; halfDay: any; leaveType: any; reason: any; };
  constructor(
    private service: EmployeesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe((isAuthenticated: any) => {
      this.isLoading = false;
      this.userIsAuthenticated = isAuthenticated;
    });
    this.username = this.authService.getuserName();
    console.log(this.username)
    this.form = new FormGroup({
      applyDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      fromDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      toDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      halfDay: new FormControl(""),
      leaveType: new FormControl(null, {
        validators: [Validators.required],
      }),
      reason: new FormControl(null, {
        validators: [Validators.required],
      }),
      employeeName: new FormControl(this.username),
    });
    this.FORM();
  }

  FORM() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.ID = paramMap.get('id');
        this.service.getReqByID(this.ID ?? '').subscribe(data => {
          this.isLoading = false;
          this.data = {
            _id: data.data._id,
            employeeName: data.data.employeeName,
            applyDate: data.data.applyDate,
            fromDate: data.data.fromDate,
            toDate: data.data.toDate,
            halfDay: data.data.halfDay,
            leaveType: data.data.leaveType,
            reason: data.data.reason,
          };
          this.form.setValue({
            applyDate: this.data.applyDate,
            fromDate: this.data.fromDate,
            toDate: this.data.toDate,
            halfDay: this.data.halfDay,
            leaveType: this.data.leaveType,
            reason: this.data.reason,
            employeeName: this.data.employeeName,
          });
        });
      } else {
        this.mode = 'add';
        this.isLoading = false;
        this.ID = null;
      }
    });
  }

  get applyDate() {
    return this.form.get('applyDate');
  }
  get fromDate() {
    return this.form.get('fromDate');
  }
  get toDate() {
    return this.form.get('toDate');
  }
  get leaveType() {
    return this.form.get('leaveType');
  }
  get reason() {
    return this.form.get('reason');
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'add') {
      this.service.AddLeaveReq(
        this.form.value.employeeName,
        this.form.value.applyDate,
        this.form.value.fromDate,
        this.form.value.toDate,
        this.form.value.halfDay,
        this.form.value.leaveType,
        this.form.value.reason
      );
      this.formDirective.resetForm();
    }else {
      this.service.Edit(
        this.form.value.applyDate,
        this.form.value.fromDate,
        this.form.value.toDate,
        this.form.value.halfDay,
        this.form.value.leaveType,
        this.form.value.reason,
        this.ID ?? ''
      )

    }
  }
  back() {
    this.router.navigateByUrl('/employee/LeaveRequest');
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
