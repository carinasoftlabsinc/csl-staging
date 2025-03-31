import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'app/authentication/authServices';
import { PaySlipServices } from '../get-all-pay-slip/service';
import { EmployeesDataService } from 'app/admin/employees/services';

@Component({
  selector: 'app-create-pay-slip',
  templateUrl: './create-pay-slip.component.html',
  styleUrls: ['./create-pay-slip.component.scss'],
})
export class CreatePaySlipComponent implements OnInit {
  form!: FormGroup;
  public mode = 'add';
  private ID!: string | null;
  private authStatusSub!: Subscription;
  isLoading = false;
  userIsAuthenticated: any;
  numRegex = /^-?\d*[.,]?\d{0,4}$/;
  year: any;
  monthOptions: { label: string; value: number }[] = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];


  @ViewChild('formDirective') private formDirective!: NgForm;
  username: any;
  employees: any;
  yearOptions: number[] = [];
  data!: { _id: any; employeeId: any; salaryMonth: any; salaryYear: any; basicWage: any; HRA: any; conveyanceAllowance: any; medicalAllowance: any; otherAllowance: any; EPF: any; ESI_HealthInsurance: any; professionalTax: any; loanRecovery: any; leaveDeductionAmount: any; totalEarning: any; totalDeduction: any; netSalary: any; };
  otherAllowance!: FormArray;
  constructor(
    private service: PaySlipServices,
    private dataService: EmployeesDataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
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
    this.fetchEmployees();
    this.form = new FormGroup({
      employeeId: new FormControl(null, {
        validators: [Validators.required],
      }),
      salaryYear: new FormControl(null, {
        validators: [Validators.required],
      }),
      salaryMonth: new FormControl(null, {
        validators: [Validators.required],
      }),
      basicWage: new FormControl(null, [Validators.pattern(this.numRegex)]),
      HRA: new FormControl(null, [Validators.pattern(this.numRegex)]),
      conveyanceAllowance: new FormControl(null, [
        Validators.pattern(this.numRegex),
      ]),
      medicalAllowance: new FormControl(null, [Validators.pattern(this.numRegex)]),
      EPF: new FormControl(null, [Validators.pattern(this.numRegex)]),
      ESI_HealthInsurance: new FormControl(null, [Validators.pattern(this.numRegex)]),
      professionalTax: new FormControl(null, [Validators.pattern(this.numRegex)]),
      loanRecovery: new FormControl(null, [Validators.pattern(this.numRegex)]),
      leaveDeductionAmount: new FormControl(null, [Validators.pattern(this.numRegex)]),
      totalEarning: new FormControl(null, [Validators.pattern(this.numRegex)]),
      totalDeduction: new FormControl(null, [Validators.pattern(this.numRegex)]),
      netSalary: new FormControl(null, [Validators.pattern(this.numRegex)]),
      // Add a FormArray for otherAllowance
      otherAllowance: this.fb.array([]),
    });

    // Populate yearOptions with a range of years
    const currentDate = new Date();
    this.year = currentDate.getFullYear();
    const startYear = this.year - 5; // 5 years back from the current year
    for (let i = startYear; i <= this.year; i++) {
      this.yearOptions.push(i);
    }


    console.log(this.yearOptions)
    // Subscribe to the value changes of the individual earning and deduction fields
    this.form.get('basicWage')?.valueChanges.subscribe(() => this.updateTotals());
    this.form.get('HRA')?.valueChanges.subscribe(() => this.updateTotals());
    this.form.get('conveyanceAllowance')?.valueChanges.subscribe(() => this.updateTotals());
    this.form.get('medicalAllowance')?.valueChanges.subscribe(() => this.updateTotals());
    this.form.get('EPF')?.valueChanges.subscribe(() => this.updateTotals());
    this.form.get('ESI_HealthInsurance')?.valueChanges.subscribe(() => this.updateTotals());
    this.form.get('professionalTax')?.valueChanges.subscribe(() => this.updateTotals());
    this.form.get('loanRecovery')?.valueChanges.subscribe(() => this.updateTotals());
    this.form.get('leaveDeductionAmount')?.valueChanges.subscribe(() => this.updateTotals());

    const otherAllowanceArray = this.form.get('otherAllowance') as FormArray;
  otherAllowanceArray.valueChanges.subscribe(() => this.updateTotals());

    // // Fetch otherAllowance controls
    // this.otherAllowanceControls;
    this.FORM();
  }



  get otherAllowanceControls() {
    return <FormArray>this.form.get('otherAllowance');
  }

  createItem() {
    return this.fb.group({
      fieldName: [''],
      value: [null]
    }
    );
  }

  editItem(otherAllowance?: any, index?: any) {

    this.otherAllowance = this.form.get('otherAllowance') as FormArray;
    let X: FormGroup;

    X = this.fb.group({
      fieldName: new FormControl(otherAllowance.fieldName),
      value: new FormControl(otherAllowance.value)
    })
    this.otherAllowance.push(X);
  }

  // Add methods to handle adding and removing otherAllowance fields
  addOtherAllowance() {
    // Add the new otherAllowance group to the FormArray
    (this.form.get('otherAllowance') as FormArray).push(this.createItem());
    // this.updateTotals();
  }

  removeOtherAllowance(index: number) {
    // Remove the otherAllowance group from the FormArray
    (this.form.get('otherAllowance') as FormArray).removeAt(index);
    this.updateTotals();
  }

  FORM() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.ID = paramMap.get('id');
        this.isLoading = true;
        this.service.getByID(this.ID ?? '').subscribe(data => {
          this.isLoading = false;
          data.otherAllowance.map((res: any, index: any) => {
            this.editItem(res, index);
          });
          this.data = {
            _id: data._id,
            employeeId: data.employeeId,
            salaryMonth: data.salaryMonth,
            salaryYear: data.salaryYear,
            basicWage: data.basicWage,
            HRA: data.HRA,
            conveyanceAllowance: data.conveyanceAllowance,
            medicalAllowance: data.medicalAllowance,
            otherAllowance: data.otherAllowance,
            EPF: data.EPF,
            ESI_HealthInsurance: data.ESI_HealthInsurance,
            professionalTax: data.professionalTax,
            loanRecovery: data.loanRecovery,
            leaveDeductionAmount: data.leaveDeductionAmount,
            totalEarning: data.totalEarning,
            totalDeduction: data.totalDeduction,
            netSalary: data.netSalary,
          };
          this.form.setValue({
            employeeId: this.data.employeeId,
            salaryMonth: this.data.salaryMonth,
            salaryYear: this.data.salaryYear,
            basicWage: this.data.basicWage,
            HRA: this.data.HRA,
            conveyanceAllowance: this.data.conveyanceAllowance,
            medicalAllowance: this.data.medicalAllowance,
            EPF: this.data.EPF,
            ESI_HealthInsurance: this.data.ESI_HealthInsurance,
            professionalTax: this.data.professionalTax,
            loanRecovery: this.data.loanRecovery,
            leaveDeductionAmount: this.data.leaveDeductionAmount,
            totalEarning: this.data.totalEarning,
            totalDeduction: this.data.totalDeduction,
            netSalary: this.data.netSalary,
            
            otherAllowance: this.data.otherAllowance,
          });
        });
      } else {
        this.mode = 'add';
        this.isLoading = false;
        this.ID = null;
      }
    });
  }

  fetchEmployees() {
    this.dataService.getEmployees().subscribe({
      next: (value: any) => {
        this.employees = value.data.data;
      },
      error: (error: any) => {
        // Error handler
        console.error('Error occurred:', error);
      },
      complete: () => {
        // Complete handler
        console.log('Observable completed.');
      },
    });
  }

  updateTotals() {
    const totalEarning = this.calculateTotalEarning();
    const totalDeduction = this.calculateTotalDeduction();

    this.form.get('totalEarning')?.setValue(totalEarning);
    this.form.get('totalDeduction')?.setValue(totalDeduction);
    this.form.get('netSalary')?.setValue(totalEarning - totalDeduction);
  }

  
  sumOtherAllowanceValues(): number {
    let total = 0;
    const otherAllowanceArray = this.form.get('otherAllowance') as FormArray;
    otherAllowanceArray.controls.forEach((control) => {
      const value = control.get('value')?.value;
      if (value !== null && !isNaN(parseFloat(value))) {
        total += parseFloat(value);
      }
    });
    return total;
  }
  

  calculateTotalEarning(): number {
    return (
      +this.form.get('basicWage')?.value +
      +this.form.get('HRA')?.value +
      +this.form.get('conveyanceAllowance')?.value +
      +this.form.get('medicalAllowance')?.value +
      this.sumOtherAllowanceValues()
    );
  }

  calculateTotalDeduction(): number {
    return (
      +this.form.get('EPF')?.value +
      +this.form.get('ESI_HealthInsurance')?.value +
      +this.form.get('professionalTax')?.value +
      +this.form.get('loanRecovery')?.value +
      +this.form.get('leaveDeductionAmount')?.value
    );
  }


  onSave() {
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'add') {
      this.service.AddPaySlipData(
        this.form.value.employeeId,
        this.form.value.salaryMonth,
        this.form.value.salaryYear,
        this.form.value.basicWage,
        this.form.value.HRA,
        this.form.value.conveyanceAllowance,
        this.form.value.medicalAllowance,
        this.form.value.otherAllowance,
        this.form.value.EPF,
        this.form.value.ESI_HealthInsurance,
        this.form.value.professionalTax,
        this.form.value.loanRecovery,
        this.form.value.leaveDeductionAmount,
        this.form.value.totalEarning,
        this.form.value.totalDeduction,
        this.form.value.netSalary,
      );
      this.formDirective.resetForm();
    }else{
      this.service.UpdatePaySlipData(
        this.form.value.basicWage,
        this.form.value.HRA,
        this.form.value.conveyanceAllowance,
        this.form.value.medicalAllowance,
        this.form.value.otherAllowance,
        this.form.value.EPF,
        this.form.value.ESI_HealthInsurance,
        this.form.value.professionalTax,
        this.form.value.loanRecovery,
        this.form.value.leaveDeductionAmount,
        this.form.value.totalEarning,
        this.form.value.totalDeduction,
        this.form.value.netSalary,
        this.ID ?? ''
      )
    }
  }



  back() {
    this.router.navigateByUrl('/admin/payroll/pay-slip');
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.employees = [];
  }
}
